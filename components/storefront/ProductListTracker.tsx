'use client'

import { useEffect, useRef } from 'react'
import {
  trackStorefrontEvent,
  type StorefrontAnalyticsItem,
} from '@/components/storefront/storefront-analytics'

interface ProductListTrackerProps {
  listName: string
  items: StorefrontAnalyticsItem[]
  currency: string
}

export default function ProductListTracker({
  listName,
  items,
  currency,
}: ProductListTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current || items.length === 0) return
    tracked.current = true
    trackStorefrontEvent('view_item_list', {
      item_list_name: listName,
      currency,
      items,
    })
  }, [currency, items, listName])

  return null
}
