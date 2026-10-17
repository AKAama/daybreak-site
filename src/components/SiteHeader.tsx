'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV = [
  { href: '/', en: 'HOME', zh: '首页' },
  { href: '/players', en: 'ROSTER', zh: '球员阵容' },
  { href: '/gallery', en: 'CULTURE', zh: '球队风采' },
  { href: '/about', en: 'ABOUT', zh: '关于我们' },
]

const isActive = (href: string, pathname: string) =>
  href === '/' ? pathname === '/' : pathname.startsWith(href)

export function SiteHeader({ logoSrc, siteName }: { logoSrc: string; siteName: string }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 换页后收起移动菜单，避免停留在展开态
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled || open ? 'bg-ink/90 backdrop-blur-sm' : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      <div className="flex h-[70px] items-center justify-between px-[6%] lg:h-[84px]">
        <Link href="/" className="flex items-center gap-3" aria-label={`${siteName} 首页`}>
          <Image
            src={logoSrc}
            alt={`${siteName} 厂牌标识`}
            width={52}
            height={52}
            priority
            className="h-[46px] w-[46px] object-contain lg:h-[56px] lg:w-[56px]"
          />
          <span className="display text-[22px] not-italic leading-none tracking-tight lg:text-[26px]">
            DAY<span className="text-blaze">BREAK</span>
          </span>
        </Link>

        <nav aria-label="主导航" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href, pathname) ? 'page' : undefined}
              className={`font-display text-[15px] font-bold tracking-[0.12em] transition-colors hover:text-blaze ${
                isActive(item.href, pathname) ? 'text-blaze' : 'text-paper'
              }`}
            >
              {item.en}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/gallery" className="cta hidden lg:inline-flex">
            EXPLORE ↗
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? '关闭菜单' : '打开菜单'}
            className="p-2 text-paper lg:hidden"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="移动端导航"
          className="border-t border-line/60 bg-ink px-[6%] pb-8 pt-2 lg:hidden"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href, pathname) ? 'page' : undefined}
              className={`flex items-baseline justify-between border-b border-line/40 py-4 font-display text-2xl font-bold tracking-[0.1em] ${
                isActive(item.href, pathname) ? 'text-blaze' : 'text-paper'
              }`}
            >
              {item.en}
              <span className="font-sans text-sm tracking-normal text-concrete">{item.zh}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
