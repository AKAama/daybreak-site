import type { Media } from '../payload-types'

/**
 * Payload 本地存储会用 serverURL 拼出绝对地址，一旦实际访问的域名或端口与它
 * 不一致（多环境、反向代理、本地换端口），next/image 会直接报错、<video> 也会 404。
 * 自有存储的文件本来就由本应用的 /api/media/file 提供，所以统一降级成同源路径。
 */
const toSameOrigin = (url: string) => {
  if (!url.startsWith('http')) return url
  try {
    const parsed = new URL(url)
    const configured = process.env.NEXT_PUBLIC_SITE_URL
    const isOwnHost = configured ? parsed.host === new URL(configured).host : false
    if (!isOwnHost && !parsed.pathname.startsWith('/api/media/file/')) return url
    return `${parsed.pathname}${parsed.search}`
  } catch {
    return url
  }
}

/** 取指定尺寸的 URL，尺寸缺失时回退到原图 */
export function mediaUrl(media: Media | null | undefined, size?: 'hero' | 'card' | 'thumb') {
  if (!media) return ''
  return toSameOrigin((size && media.sizes?.[size]?.url) || media.url || '')
}

export const isVideo = (media: Media | null | undefined) => Boolean(media?.mimeType?.startsWith('video/'))

export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000'

export const absoluteUrl = (pathname: string) => `${siteUrl()}${pathname}`

/** 后台未配置 Logo 时使用的仓库内标识 */
export const FALLBACK_LOGO = '/logo.jpg'
