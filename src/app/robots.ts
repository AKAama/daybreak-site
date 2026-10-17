import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/media'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // FR-08：后台与 REST/GraphQL 接口不进入索引
      disallow: ['/admin', '/api'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}
