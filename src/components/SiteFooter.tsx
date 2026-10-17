import type { SettingsView } from '@/lib/types'

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  douyin: '抖音',
  weibo: '微博',
  bilibili: 'B站',
  xiaohongshu: '小红书',
  wechat: '微信公众号',
}

export function SiteFooter({ settings, slogan }: { settings: SettingsView | null; slogan: string }) {
  const links = settings?.socialLinks ?? []

  return (
    <footer className="border-t border-line px-[6%] pb-9 pt-14">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="display text-[54px] leading-none sm:text-[68px] lg:text-[80px]">
            DAYBREAK<span className="text-[20px] text-blaze">®</span>
          </p>
          <p className="mt-3 text-sm tracking-[0.14em] text-concrete">
            NANJING STREETBALL CULTURE · {slogan}
          </p>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-display text-base font-bold tracking-[0.14em] text-mute">FOLLOW US</p>
          {links.length ? (
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={`${link.platform}-${link.url}`}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-paper transition-colors hover:text-blaze"
                  >
                    {PLATFORM_LABELS[link.platform] ?? link.platform}
                    {link.label ? <span className="ml-2 text-concrete">{link.label}</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-concrete">社交账号待配置</p>
          )}
          {settings?.contactEmail && (
            <p className="mt-4">
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-paper transition-colors hover:text-blaze"
              >
                {settings.contactEmail}
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line/60 pt-6 text-xs tracking-[0.1em] text-concrete">
        <small>© {new Date().getFullYear()} 南京破晓 DAYBREAK</small>
        <a href="#top" className="transition-colors hover:text-blaze">
          回到顶部 ↑
        </a>
      </div>
    </footer>
  )
}
