import type { ReactNode } from 'react'
import Link from 'next/link'
import '../globals.css'
export const metadata={title:'南京破晓 DAYBREAK | Streetball Crew',description:'南京破晓街头篮球厂牌 — 不止于篮球。'}
export default function SiteLayout({children}:{children:ReactNode}){return <><header className="nav"><Link className="brand" href="/"><span>南京破晓</span><b>DAYBREAK</b></Link><nav><Link href="/">首页</Link><Link href="/players">球员阵容</Link><Link href="/gallery">球队风采</Link><Link href="/about">关于我们</Link></nav><Link className="nav-cta" href="/gallery">EXPLORE ↗</Link></header>{children}<footer className="footer"><strong>DAYBREAK<span>®</span></strong><p>NANJING STREETBALL CULTURE · 不止于篮球</p><small>© {new Date().getFullYear()} 南京破晓</small></footer></>}
