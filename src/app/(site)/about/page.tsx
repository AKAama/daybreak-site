import Image from 'next/image'
import Link from 'next/link'
import { PageShell } from '@/components/PageShell'
import { getSiteData } from '@/lib/data'
import { FALLBACK_LOGO, mediaUrl } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const { settings } = await getSiteData()
  return buildMetadata({
    title: '关于我们',
    description: '南京破晓 DAYBREAK 厂牌故事：从南京的街头出发，用篮球记录属于我们的故事。',
    pathname: '/about',
    siteName: settings?.siteTitle,
    image: settings?.seoDefaultImage,
  })
}

export default async function AboutPage() {
  const { home, settings } = await getSiteData()
  const logo = mediaUrl(settings?.logo) || FALLBACK_LOGO
  const links = settings?.socialLinks ?? []

  return (
    <PageShell
      eyebrow="03 / ABOUT DAYBREAK"
      title={
        <>
          南京破晓
          <br />
          <span className="text-blaze">DAYBREAK.</span>
        </>
      }
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="max-w-[720px]">
          <Image
            src={logo}
            alt="南京破晓 DAYBREAK 厂牌标识"
            width={220}
            height={220}
            className="mb-9 h-[150px] w-[150px] object-contain lg:h-[200px] lg:w-[200px]"
          />
          <p className="text-[19px] leading-[2.1] sm:text-[21px]">
            {home?.aboutText || '从南京的街头出发，用篮球记录属于我们的故事。'}
          </p>
          <p className="mt-7 font-display text-lg font-bold tracking-[0.35em] text-blaze">
            MORE THAN BASKETBALL.
          </p>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/players" className="cta">
              查看球员 ↗
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-4 border border-line px-6 py-3.5 text-[15px] font-black text-paper transition-colors hover:border-blaze hover:text-blaze"
            >
              球队影像 ↗
            </Link>
          </div>
        </div>

        <aside className="border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-2">
          <h2 className="font-display text-base font-bold tracking-[0.14em] text-mute">CONTACT</h2>
          {settings?.contactEmail ? (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="mt-3 block break-all text-[17px] text-paper transition-colors hover:text-blaze"
            >
              {settings.contactEmail}
            </a>
          ) : (
            <p className="mt-3 text-sm text-concrete">联系邮箱待后台配置。</p>
          )}

          <h2 className="mt-9 font-display text-base font-bold tracking-[0.14em] text-mute">FOLLOW</h2>
          {links.length ? (
            <ul className="mt-3 space-y-2 text-[15px]">
              {links.map((link) => (
                <li key={`${link.platform}-${link.url}`}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-paper transition-colors hover:text-blaze"
                  >
                    {link.platform.toUpperCase()}
                    {link.label ? <span className="ml-2 text-concrete">{link.label}</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-concrete">社交账号待后台配置。</p>
          )}
        </aside>
      </div>
    </PageShell>
  )
}
