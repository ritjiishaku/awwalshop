'use client'

import { useEffect, useRef } from 'react'
import { initializeStorefrontAnalytics } from '@/components/storefront/storefront-analytics'

interface StorefrontAnalyticsProps {
  gaMeasurementId?: string
  metaPixelId?: string
  tiktokPixelId?: string
}

export default function StorefrontAnalytics({
  gaMeasurementId,
  metaPixelId,
  tiktokPixelId,
}: StorefrontAnalyticsProps) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    initializeStorefrontAnalytics({
      gaMeasurementId,
      metaPixelId,
      tiktokPixelId,
    })
  }, [gaMeasurementId, metaPixelId, tiktokPixelId])

  return null
}
