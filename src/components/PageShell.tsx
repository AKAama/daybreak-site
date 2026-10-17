import type { ReactNode } from 'react'
import Link from 'next/link'

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="min-h-[80vh] px-[6%] pb-20 pt-[120px] lg:pt-[150px]">
      <span className="eyebrow">{eyebrow}</span>
      <h1 className="display mt-2 mb-4 text-[clamp(48px,7vw,108px)]">{title}</h1>
      {description && <p className="mb-10 mt-4 text-xs tracking-[0.12em] text-mute">{description}</p>}
      {children}
    </div>
  )
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="mb-8 inline-block font-display text-[13px] font-bold tracking-[0.14em] text-blaze transition-colors hover:text-blaze-bright"
    >
      {children}
    </Link>
  )
}
