import Image from 'next/image'
import Link from 'next/link'
import { mediaUrl } from '@/lib/media'
import type { PlayerView } from '@/lib/types'

const PLACEHOLDER_NUMBERS = ['01', '07', '11', '23', '77']

/** 号码、姓名、位置常驻显示，触屏设备不依赖 hover（PRD 4.3） */
const CARD =
  'tile group relative block aspect-[3/4] snap-start overflow-hidden border border-line bg-card xl:aspect-[2/3]'

/** rail 用于首页移动端横滑，需要固定最小宽度；grid 下由列宽决定 */
export function PlayerCard({
  player,
  priority,
  variant = 'grid',
}: {
  player: PlayerView
  priority?: boolean
  variant?: 'grid' | 'rail'
}) {
  const src = mediaUrl(player.portrait, 'card')
  return (
    <Link
      href={`/players/${player.slug}`}
      className={`${CARD} ${variant === 'rail' ? 'min-w-[220px] shrink-0' : ''}`}
    >
      {src ? (
        <Image
          src={src}
          alt={player.portrait?.alt || `${player.name} 写真`}
          fill
          priority={priority}
          sizes="(max-width: 700px) 220px, (max-width: 1200px) 33vw, 18vw"
          className="duotone object-cover"
        />
      ) : (
        <div className="display absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#333,#161616)] text-[80px] text-[#4b4b4b]">
          {String(player.number).padStart(2, '0')}
        </div>
      )}
      <div className="photo-scrim absolute inset-0 z-[2]" />
      <div className="absolute bottom-4 left-[18px] right-4 z-[3]">
        <div className="display text-[42px] leading-none text-paper">#{player.number}</div>
        <h3 className="mt-1 text-[22px] font-black leading-tight">{player.name}</h3>
        <p className="mt-1 text-xs font-bold text-blaze">
          {[player.englishName, player.position?.join('/')].filter(Boolean).join(' · ') ||
            'DAYBREAK CREW'}
        </p>
      </div>
    </Link>
  )
}

/** 后台还没有内容时的品牌化占位，不暴露任何草稿（PRD 5.1） */
export function PlayerCardPlaceholder({ index }: { index: number }) {
  const number = PLACEHOLDER_NUMBERS[index % PLACEHOLDER_NUMBERS.length]
  return (
    <div className={`${CARD} min-w-[220px] shrink-0`}>
      <div className="stripes absolute inset-0" />
      <div className="absolute bottom-4 left-[18px] right-4 z-[3]">
        <div className="display text-[42px] leading-none text-[#4b4b4b]">#{number}</div>
        <h3 className="mt-1 text-[22px] font-black leading-tight text-mute">COMING SOON</h3>
        <p className="mt-1 text-xs font-bold text-concrete">DAYBREAK CREW</p>
      </div>
    </div>
  )
}
