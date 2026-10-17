import type { Metadata } from 'next'
import { mediaUrl, siteUrl } from './media'
import type { Media } from '../payload-types'

export const DEFAULT_TITLE = '南京破晓 DAYBREAK'
export const DEFAULT_DESCRIPTION =
  '南京破晓 DAYBREAK 是以南京街头篮球文化为核心的厂牌官网：球员阵容、球队影像与厂牌故事。不止于篮球。'

export function buildMetadata(input: {
  title?: string
  description: string
  pathname: string
  image?: Media | null
  siteName?: string | null
  type?: 'website' | 'article'
}): Metadata {
  const images = input.image
    ? [{ url: mediaUrl(input.image, 'hero'), alt: input.image.alt || input.title || DEFAULT_TITLE }]
    : []
  const title = input.title || DEFAULT_TITLE

  return {
    // 首页沿用布局里的默认标题，避免出现「南京破晓 | 南京破晓」
    ...(input.title ? { title: input.title } : {}),
    description: input.description,
    alternates: { canonical: input.pathname },
    openGraph: {
      type: input.type ?? 'website',
      url: input.pathname,
      siteName: input.siteName || DEFAULT_TITLE,
      title,
      description: input.description,
      locale: 'zh_CN',
      images,
    },
    twitter: {
      card: images.length ? 'summary_large_image' : 'summary',
      title,
      description: input.description,
      images,
    },
  }
}

export function rootMetadata(settings: { siteTitle?: string | null } | null): Metadata {
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: `${DEFAULT_TITLE} | Streetball Crew`,
      template: `%s | ${DEFAULT_TITLE}`,
    },
    description: DEFAULT_DESCRIPTION,
    applicationName: settings?.siteTitle || DEFAULT_TITLE,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      url: '/',
      siteName: settings?.siteTitle || DEFAULT_TITLE,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      locale: 'zh_CN',
    },
    robots: { index: true, follow: true },
  }
}
