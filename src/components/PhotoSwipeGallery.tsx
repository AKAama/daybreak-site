'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

/**
 * FR-05 灯箱。用 <a data-pswp-width data-pswp-height> 作为触发元素：
 * 有 JS 时由 PhotoSwipe 接管（键盘方向键/Esc、触控滑动、捏合与双击缩放），
 * 无 JS 时退化为直接打开原图链接。
 */
export function PhotoSwipeGallery({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const gallery = ref.current
    if (!gallery) return

    const lightbox = new PhotoSwipeLightbox({
      gallery,
      children: 'a[data-pswp-width]',
      showHideAnimationType: 'zoom',
      bgOpacity: 0.94,
      pswpModule: () => import('photoswipe'),
    })
    lightbox.init()
    return () => lightbox.destroy()
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
