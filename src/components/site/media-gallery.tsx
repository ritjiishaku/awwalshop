"use client"

import Image from "next/image"
import { useState } from "react"
import { MediaItem } from "@/types"

interface Props {
  media: MediaItem[]
  productName: string
}

export function MediaGallery({ media, productName }: Props) {
  const [active, setActive] = useState(0)
  const images = media.filter((m) => m.type === "image")

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-[var(--color-sand)]">
        <span className="font-display text-6xl text-[var(--color-muted)]">A</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[var(--color-sand)] product-image-wrap">
        <Image
          key={images[active].id}
          src={images[active].src}
          alt={images[active].alt ?? productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover animate-fade-in"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                i === active
                  ? "border-[var(--color-brass)] scale-105"
                  : "border-[var(--color-sand)] hover:border-[var(--color-brass)]/50 opacity-70 hover:opacity-100"
              }`}
              aria-label={`View photo ${i + 1}`}
            >
              <Image
                src={img.src}
                alt={img.alt ?? `${productName} photo ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
