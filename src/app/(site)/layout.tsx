import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getSiteData } from '@/lib/data'
import { barlow } from '@/lib/fonts'
import { FALLBACK_LOGO, mediaUrl } from '@/lib/media'
import { rootMetadata } from '@/lib/seo'
import './globals.css'

/** 后台内容保存后前台即时可见，无需重新构建部署（PRD 5.1） */
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const { settings } = await getSiteData()
  return rootMetadata(settings)
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const { settings, home } = await getSiteData()

  return (
    <html lang="zh-CN" id="top" className={barlow.variable}>
      <body className="bg-ink text-paper">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-60 focus:bg-blaze focus:px-4 focus:py-2 focus:font-bold focus:text-ink"
        >
          跳到主要内容
        </a>
        <SiteHeader
          logoSrc={mediaUrl(settings?.logo) || FALLBACK_LOGO}
          siteName={settings?.siteTitle || '南京破晓 DAYBREAK'}
        />
        <main id="main">{children}</main>
        <SiteFooter settings={settings} slogan={home?.slogan || '不止于篮球'} />
      </body>
    </html>
  )
}
