import type { MetadataRoute } from 'next'
import { getSiteData } from '@/lib/data'
import { absoluteUrl } from '@/lib/media'

/** 与前台一样保持动态：新发布的相册与球员应立即出现在 sitemap 里 */
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { players, albums } = await getSiteData()

  return [
    ...['/', '/players', '/gallery', '/about'].map((pathname) => ({
      url: absoluteUrl(pathname),
      lastModified: new Date(),
    })),
    ...players.map((player) => ({
      url: absoluteUrl(`/players/${player.slug}`),
      lastModified: new Date(player.updatedAt),
    })),
    ...albums.map((album) => ({
      url: absoluteUrl(`/gallery/${album.slug}`),
      lastModified: new Date(album.eventDate ?? album.updatedAt),
    })),
  ]
}
