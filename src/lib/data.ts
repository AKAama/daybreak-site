import { cache } from 'react'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import type { Album, Homepage, Media, Player, SiteSetting } from '../payload-types'
import type { AlbumPhotoView, AlbumView, HomepageView, PlayerView, SettingsView } from './types'

const PUBLISHED: Where = { status: { equals: 'published' } }
const publishedWhere = (slug: string): Where => ({ and: [{ slug: { equals: slug } }, PUBLISHED] })

const asDoc = <T>(value: unknown): T | null => (value && typeof value === 'object' ? (value as T) : null)
const asDocs = <T>(value: unknown): T[] =>
  Array.isArray(value) ? (value.filter((item) => typeof item === 'object') as T[]) : []
// 已发布文档的 slug 由集合钩子保证存在，这里只是把「非空」写进类型
const slugOf = (slug: string | null | undefined, id: number) => slug || String(id)

const toPlayer = (doc: Player): PlayerView => ({
  ...doc,
  slug: slugOf(doc.slug, doc.id),
  portrait: asDoc<Media>(doc.portrait),
  avatar: asDoc<Media>(doc.avatar),
})

const toAlbum = (doc: Album): AlbumView => ({
  ...doc,
  slug: slugOf(doc.slug, doc.id),
  cover: asDoc<Media>(doc.cover),
  players: asDocs<Player>(doc.players).map(toPlayer),
  photos: asDocs<AlbumPhotoView>(doc.photos).flatMap((photo) => {
    const image = asDoc<Media>(photo.image)
    return image ? [{ ...photo, image }] : []
  }),
})

const toHomepage = (doc: Homepage): HomepageView => ({
  ...doc,
  heroImage: asDoc<Media>(doc.heroImage),
  heroVideo: asDoc<Media>(doc.heroVideo),
  featuredPlayers: asDocs<Player>(doc.featuredPlayers).map(toPlayer),
  featuredAlbums: asDocs<Album>(doc.featuredAlbums).map(toAlbum),
})

const toSettings = (doc: SiteSetting): SettingsView => ({
  ...doc,
  logo: asDoc<Media>(doc.logo),
  seoDefaultImage: asDoc<Media>(doc.seoDefaultImage),
})

export async function cms() {
  return getPayload({ config })
}

/**
 * 前台数据统一从这里出：显式带 status 过滤，不依赖访问控制是否作用于本地 API。
 * 数据库不可用（如尚未初始化的本地环境）时返回空集，由页面渲染品牌化空状态。
 * cache() 让布局、metadata 与页面在同一次请求里共用一份查询结果。
 */
export const getSiteData = cache(async () => {
  const empty = {
    home: null as HomepageView | null,
    settings: null as SettingsView | null,
    players: [] as PlayerView[],
    albums: [] as AlbumView[],
  }
  try {
    const p = await cms()
    const [home, settings, players, albums] = await Promise.all([
      p.findGlobal({ slug: 'homepage', depth: 2 }),
      p.findGlobal({ slug: 'site-settings', depth: 1 }),
      p.find({ collection: 'players', where: PUBLISHED, sort: 'sortOrder', limit: 100, depth: 2 }),
      p.find({ collection: 'albums', where: PUBLISHED, sort: '-eventDate', limit: 30, depth: 2 }),
    ])
    return {
      home: toHomepage(home),
      settings: toSettings(settings),
      players: players.docs.map(toPlayer),
      albums: albums.docs.map(toAlbum),
    }
  } catch (error) {
    console.error('[daybreak] 读取 CMS 失败，前台回退到空状态：', error)
    return empty
  }
})

/** 首页精选：优先后台显式挑选，其次 featured 标记，最后回退到全部已发布内容 */
export function pickFeatured<T extends { featured?: boolean | null }>(
  curated: T[] | null | undefined,
  all: T[],
) {
  if (curated?.length) return curated
  const flagged = all.filter((item) => item.featured)
  return flagged.length ? flagged : all
}

export const getPlayer = cache(async (slug: string) => {
  const p = await cms()
  const players = await p.find({
    collection: 'players',
    where: publishedWhere(slug),
    limit: 1,
    depth: 2,
  })
  const doc = players.docs[0]
  if (!doc) return null

  const albums = await p.find({
    collection: 'albums',
    where: { and: [{ players: { in: [doc.id] } }, PUBLISHED] },
    sort: '-eventDate',
    limit: 6,
    depth: 1,
  })
  return { player: toPlayer(doc), albums: albums.docs.map(toAlbum) }
})

export const getAlbum = cache(async (slug: string) => {
  const p = await cms()
  const albums = await p.find({
    collection: 'albums',
    where: publishedWhere(slug),
    limit: 1,
    depth: 2,
  })
  const doc = albums.docs[0]
  return doc ? toAlbum(doc) : null
})
