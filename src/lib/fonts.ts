import { Barlow_Condensed } from 'next/font/google'

/**
 * 英文展示字体自托管：构建时下载并随站点同源发布，避免国内访客被
 * fonts.googleapis.com 的跨境请求拖慢首屏（原先是 CSS @import 阻塞加载）。
 * 中文沿用系统黑体栈，不引入 CJK 全量字体以守住首屏体积。
 */
export const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-barlow',
  display: 'swap',
})
