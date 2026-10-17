import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { onlyAdmin, publicRead } from '../lib/access'

// staticDir 的相对路径按 process.cwd() 解析，容器内会落到 /media 而挂不到 uploads 卷，
// 因此固定解析到项目根目录下的 media。
const dirname = path.dirname(fileURLToPath(import.meta.url))

const isSame = (a: unknown, b: unknown) => String(a) === String(b)
const idOf = (value: unknown) =>
  value && typeof value === 'object' ? (value as { id?: unknown }).id : value

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { useAsTitle: 'alt' },
  access: {
    // 图片 URL 需要能被匿名访客的 <img> 直接读取
    read: publicRead,
    create: onlyAdmin,
    update: onlyAdmin,
    delete: onlyAdmin,
  },
  hooks: {
    // PRD 5.1：被引用的媒体不允许直接删除，避免出现前台断图
    beforeDelete: [
      async ({ id, req }) => {
        const usedBy: string[] = []

        const players = await req.payload.find({ collection: 'players', limit: 0, req })
        for (const player of players.docs) {
          if (isSame(idOf(player.portrait), id) || isSame(idOf(player.avatar), id))
            usedBy.push(`球员「${player.name}」`)
        }

        const albums = await req.payload.find({ collection: 'albums', limit: 0, req })
        for (const album of albums.docs) {
          const inAlbum =
            isSame(idOf(album.cover), id) ||
            (album.photos || []).some(photo => isSame(idOf(photo.image), id))
          if (inAlbum) usedBy.push(`相册「${album.title}」`)
        }

        for (const slug of ['homepage', 'site-settings'] as const) {
          const doc = await req.payload.findGlobal({ slug, req }) as Record<string, unknown>
          const label = slug === 'homepage' ? '首页' : '站点设置'
          const keys = slug === 'homepage' ? ['heroImage', 'heroVideo'] : ['logo', 'seoDefaultImage']
          if (keys.some(key => isSame(idOf(doc[key]), id))) usedBy.push(`${label}配置`)
        }

        if (usedBy.length)
          throw new APIError(`该文件仍被引用，无法删除：${usedBy.join('、')}。请先解除引用。`, 400)
      },
    ],
  },
  upload: {
    staticDir: path.resolve(dirname, '../media'),
    // 只放行网页常用图片格式；heroVideo 需要视频，故额外允许两种浏览器可播容器
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm'],
    imageSizes: [
      { name: 'card', width: 600, height: 800, position: 'centre' },
      { name: 'thumb', width: 480, height: 320, position: 'centre' },
      { name: 'hero', width: 1920 },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'text' },
    { name: 'credit', type: 'text' },
  ],
}
