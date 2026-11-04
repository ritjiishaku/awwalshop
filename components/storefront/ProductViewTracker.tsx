'use client'

import { useEffect, useRef } from 'react'
import { trackStorefrontEvent } from '@/components/storefront/storefront-analytics'

interface ProductViewTrackerProps {
  productId: string
  productName: string
  category?: string
  price?: number
  currency: string
}

export default function ProductViewTracker(props: ProductViewTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    trackStorefrontEvent('view_item', {
      currency: props.currency,
      value: props.price,
      items: [
        {
          item_id: props.productId,
          item_name: props.productName,
          item_category: props.category,
          price: props.price,
          currency: props.currency,
        },
      ],
    })
  }, [props])

  return null
}
