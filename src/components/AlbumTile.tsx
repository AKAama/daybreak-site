import Image from 'next/image'
import Link from 'next/link'
import { mediaUrl } from '@/lib/media'
import type { AlbumView } from '@/lib/types'

const dateLabel = (eventDate?: string | null) => eventDate?.slice(0, 10).replace(/-/g, '.') ?? ''

const TILE = 'tile group relative flex items-end overflow-hidden border border-line bg-card p-5'

export function AlbumTile({
  album,
  large,
  priority,
}: {
  album: AlbumView
  large?: boolean
  priority?: boolean
}) {
  const src = mediaUrl(album.cover, 'card')
  const date = dateLabel(album.eventDate)

  return (
    <Link
      href={`/gallery/${album.slug}`}
      className={`${TILE} ${large ? 'col-span-2 lg:col-span-1 lg:row-span-2' : ''}`}
    >
      {src ? (
        <Image
          src={src}
          alt={album.cover?.alt || `${album.title} 封面`}
          fill
          priority={priority}
          sizes="(max-width: 700px) 50vw, (max-width: 900px) 33vw, 30vw"
          className="duotone-soft object-cover"
        />
      ) : (
        <div className="stripes absolute inset-0" />
      )}
      <div className="photo-scrim absolute inset-0 z-[1]" />
      <div className="relative z-[2]">
        {date && <div className="font-display text-sm font-bold tracking-[0.18em] text-blaze">{date}</div>}
        <span className="mt-1 block text-[21px] font-extrabold leading-tight">
          {album.title} <span className="text-blaze">↗</span>
        </span>
      </div>
    </Link>
  )
}

export function AlbumTilePlaceholder({ label, large }: { label: string; large?: boolean }) {
  return (
    <div className={`${TILE} ${large ? 'col-span-2 lg:col-span-1 lg:row-span-2' : ''}`}>
      <div className="stripes absolute inset-0" />
      <span className="relative z-[2] text-[19px] font-extrabold leading-tight text-concrete">{label}</span>
    </div>
  )
}
