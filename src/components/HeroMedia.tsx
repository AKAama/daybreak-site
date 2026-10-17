'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { mediaUrl } from '@/lib/media'
import type { Media } from '@/lib/types'

/**
 * PRD 4.2：Hero 支持视频背景。开启「减少动态效果」、视频加载失败或后台未上传
 * 视频时，一律回退到静态 Hero 图。
 */
export function HeroMedia({ image, video }: { image: Media | null; video: Media | null }) {
  const poster = mediaUrl(image, 'hero')
  const videoSrc = mediaUrl(video)
  const [allowVideo, setAllowVideo] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!videoSrc) return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setAllowVideo(!query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [videoSrc])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {poster ? (
        <Image
          src={poster}
          alt=""
          fill
          priority
          sizes="100vw"
          className="duotone object-cover object-[center_40%] opacity-65"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_44%,#564238_0%,#211c1b_31%,#080808_75%)]" />
      )}
      {videoSrc && allowVideo && !failed && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          onError={() => setFailed(true)}
          aria-hidden="true"
        >
          <source src={videoSrc} type={video?.mimeType ?? undefined} />
        </video>
      )}
      <div className="hero-scrim pointer-events-none absolute inset-0" />
    </div>
  )
}
