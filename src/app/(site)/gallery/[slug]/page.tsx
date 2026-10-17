import Image from 'next/image'
import { notFound } from 'next/navigation'
import { BackLink } from '@/components/PageShell'
import { PhotoSwipeGallery } from '@/components/PhotoSwipeGallery'
import { getAlbum } from '@/lib/data'
import { mediaUrl } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const album = await getAlbum((await params).slug)
  if (!album) return {}
  return buildMetadata({
    title: album.title,
    description:
      album.description?.slice(0, 120) ||
      `南京破晓 DAYBREAK 影像相册「${album.title}」，共 ${album.photos.length} 张照片。`,
    pathname: `/gallery/${album.slug}`,
    image: album.cover,
    type: 'article',
  })
}

export default async function AlbumPage({ params }: Props) {
  const album = await getAlbum((await params).slug)
  if (!album) notFound()

  return (
    <div className="min-h-[80vh] px-[6%] pb-20 pt-[120px] lg:pt-[150px]">
      <BackLink href="/gallery">← BACK TO CULTURE</BackLink>
      <span className="eyebrow">
        {album.eventDate ? album.eventDate.slice(0, 10).replace(/-/g, '.') : 'DAYBREAK ALBUM'}
      </span>
      <h1 className="display mt-2 mb-4 text-[clamp(44px,7vw,108px)]">{album.title}</h1>
      {album.description && <p className="mb-10 max-w-[720px] leading-8 text-mute">{album.description}</p>}

      {album.photos.length ? (
        <PhotoSwipeGallery className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {album.photos.map((photo, index) => {
            const full = mediaUrl(photo.image)
            const thumb = mediaUrl(photo.image, 'card')
            const alt = photo.caption || photo.image.alt || `${album.title} 照片 ${index + 1}`
            return (
              <a
                key={photo.id ?? `${full}-${index}`}
                href={full}
                data-pswp-width={photo.image.width ?? 1600}
                data-pswp-height={photo.image.height ?? 1200}
                className="tile group relative block aspect-[4/3] overflow-hidden border border-line bg-card"
                aria-label={`放大查看：${alt}`}
              >
                <Image
                  src={thumb || full}
                  alt={alt}
                  fill
                  loading={index < 3 ? undefined : 'lazy'}
                  sizes="(max-width: 520px) 90vw, (max-width: 900px) 45vw, 30vw"
                  className="duotone-soft object-cover"
                />
                <div className="photo-scrim absolute inset-0 z-[1]" />
                {photo.caption && (
                  <span className="absolute bottom-4 left-4 right-4 z-[2] text-sm font-bold text-paper">
                    {photo.caption}
                  </span>
                )}
              </a>
            )
          })}
        </PhotoSwipeGallery>
      ) : (
        <p className="border border-dashed border-line bg-surface px-6 py-16 text-center text-mute">
          本相册暂无可展示的照片。
        </p>
      )}
    </div>
  )
}
