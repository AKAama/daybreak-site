import Link from 'next/link'
import { AlbumTile, AlbumTilePlaceholder } from '@/components/AlbumTile'
import { HeroMedia } from '@/components/HeroMedia'
import { PlayerCard, PlayerCardPlaceholder } from '@/components/PlayerCard'
import { getSiteData, pickFeatured } from '@/lib/data'
import { buildMetadata, DEFAULT_DESCRIPTION } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const { settings } = await getSiteData()
  return buildMetadata({
    description: DEFAULT_DESCRIPTION,
    pathname: '/',
    siteName: settings?.siteTitle,
    image: settings?.seoDefaultImage,
  })
}

const GALLERY_PLACEHOLDERS = ['THE GAME', 'OUR CITY', 'STREET LIFE', 'PRACTICE', 'BEHIND THE SCENES']

export default async function Home() {
  const { home, players, albums } = await getSiteData()
  const roster = pickFeatured(home?.featuredPlayers, players).slice(0, 5)
  const culture = pickFeatured(home?.featuredAlbums, albums).slice(0, 5)

  return (
    <>
      <section className="grain relative flex h-[85vh] min-h-[640px] items-center overflow-hidden lg:h-[95vh] lg:min-h-[760px]">
        <HeroMedia image={home?.heroImage ?? null} video={home?.heroVideo ?? null} />
        <div className="relative z-[2] mx-[6%] mt-[70px] lg:mt-0">
          <span className="eyebrow">NANJING STREETBALL CREW</span>
          <h1 className="display mt-4 text-[20vw] [text-shadow:5px_6px_rgba(0,0,0,0.45)] sm:text-[15vw] lg:text-[clamp(76px,13vw,205px)]">
            南京破晓
            <em className="block text-[0.72em] text-blaze">DAYBREAK</em>
          </h1>
          <p className="my-7 text-[13px] tracking-[0.35em] sm:text-lg sm:tracking-[0.6em]">
            {home?.slogan || '不止于篮球'}
          </p>
          <div className="font-display text-xs tracking-[0.5em] text-mute">MORE THAN BASKETBALL.</div>
          <Link href="/about" className="cta mt-9">
            了解我们 ↗
          </Link>
        </div>
        <div className="vertical-text absolute bottom-[12%] right-[6%] z-[2] hidden text-xs tracking-[0.3em] text-mute lg:block">
          NANJING / PEOPLE / BASKETBALL / CULTURE
        </div>
        <a
          href="#roster"
          className="absolute bottom-6 left-1/2 z-[2] hidden -translate-x-1/2 font-display text-xs font-bold tracking-[0.25em] text-mute transition-colors hover:text-blaze lg:block"
        >
          SCROLL ↓
        </a>
      </section>

      <section id="roster" className="bg-surface px-[6%] py-16 lg:py-[90px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="eyebrow">01 / ROSTER</span>
            <h2 className="display mt-1 text-[clamp(52px,7vw,108px)]">球员阵容</h2>
            <p className="mt-2 text-xs tracking-[0.12em] text-mute">
              不同的位置，同一个破晓。 DIFFERENT POSITIONS. SAME DAYBREAK.
            </p>
          </div>
          <Link className="text-link" href="/players">
            查看全部球员 ↗
          </Link>
        </div>

        {/* 桌面 5 列，移动端横向滑动（PRD 4.3） */}
        <div className="no-bar -mx-[6%] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[6%] pb-3 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
          {roster.length
            ? roster.map((player, index) => (
                <PlayerCard key={player.id} player={player} variant="rail" priority={index < 2} />
              ))
            : Array.from({ length: 5 }, (_, index) => <PlayerCardPlaceholder key={index} index={index} />)}
        </div>
      </section>

      <section id="culture" className="px-[6%] py-16 lg:py-[90px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="eyebrow">02 / CULTURE</span>
            <h2 className="display mt-1 text-[clamp(52px,7vw,108px)]">球队风采</h2>
            <p className="mt-2 text-xs tracking-[0.12em] text-mute">
              比赛 / 训练 / 街头 / 生活　GAMES / PRACTICE / STREET / LIFE
            </p>
          </div>
          <Link className="text-link" href="/gallery">
            查看全部相册 ↗
          </Link>
        </div>

        {/* 策展式拼贴：首图放大，行高固定以避免加载时布局跳动（PRD 4.4） */}
        <div className="grid auto-rows-[170px] grid-cols-2 gap-2.5 sm:auto-rows-[200px] lg:auto-rows-[240px] lg:grid-cols-[2fr_1fr_1fr]">
          {culture.length
            ? culture.map((album, index) => (
                <AlbumTile key={album.id} album={album} large={index === 0} priority={index === 0} />
              ))
            : GALLERY_PLACEHOLDERS.map((label, index) => (
                <AlbumTilePlaceholder key={label} label={label} large={index === 0} />
              ))}
        </div>
      </section>

      <section className="grain relative grid gap-8 overflow-hidden bg-[linear-gradient(115deg,#2b150e,#101010_65%)] px-[6%] py-20 lg:grid-cols-2 lg:py-[95px]">
        <div className="relative z-[2]">
          <span className="eyebrow">03 / ABOUT</span>
          <h2 className="display mt-1 text-[clamp(58px,8vw,130px)]">
            关于
            <br />
            我们<span className="text-blaze">.</span>
          </h2>
        </div>
        <div className="relative z-[2] self-center">
          <p className="leading-8 text-[#ccc]">
            {home?.aboutText || '从南京的街头出发，用篮球记录属于我们的故事。'}
          </p>
          <Link className="text-link mt-7" href="/about">
            了解我们的故事 ↗
          </Link>
        </div>
      </section>
    </>
  )
}
