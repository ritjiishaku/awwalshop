'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import {
  detectMediaSource,
  getVimeoEmbedUrl,
  getVimeoVideoId,
  getYouTubeEmbedUrl,
  getYouTubeVideoId,
} from '@/lib/utils'

export interface GalleryMedia {
  id: string
  mediaType: 'IMAGE' | 'VIDEO'
  sourceType: 'UPLOAD' | 'EXTERNAL_URL' | 'YOUTUBE' | 'VIMEO'
  url: string
  thumbnailUrl: string | null
  altText: string | null
}

interface ProductGalleryProps {
  media: GalleryMedia[]
  productName: string
}

type MediaKind = 'image' | 'embed' | 'file' | 'link'

function mediaKind(item: GalleryMedia): MediaKind {
  if (item.sourceType === 'YOUTUBE' || item.sourceType === 'VIMEO') {
    return getYouTubeVideoId(item.url) || getVimeoVideoId(item.url) ? 'embed' : 'link'
  }
  if (item.mediaType === 'VIDEO') return 'file'

  const detected = detectMediaSource(item.url)
  if (detected === 'YOUTUBE' || detected === 'VIMEO') {
    return getYouTubeVideoId(item.url) || getVimeoVideoId(item.url) ? 'embed' : 'link'
  }
  if (detected === 'VIDEO') return 'file'
  if (detected === 'IMAGE') return 'image'
  return 'link'
}

function embedUrlFor(item: GalleryMedia): string | null {
  const youtubeId = getYouTubeVideoId(item.url)
  if (youtubeId) return getYouTubeEmbedUrl(youtubeId)
  const vimeoId = getVimeoVideoId(item.url)
  if (vimeoId) return getVimeoEmbedUrl(vimeoId)
  return null
}

function thumbnailFor(item: GalleryMedia): string | null {
  if (item.thumbnailUrl) return item.thumbnailUrl
  if (mediaKind(item) === 'image') return item.url
  const youtubeId = getYouTubeVideoId(item.url)
  return youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null
}

export default function ProductGallery({ media, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = media[activeIndex]
  const kind = active ? mediaKind(active) : null

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-product w-full overflow-hidden bg-sand">
        {!active && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-3xl tracking-[0.3em] text-taupe/50">
              AWWALSHOP
            </span>
          </div>
        )}

        {active && kind === 'image' && (
          <Image
            key={active.id}
            src={active.url}
            alt={active.altText || productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover animate-fade-in"
          />
        )}

        {active && kind === 'embed' && (
          <iframe
            key={active.id}
            src={embedUrlFor(active) ?? ''}
            title={active.altText || `${productName} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        )}

        {active && kind === 'file' && (
          <video
            key={active.id}
            src={active.url}
            poster={active.thumbnailUrl ?? undefined}
            controls
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {active && kind === 'link' && (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
            <p className="text-sm text-taupe">
              This media could not be displayed.{' '}
              <a
                href={active.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline underline-offset-4"
              >
                Open link
              </a>
            </p>
          </div>
        )}
      </div>

      {media.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {media.map((item, index) => {
            const thumb = thumbnailFor(item)
            const isActive = index === activeIndex
            const isVideo = mediaKind(item) !== 'image'
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View media ${index + 1} of ${media.length}`}
                aria-pressed={isActive}
                className={`relative aspect-square overflow-hidden bg-sand border transition-all ${
                  isActive
                    ? 'border-gold ring-1 ring-gold'
                    : 'border-sand hover:border-taupe'
                }`}
              >
                {thumb ? (
                  <Image
                    src={thumb}
                    alt={item.altText || `${productName} thumbnail ${index + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-taupe">
                    <Play size={16} />
                  </span>
                )}
                {isVideo && (
                  <span className="absolute inset-0 flex items-center justify-center bg-espresso/25 text-white">
                    <Play size={16} fill="currentColor" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
