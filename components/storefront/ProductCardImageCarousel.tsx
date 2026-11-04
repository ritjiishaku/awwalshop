'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ProductCardImage {
  url: string
  altText: string | null
}

interface ProductCardImageCarouselProps {
  images: ProductCardImage[]
  productName: string
  productHref: string
  unavailable: boolean
  priority: boolean
}

export default function ProductCardImageCarousel({
  images,
  productName,
  productHref,
  unavailable,
  priority,
}: ProductCardImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set())
  const touchStartX = useRef<number | null>(null)
  const wasSwiped = useRef(false)
  const activeImage = images[activeIndex]
  const activeImageFailed = activeImage
    ? failedImages.has(activeImage.url)
    : false

  return (
      <Link
        href={productHref}
        className="relative block aspect-product w-full touch-pan-y overflow-hidden bg-[#f6f1ea]"
        aria-label={`View ${productName}`}
        onTouchStart={(event) => {
          if (images.length > 1) {
            touchStartX.current = event.touches[0]?.clientX ?? null
          }
        }}
        onTouchEnd={(event) => {
          const startX = touchStartX.current
          const endX = event.changedTouches[0]?.clientX
          touchStartX.current = null
          if (startX === null || endX === undefined) return

          const distance = endX - startX
          if (Math.abs(distance) < 40) return

          wasSwiped.current = true
          setActiveIndex((index) =>
            distance < 0
              ? (index + 1) % images.length
              : (index - 1 + images.length) % images.length
          )
          window.setTimeout(() => {
            wasSwiped.current = false
          }, 500)
        }}
        onClickCapture={(event) => {
          if (!wasSwiped.current) return
          event.preventDefault()
          event.stopPropagation()
          wasSwiped.current = false
        }}
      >
        {activeImage && !activeImageFailed ? (
          <Image
            key={activeImage.url}
            src={activeImage.url}
            alt={activeImage.altText || productName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            unoptimized
            className={`object-cover object-center transition-transform duration-500 group-hover/image:scale-[1.03] motion-reduce:transition-none ${
              unavailable ? 'opacity-60 grayscale-[20%]' : ''
            }`}
            onError={() =>
              setFailedImages((current) => new Set(current).add(activeImage.url))
            }
          />
        ) : (
          <div
            role={activeImageFailed ? 'img' : undefined}
            aria-label={activeImageFailed ? `${productName} image unavailable` : undefined}
            className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(197,164,109,0.13),transparent_58%),linear-gradient(135deg,#f3eee6,#e9e0d2)]"
          >
            <span className="font-heading text-lg tracking-[0.28em] text-taupe/45 sm:text-xl">
              AWWALSHOP
            </span>
          </div>
        )}
      </Link>
  )
}
