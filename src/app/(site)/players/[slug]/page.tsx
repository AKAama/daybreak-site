import Image from 'next/image'
import { notFound } from 'next/navigation'
import { AlbumTile } from '@/components/AlbumTile'
import { BackLink } from '@/components/PageShell'
import { getPlayer } from '@/lib/data'
import { mediaUrl } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { player } = (await getPlayer((await params).slug)) ?? {}
  if (!player) return {}
  const meta = [player.englishName, player.position].filter(Boolean).join(' / ')
  return buildMetadata({
    title: `${player.name} #${player.number}`,
    description:
      player.bio?.slice(0, 120) || `${player.name}${meta ? `（${meta}）` : ''}— 南京破晓 DAYBREAK 球员档案。`,
    pathname: `/players/${player.slug}`,
    image: player.portrait,
    type: 'article',
  })
}

export default async function PlayerPage({ params }: Props) {
  const result = await getPlayer((await params).slug)
  if (!result) notFound()
  const { player, albums } = result
  const portrait = mediaUrl(player.portrait, 'card')
  const meta = [player.englishName, player.position].filter(Boolean).join(' / ')

  return (
    <div className="min-h-[80vh] px-[6%] pb-20 pt-[120px] lg:pt-[150px]">
      <BackLink href="/players">← BACK TO ROSTER</BackLink>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-[50px]">
        <div className="tile relative aspect-[3/4] overflow-hidden border border-line bg-card">
          {portrait ? (
            <Image
              src={portrait}
              alt={player.portrait?.alt || `${player.name} 写真`}
              fill
              priority
              sizes="(max-width: 900px) 88vw, 45vw"
              className="duotone object-cover"
            />
          ) : (
            <div className="display grid h-full place-items-center text-[90px] text-[#4b4b4b]">
              #{player.number}
            </div>
          )}
        </div>

        <div>
          <span className="eyebrow">PLAYER / #{player.number}</span>
          <h1 className="display mt-2 text-[clamp(60px,8vw,130px)]">{player.name}</h1>
          {meta && (
            <p className="mt-3 font-display text-2xl font-bold italic tracking-wide text-blaze">{meta}</p>
          )}
          <p className="mt-7 leading-8 text-mute">{player.bio || 'DAYBREAK CREW — 不止于篮球。'}</p>
        </div>
      </div>

      {albums.length > 0 && (
        <section className="mt-20">
          <h2 className="display text-[clamp(34px,5vw,64px)]">相关相册</h2>
          <p className="mt-2 text-xs tracking-[0.12em] text-mute">{player.name} 出现在以下已发布相册中</p>
          <div className="mt-6 grid auto-rows-[170px] grid-cols-2 gap-2.5 sm:auto-rows-[200px] lg:grid-cols-3">
            {albums.map((album) => (
              <AlbumTile key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
