'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, MessageCircle, Minus, Plus, Share2 } from 'lucide-react'
import { buildWhatsAppOrderUrl, formatPrice } from '@/lib/utils'
import TrackedWhatsAppLink from '@/components/storefront/TrackedWhatsAppLink'

export interface OrderVariant {
  id: string
  name: string
  value: string
  priceModifier: number
  availability: 'AVAILABLE' | 'OUT_OF_STOCK' | 'MADE_TO_ORDER' | 'COMING_SOON' | 'DISCONTINUED'
}

interface ProductOrderPanelProps {
  productId: string
  productName: string
  category?: string
  productUrl: string
  currencyCode: string
  regularPrice: number
  discountPrice: number | null
  showPrice: boolean
  availability: 'AVAILABLE' | 'OUT_OF_STOCK' | 'MADE_TO_ORDER' | 'COMING_SOON' | 'DISCONTINUED'
  variants: OrderVariant[]
  whatsappNumber: string
  whatsappMessage?: string
  currencySymbol?: string
}

export default function ProductOrderPanel({
  productId,
  productName,
  category,
  productUrl,
  currencyCode,
  regularPrice,
  discountPrice,
  showPrice,
  availability,
  variants,
  whatsappNumber,
  whatsappMessage,
  currencySymbol = '₦',
}: ProductOrderPanelProps) {
  const variantGroups = useMemo(() => {
    const groups = new Map<string, OrderVariant[]>()
    for (const variant of variants) {
      const list = groups.get(variant.name) ?? []
      list.push(variant)
      groups.set(variant.name, list)
    }
    return Array.from(groups.entries())
  }, [variants])

  const [selection, setSelection] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const [name, options] of variantGroups) {
      const preferred =
        options.find((option) => option.availability === 'AVAILABLE') ?? options[0]
      if (preferred) initial[name] = preferred.id
    }
    return initial
  })
  const [quantity, setQuantity] = useState(1)
  const [copied, setCopied] = useState(false)

  const selectedVariants = variantGroups
    .map(([name, options]) => {
      const selectedId = selection[name]
      const option = options.find((item) => item.id === selectedId)
      return option ? { name, option } : null
    })
    .filter((entry): entry is { name: string; option: OrderVariant } => entry !== null)

  const modifierTotal = selectedVariants.reduce(
    (total, entry) => total + entry.option.priceModifier,
    0
  )
  const basePrice = discountPrice ?? regularPrice
  const unitPrice = basePrice + modifierTotal
  const total = unitPrice * quantity

  const variantUnavailable = selectedVariants.some(
    (entry) =>
      entry.option.availability === 'OUT_OF_STOCK' ||
      entry.option.availability === 'DISCONTINUED'
  )
  const soldOut =
    availability === 'OUT_OF_STOCK' ||
    availability === 'DISCONTINUED' ||
    variantUnavailable

  const whatsappUrl = buildWhatsAppOrderUrl({
    productName,
    price: showPrice ? formatPrice(total, { symbol: currencySymbol }) : 'Price on request',
    variants: Object.fromEntries(
      selectedVariants.map((entry) => [entry.name, entry.option.value])
    ),
    quantity,
    productUrl,
    whatsappNumber,
    messageTemplate: whatsappMessage,
  })

  const availabilityLabel: Record<string, string> = {
    AVAILABLE: 'In stock — ready to dispatch',
    MADE_TO_ORDER: 'Made to order — crafted for you',
    OUT_OF_STOCK: 'Currently sold out',
    COMING_SOON: 'Coming soon',
    DISCONTINUED: 'No longer available',
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(productUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be blocked; fall back to a prompt-free no-op.
    }
  }

  async function shareProduct() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: productName, url: productUrl })
        return
      } catch {
        // User cancelled the share sheet — fall through to copying.
      }
    }
    await copyLink()
  }

  return (
    <div className="flex flex-col gap-6">
      {variantGroups.length > 0 && (
        <div className="flex flex-col gap-5">
          {variantGroups.map(([name, options]) => (
            <fieldset key={name}>
              <legend className="text-[11px] uppercase tracking-[0.18em] font-medium text-taupe mb-2.5">
                {name}
              </legend>
              <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                  const isSelected = selection[name] === option.id
                  const isOptionSoldOut =
                    option.availability === 'OUT_OF_STOCK' ||
                    option.availability === 'DISCONTINUED'
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setSelection((current) => ({ ...current, [name]: option.id }))
                      }
                      aria-pressed={isSelected}
                      className={`min-h-11 px-4 py-2 text-sm border transition-all ${
                        isSelected
                          ? 'border-espresso bg-espresso text-ivory'
                          : 'border-sand bg-white text-espresso hover:border-gold'
                      } ${isOptionSoldOut ? 'opacity-50 line-through' : ''}`}
                    >
                      {option.value}
                      {option.priceModifier > 0 && (
                        <span
                          className={`ml-2 text-[11px] ${
                            isSelected ? 'text-gold' : 'text-taupe'
                          }`}
                        >
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

      <div className="flex flex-wrap items-center gap-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-taupe block mb-2.5">
            Quantity
          </span>
          <div className="inline-flex items-center border border-sand bg-white">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              aria-label="Decrease quantity"
              className="h-11 w-11 flex items-center justify-center hover:bg-sand transition-colors"
            >
              <Minus size={15} />
            </button>
            <span aria-live="polite" className="w-10 text-center text-sm font-medium">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.min(99, value + 1))}
              aria-label="Increase quantity"
              className="h-11 w-11 flex items-center justify-center hover:bg-sand transition-colors"
            >
              <Plus size={15} />
            </button>
          </div>
        </div>

        <div>
          <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-taupe block mb-2.5">
            Total
          </span>
          <p className="text-2xl font-heading text-espresso" aria-live="polite">
            {showPrice
              ? formatPrice(total, { symbol: currencySymbol })
              : 'Price on request'}
          </p>
        </div>
      </div>

      <p
        className={`text-xs uppercase tracking-[0.12em] flex items-center gap-2 ${
          soldOut ? 'text-taupe' : 'text-[#3F6B4A]'
        }`}
      >
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            soldOut ? 'bg-taupe' : 'bg-[#3F6B4A]'
          }`}
        />
        {soldOut
          ? 'Currently unavailable'
          : availabilityLabel[availability] ?? 'Available'}
      </p>

      <div className="flex flex-col gap-3">
        {soldOut ? (
          <span className="btn btn-secondary w-full cursor-not-allowed opacity-60">
            Sold Out
          </span>
        ) : (
          <TrackedWhatsAppLink
            href={whatsappUrl}
            productId={productId}
            productName={productName}
            category={category}
            price={showPrice ? unitPrice * quantity : undefined}
            currency={currencyCode}
            quantity={quantity}
            variants={Object.fromEntries(
              selectedVariants.map((entry) => [entry.name, entry.option.value])
            )}
            className="btn btn-primary w-full gap-2.5 group"
          >
            <MessageCircle
              size={18}
              className="text-gold group-hover:scale-110 transition-transform"
            />
            Order via WhatsApp
          </TrackedWhatsAppLink>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={shareProduct}
            className="btn btn-secondary flex-1 gap-2 text-xs"
          >
            <Share2 size={15} />
            Share
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="btn btn-secondary flex-1 gap-2 text-xs"
          >
            {copied ? (
              <>
                <Check size={15} className="text-[#3F6B4A]" />
                Link Copied
              </>
            ) : (
              <>
                <Copy size={15} />
                Copy Link
              </>
            )}
          </button>
        </div>
        <p className="text-[11px] text-taupe text-center leading-relaxed">
          Or call our concierge — we will confirm availability, delivery and payment
          details personally.
        </p>
      </div>
    </div>
  )
}
