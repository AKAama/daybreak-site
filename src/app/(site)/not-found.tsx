import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] px-[6%] pb-20 pt-[130px]">
      <span className="eyebrow">404 / NOT FOUND</span>
      <h1 className="display mt-2 text-[clamp(56px,10vw,140px)]">页面不在场</h1>
      <p className="mt-5 max-w-[560px] text-sm leading-7 tracking-[0.06em] text-mute">
        这个地址没有对应的已发布内容，可能仍在草稿状态或已经下线。
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-6">
        <Link href="/" className="cta">
          返回首页 ↗
        </Link>
        <Link href="/players" className="text-link">
          球员阵容
        </Link>
      </div>
    </div>
  )
}
