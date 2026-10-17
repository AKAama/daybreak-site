import type { Album, Homepage, Media, Player, SiteSetting } from '../payload-types'

/**
 * Payload 生成的类型里，关系字段既可能是 ID 也可能是已 populate 的文档，
 * 且非必填字段带 null。前台需要的是「一定已展开、一定非空」的视图，
 * 这层视图类型 + data.ts 里的 normalize 函数把这个约定固化下来，
 * 顺带保证未发布内容不会带着裸 ID 漏到页面上。
 */
export type PlayerView = Omit<Player, 'slug' | 'portrait' | 'avatar'> & {
  slug: string
  portrait: Media | null
  avatar: Media | null
}

export type AlbumPhotoView = { id?: string | null; image: Media; caption?: string | null }

export type AlbumView = Omit<Album, 'slug' | 'cover' | 'photos' | 'players'> & {
  slug: string
  cover: Media | null
  photos: AlbumPhotoView[]
  players: PlayerView[]
}

export type HomepageView = Omit<
  Homepage,
  'heroImage' | 'heroVideo' | 'featuredPlayers' | 'featuredAlbums'
> & {
  heroImage: Media | null
  heroVideo: Media | null
  featuredPlayers: PlayerView[]
  featuredAlbums: AlbumView[]
}

export type SettingsView = Omit<SiteSetting, 'logo' | 'seoDefaultImage'> & {
  logo: Media | null
  seoDefaultImage: Media | null
}

export type { Media }
