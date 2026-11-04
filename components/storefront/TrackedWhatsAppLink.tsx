'use client'

import type { ReactNode } from 'react'
import { trackStorefrontEvent } from '@/components/storefront/storefront-analytics'

interface TrackedWhatsAppLinkProps {
  href: string
  productId: string
  productName: string
  category?: string
  price?: number
  currency: string
  quantity: number
  variants?: Record<string, string>
  className: string
  ariaLabel?: string
  title?: string
  children: ReactNode
}

export default function TrackedWhatsAppLink({
  href,
  productId,
  productName,
  category,
  price,
  currency,
  quantity,
  variants,
  className,
  ariaLabel,
  title,
  children,
}: TrackedWhatsAppLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      title={title}
      className={className}
      onClick={() =>
        trackStorefrontEvent('whatsapp_click', {
          product_id: productId,
          product_name: productName,
          category,
          price,
          currency,
          quantity,
          variants,
          page_url: window.location.href,
        })
      }
    >
      {children}
    </a>
  )
}
