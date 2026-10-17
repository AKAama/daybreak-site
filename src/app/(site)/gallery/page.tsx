import { AlbumTile, AlbumTilePlaceholder } from '@/components/AlbumTile'
import { PageShell } from '@/components/PageShell'
import { getSiteData } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const { settings } = await getSiteData()
  return buildMetadata({
    title: '球队风采',
    description: '南京破晓 DAYBREAK 影像相册：比赛、训练、街头与生活。',
    pathname: '/gallery',
    siteName: settings?.siteTitle,
    image: settings?.seoDefaultImage,
  })
}

export default async function GalleryPage() {
  const { albums } = await getSiteData()

  return (
    <PageShell
      eyebrow="02 / THE CULTURE"
      title="球队风采"
      description={albums.length ? `${albums.length} 本已发布相册 · 点击进入可全屏浏览` : undefined}
    >
      {albums.length ? (
        <div className="grid auto-rows-[170px] grid-cols-2 gap-2.5 sm:auto-rows-[200px] lg:auto-rows-[240px] lg:grid-cols-[2fr_1fr_1fr]">
          {albums.map((album, index) => (
            <AlbumTile key={album.id} album={album} large={index === 0} priority={index < 2} />
          ))}
        </div>
      ) : (
        <div className="grid auto-rows-[170px] grid-cols-2 gap-2.5 sm:auto-rows-[200px] lg:auto-rows-[240px] lg:grid-cols-[2fr_1fr_1fr]">
          {['THE GAME', 'OUR CITY', 'STREET LIFE', 'PRACTICE', 'BEHIND THE SCENES'].map((label, index) => (
            <AlbumTilePlaceholder key={label} label={label} large={index === 0} />
          ))}
        </div>
      )}
    </PageShell>
  )
}
