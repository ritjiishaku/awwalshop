'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Check,
  Copy,
  ExternalLink,
  Film,
  Image as ImageIcon,
  Search,
} from 'lucide-react'

export interface MediaAsset {
  id: string
  url: string
  thumbnailUrl: string | null
  altText: string | null
  caption: string | null
  mediaType: 'IMAGE' | 'VIDEO'
  sourceType: string
  createdAt: string
  product: { id: string; name: string; slug: string } | null
}

interface MediaLibraryProps {
  assets: MediaAsset[]
}

type TypeFilter = 'ALL' | 'IMAGE' | 'VIDEO'

export default function MediaLibrary({ assets }: MediaLibraryProps) {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()

    return assets.filter((asset) => {
      if (typeFilter !== 'ALL' && asset.mediaType !== typeFilter) return false
      if (!term) return true

      return [
        asset.altText,
        asset.caption,
        asset.product?.name,
        asset.product?.slug,
        asset.url,
      ]
        .filter(Boolean)
        .some((value) => (value as string).toLowerCase().includes(term))
    })
  }, [assets, query, typeFilter])

  const imageCount = assets.filter((asset) => asset.mediaType === 'IMAGE').length
  const videoCount = assets.filter((asset) => asset.mediaType === 'VIDEO').length
  const productCount = new Set(
    assets.map((asset) => asset.product?.id).filter(Boolean)
  ).size

  const copyUrl = async (asset: MediaAsset) => {
    try {
      await navigator.clipboard.writeText(asset.url)
      setCopiedId(asset.id)
      toast.success('Media URL copied.')
      window.setTimeout(() => setCopiedId(null), 1800)
    } catch {
      toast.error('Unable to copy the URL. Select it manually instead.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Assets', value: assets.length },
          { label: 'Images', value: imageCount },
          { label: 'Videos', value: videoCount },
          { label: 'Products', value: productCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-line bg-white px-4 py-3 shadow-soft"
          >
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-taupe">
              {stat.label}
            </p>
            <p className="mt-1 font-heading text-2xl text-espresso">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe"
          />
          <input
            className="input h-10 pl-9"
            placeholder="Search by product, alt text, caption or URL…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 rounded-full border border-line bg-white p-1">
          {(['ALL', 'IMAGE', 'VIDEO'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all ${
                typeFilter === type
                  ? 'bg-espresso text-ivory shadow-soft'
                  : 'text-[#6f665f] hover:text-espresso'
              }`}
            >
              {type === 'ALL' ? 'All' : type === 'IMAGE' ? 'Images' : 'Videos'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="surface border-dashed px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#efe6d8] bg-[#faf6ee] text-[#a7823d]">
            <ImageIcon size={24} />
          </div>
          <p className="mt-4 font-heading text-2xl text-espresso">
            {assets.length === 0 ? 'No media yet' : 'No matching assets'}
          </p>
          <p className="mt-1 text-sm text-[#8b8178]">
            {assets.length === 0
              ? 'Upload images and videos from a product editor to build your library.'
              : 'Try a different search term or media type.'}
          </p>
          {assets.length === 0 && (
            <Link href="/admin/products/new" className="btn btn-primary btn-sm mt-5">
              Add a product
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((asset) => {
            const preview = asset.mediaType === 'VIDEO'
              ? asset.thumbnailUrl
              : asset.url

            return (
              <article
                key={asset.id}
                className="group overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="relative aspect-square bg-[#f8f5ef]">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt={asset.altText || asset.product?.name || 'Catalogue media'}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#c5a46d]">
                      {asset.mediaType === 'VIDEO' ? (
                        <Film size={26} />
                      ) : (
                        <ImageIcon size={26} />
                      )}
                    </div>
                  )}

                  {asset.mediaType === 'VIDEO' && (
                    <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-espresso/85 px-2 py-0.5 text-[9px] uppercase tracking-wider text-ivory backdrop-blur">
                      <Film size={10} /> Video
                    </span>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-espresso/60 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={() => void copyUrl(asset)}
                      className="rounded-full bg-white p-2.5 text-espresso transition-colors hover:bg-gold hover:text-white"
                      aria-label="Copy media URL"
                    >
                      {copiedId === asset.id ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-white p-2.5 text-espresso transition-colors hover:bg-gold hover:text-white"
                      aria-label="Open media in a new tab"
                    >
                      <ExternalLink size={15} />
                    </a>
                  </div>
                </div>

                <div className="p-3">
                  <p className="truncate text-xs font-semibold text-espresso">
                    {asset.altText || asset.caption || 'Untitled asset'}
                  </p>
                  {asset.product ? (
                    <Link
                      href={`/admin/products/${asset.product.id}`}
                      className="mt-0.5 block truncate text-[10px] text-taupe transition-colors hover:text-[#c5a46d]"
                    >
                      {asset.product.name}
                    </Link>
                  ) : (
                    <p className="mt-0.5 text-[10px] text-taupe">Unattached</p>
                  )}
                  <p className="mt-1.5 text-[9px] uppercase tracking-wider text-taupe/80">
                    {asset.sourceType.replace('_', ' ')}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
