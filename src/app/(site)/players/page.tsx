import { PageShell } from '@/components/PageShell'
import { PlayerCard } from '@/components/PlayerCard'
import { getSiteData } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const { settings } = await getSiteData()
  return buildMetadata({
    title: '球员阵容',
    description: '南京破晓 DAYBREAK 已发布球员名单：球衣号码、位置与写真。',
    pathname: '/players',
    siteName: settings?.siteTitle,
    image: settings?.seoDefaultImage,
  })
}

export default async function PlayersPage() {
  const { players } = await getSiteData()

  return (
    <PageShell
      eyebrow="01 / THE ROSTER"
      title="球员阵容"
      description={players.length ? `${players.length} 名球员 · 不同位置，同一个破晓` : undefined}
    >
      {players.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {players.map((player, index) => (
            <PlayerCard key={player.id} player={player} priority={index < 4} />
          ))}
        </div>
      ) : (
        <p className="border border-dashed border-line bg-surface px-6 py-16 text-center text-mute">
          球员档案正在整理中，敬请期待。
        </p>
      )}
    </PageShell>
  )
}
