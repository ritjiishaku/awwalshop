'use client'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Eye, LoaderCircle, Minus, Plus, X } from 'lucide-react'
import { buildWhatsAppOrderUrl, formatPrice } from '@/lib/utils'
import TrackedWhatsAppLink from '@/components/storefront/TrackedWhatsAppLink'
import { trackStorefrontEvent } from '@/components/storefront/storefront-analytics'

interface QuickViewProduct {
  id: string
  slug: string
  name: string
  shortDescription: string | null
  fullDescription: string | null
  regularPrice: string
  discountPrice: string | null
  currency: string
  showPrice: boolean
  availability: string
  material: string | null
  colour: string | null
  size: string | null
  category: { name: string } | null
  media: { url: string; altText: string | null }[]
  variants: {
    id: string
    name: string
    value: string
    priceModifier: string
    availability: string
  }[]
}

interface ProductQuickViewProps {
  slug: string
  productName: string
  whatsappNumber: string
  whatsappMessage?: string
  currencySymbol: string
  className?: string
}

const unavailableValues = ['OUT_OF_STOCK', 'DISCONTINUED']

export default function ProductQuickView({
  slug,
  productName,
  whatsappNumber,
  whatsappMessage,
  currencySymbol,
  className,
}: ProductQuickViewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [product, setProduct] = useState<QuickViewProduct | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [selection, setSelection] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const portalTarget = isMounted ? document.body : null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen, portalTarget])

  useEffect(() => {
    if (!isOpen) return
    const controller = new AbortController()

    fetch(`/api/storefront/products/${encodeURIComponent(slug)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          const result = (await response.json().catch(() => null)) as
            | { error?: string }
            | null
          throw new Error(result?.error || 'Unable to load this product.')
        }
        return (await response.json()) as { product: QuickViewProduct }
      })
      .then(({ product: loadedProduct }) => {
        setProduct(loadedProduct)
        const groups = new Map<string, QuickViewProduct['variants']>()
        loadedProduct.variants.forEach((variant) => {
          const options = groups.get(variant.name) ?? []
          options.push(variant)
          groups.set(variant.name, options)
        })
        setSelection(
          Object.fromEntries(
            Array.from(groups, ([name, options]) => [
              name,
              (
                options.find((option) => option.availability === 'AVAILABLE') ??
                options[0]
              ).id,
            ])
          )
        )
        setQuantity(1)

        const price =
          Number(loadedProduct.discountPrice ?? loadedProduct.regularPrice) || 0
        trackStorefrontEvent('view_item', {
          currency: loadedProduct.currency,
          value: price,
          items: [
            {
              item_id: loadedProduct.id,
              item_name: loadedProduct.name,
              item_category: loadedProduct.category?.name,
              price,
              currency: loadedProduct.currency,
            },
          ],
        })
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === 'AbortError') return
        setError(
          cause instanceof Error ? cause.message : 'Unable to load this product.'
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [isOpen, loadAttempt, slug])

  const variantGroups = useMemo(() => {
    const groups = new Map<string, QuickViewProduct['variants']>()
    product?.variants.forEach((variant) => {
      const options = groups.get(variant.name) ?? []
      options.push(variant)
      groups.set(variant.name, options)
    })
    return Array.from(groups.entries())
  }, [product])

  const selectedVariants = variantGroups
    .map(([name, options]) => ({
      name,
      option: options.find((option) => option.id === selection[name]),
    }))
    .filter(
      (entry): entry is { name: string; option: QuickViewProduct['variants'][number] } =>
        entry.option !== undefined
    )
  const modifierTotal = selectedVariants.reduce(
    (total, entry) => total + Number(entry.option.priceModifier),
    0
  )
  const basePrice = product
    ? Number(product.discountPrice ?? product.regularPrice)
    : 0
  const unitPrice = basePrice + modifierTotal
  const soldOut =
    !product ||
    unavailableValues.includes(product.availability) ||
    selectedVariants.some((entry) =>
      unavailableValues.includes(entry.option.availability)
    )
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'http://localhost:3000'
  const productUrl = `${siteUrl}/products/${slug}`
  const orderUrl = product
    ? buildWhatsAppOrderUrl({
        productName: product.name,
        price: product.showPrice
          ? formatPrice(unitPrice * quantity, { symbol: currencySymbol })
          : 'Price on request',
        variants: Object.fromEntries(
          selectedVariants.map((entry) => [entry.name, entry.option.value])
        ),
        quantity,
        productUrl,
        whatsappNumber,
        messageTemplate: whatsappMessage,
      })
    : ''

  function close() {
    setIsOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          triggerRef.current = event.currentTarget
          setLoading(true)
          setError('')
          setProduct(null)
          setIsOpen(true)
        }}
        aria-label={`Quick view ${productName}`}
        className={
          className ??
          'inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-white px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-espresso transition-colors hover:border-gold hover:bg-ivory active:scale-[0.98] focus-visible:outline-offset-2 motion-reduce:transition-none'
        }
      >
        <Eye size={14} />
        Quick view
      </button>

      {portalTarget &&
        createPortal(
          <dialog
            ref={dialogRef}
            aria-label={product ? `Quick view: ${product.name}` : 'Quick view'}
            className="fixed inset-0 m-0 h-dvh w-screen max-h-none max-w-none overflow-y-auto border-0 bg-transparent p-3 backdrop:bg-espresso/70 sm:p-6"
            onCancel={(event) => {
              event.preventDefault()
              close()
            }}
            onClose={() => {
              setIsOpen(false)
              triggerRef.current?.focus()
            }}
            onClick={(event) => {
              if (event.target === event.currentTarget) close()
            }}
          >
            <div className="relative mx-auto my-2 grid min-h-[24rem] w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-elevated sm:my-6 sm:grid-cols-2">
              <button
                type="button"
                onClick={close}
                aria-label="Close quick view"
                className="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white text-espresso shadow-md transition-colors hover:bg-ivory"
              >
                <X size={18} />
              </button>

              {loading ? (
                <div
                  className="col-span-full flex min-h-96 items-center justify-center text-taupe"
                  role="status"
                >
                  <LoaderCircle size={24} className="animate-spin" />
                  <span className="sr-only">Loading product details</span>
                </div>
              ) : error ? (
                <div className="col-span-full flex min-h-96 flex-col items-center justify-center gap-4 px-6 text-center">
                  <p className="text-sm text-taupe" role="alert">{error}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setLoading(true)
                      setError('')
                      setLoadAttempt((attempt) => attempt + 1)
                    }}
                    className="btn btn-secondary"
                  >
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="text-xs text-taupe underline underline-offset-4"
                  >
                    Close
                  </button>
                </div>
              ) : product ? (
                <>
                  <div className="relative aspect-[4/5] bg-[#f6f1ea] sm:aspect-auto sm:min-h-[34rem]">
                    {product.media[0] ? (
                      <Image
                        src={product.media[0].url}
                        alt={product.media[0].altText || product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-72 items-center justify-center font-heading text-xl tracking-[0.3em] text-taupe/50">
                        AWWALSHOP
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col p-5 sm:p-8">
                    {product.category && (
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                        {product.category.name}
                      </span>
                    )}
                    <h2 className="mt-2 pr-9 font-heading text-3xl leading-tight text-espresso">
                      {product.name}
                    </h2>
                    {product.showPrice ? (
                      <p className="mt-3 text-lg font-semibold text-espresso">
                        {formatPrice(unitPrice, { symbol: currencySymbol })}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm italic text-taupe">Price on request</p>
                    )}
                    <p className="mt-4 line-clamp-5 whitespace-pre-line text-sm leading-relaxed text-taupe">
                      {product.shortDescription ||
                        product.fullDescription ||
                        'Contact our concierge for more details about this piece.'}
                    </p>
                    {(product.material || product.colour || product.size) && (
                      <dl className="mt-4 grid grid-cols-2 gap-2 border-y border-line py-3 text-xs">
                        {product.material && (
                          <>
                            <dt className="text-taupe">Material</dt>
                            <dd className="text-right text-espresso">{product.material}</dd>
                          </>
                        )}
                        {product.colour && (
                          <>
                            <dt className="text-taupe">Colour</dt>
                            <dd className="text-right text-espresso">{product.colour}</dd>
                          </>
                        )}
                        {product.size && (
                          <>
                            <dt className="text-taupe">Size</dt>
                            <dd className="text-right text-espresso">{product.size}</dd>
                          </>
                        )}
                      </dl>
                    )}

                    {variantGroups.length > 0 && (
                      <div className="mt-4 flex flex-col gap-3">
                        {variantGroups.map(([name, options]) => (
                          <fieldset key={name}>
                            <legend className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-taupe">
                              {name}
                            </legend>
                            <div className="flex flex-wrap gap-2">
                              {options.map((option) => {
                                const disabled = unavailableValues.includes(
                                  option.availability
                                )
                                return (
                                  <button
                                    key={option.id}
                                    type="button"
                                    disabled={disabled}
                                    aria-pressed={selection[name] === option.id}
                                    onClick={() =>
                                      setSelection((current) => ({
                                        ...current,
                                        [name]: option.id,
                                      }))
                                    }
                                    className={`inline-flex min-h-11 items-center justify-center rounded-full border px-3 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                                      selection[name] === option.id
                                        ? 'border-espresso bg-espresso text-white'
                                        : 'border-line text-espresso hover:border-gold'
                                    }`}
                                  >
                                    {option.value}
                                    {Number(option.priceModifier) > 0 && (
                                      <span className="ml-1 text-[10px]">
                                        +{formatPrice(option.priceModifier, { symbol: currencySymbol })}
                                      </span>
                                    )}
                                  </button>
                                )
                              })}
                            </div>
                          </fieldset>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-taupe">
                        Quantity
                      </span>
                      <div className="inline-flex items-center border border-line">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                          className="inline-flex size-11 items-center justify-center hover:bg-ivory"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm" aria-live="polite">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                          className="inline-flex size-11 items-center justify-center hover:bg-ivory"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-2">
                      {soldOut ? (
                        <span className="btn btn-secondary w-full cursor-not-allowed opacity-60">
                          Sold Out
                        </span>
                      ) : (
                        <TrackedWhatsAppLink
                          href={orderUrl}
                          productId={product.id}
                          productName={product.name}
                          category={product.category?.name}
                          price={product.showPrice ? unitPrice * quantity : undefined}
                          currency={product.currency}
                          quantity={quantity}
                          variants={Object.fromEntries(
                            selectedVariants.map((entry) => [
                              entry.name,
                              entry.option.value,
                            ])
                          )}
                          className="btn btn-primary w-full gap-2"
                        >
                          Order on WhatsApp
                        </TrackedWhatsAppLink>
                      )}
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={close}
                        className="inline-flex min-h-11 items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-espresso transition-colors hover:text-gold"
                      >
                        View full details <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </dialog>,
          portalTarget
        )}
    </>
  )
}
