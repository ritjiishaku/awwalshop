'use client'

export interface StorefrontAnalyticsItem {
  item_id: string
  item_name: string
  item_category?: string
  price?: number
  currency?: string
  index?: number
}

type MetaPixel = ((...args: unknown[]) => void) & {
  queue: unknown[][]
  loaded: boolean
  version: string
  callMethod?: (...args: unknown[]) => void
}

type TikTokPixel = unknown[] & {
  track: (...args: unknown[]) => void
  page: () => void
  load: (pixelId: string) => void
  methods: string[]
  _i: Record<string, unknown>
  _t: Record<string, number>
  _o: Record<string, unknown>
}

type StorefrontEventName = 'view_item' | 'view_item_list' | 'whatsapp_click'

let pendingEvents: {
  eventName: StorefrontEventName
  parameters: Record<string, unknown>
}[] = []

declare global {
  interface Window {
    dataLayer?: unknown[][]
    gtag?: (...args: unknown[]) => void
    fbq?: MetaPixel
    ttq?: TikTokPixel
  }
}

function appendScript(id: string, src: string) {
  if (document.getElementById(id)) return

  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

export function initializeStorefrontAnalytics({
  gaMeasurementId,
  metaPixelId,
  tiktokPixelId,
}: {
  gaMeasurementId?: string
  metaPixelId?: string
  tiktokPixelId?: string
}) {
  if (gaMeasurementId && /^G-[A-Z0-9]+$/i.test(gaMeasurementId)) {
    window.dataLayer ??= []
    window.gtag ??= (...args) => window.dataLayer?.push(args)
    window.gtag('js', new Date())
    window.gtag('config', gaMeasurementId)
    appendScript(
      'awwalshop-google-analytics',
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`
    )
  } else if (gaMeasurementId) {
    console.error('Invalid NEXT_PUBLIC_GA_MEASUREMENT_ID; analytics was not initialized.')
  }

  if (metaPixelId && /^\d+$/.test(metaPixelId)) {
    if (!window.fbq) {
      const fbq = ((...args: unknown[]) => {
        if (fbq.callMethod) fbq.callMethod(...args)
        else fbq.queue.push(args)
      }) as MetaPixel
      fbq.queue = []
      fbq.loaded = true
      fbq.version = '2.0'
      window.fbq = fbq
      appendScript(
        'awwalshop-meta-pixel',
        'https://connect.facebook.net/en_US/fbevents.js'
      )
    }
    window.fbq('init', metaPixelId)
    window.fbq('track', 'PageView')
  } else if (metaPixelId) {
    console.error('Invalid NEXT_PUBLIC_META_PIXEL_ID; analytics was not initialized.')
  }

  if (tiktokPixelId && /^[A-Z0-9]+$/i.test(tiktokPixelId)) {
    if (!window.ttq) {
      const queue: unknown[] = []
      const methods = [
        'page',
        'track',
        'identify',
        'instances',
        'debug',
        'on',
        'off',
        'once',
        'ready',
        'alias',
        'group',
        'enableCookie',
        'disableCookie',
        'holdConsent',
        'revokeConsent',
        'grantConsent',
      ]
      const stubs = Object.fromEntries(
        methods.map((method) => [
          method,
          (...args: unknown[]) => queue.push([method, ...args]),
        ])
      )
      const ttq: TikTokPixel = Object.assign(queue, {
        ...stubs,
        methods,
        _i: {} as Record<string, unknown>,
        _t: {} as Record<string, number>,
        _o: {} as Record<string, unknown>,
        track: (...args: unknown[]) => queue.push(['track', ...args]),
        page: () => queue.push(['page']),
        load: (pixelId: string) => {
          ttq._i[pixelId] = []
          ttq._t[pixelId] = Date.now()
          ttq._o[pixelId] = []
          appendScript(
            'awwalshop-tiktok-pixel',
            `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(pixelId)}&lib=ttq`
          )
        },
      })
      window.ttq = ttq
    }
    window.ttq.load(tiktokPixelId)
    window.ttq.page()
  } else if (tiktokPixelId) {
    console.error('Invalid NEXT_PUBLIC_TIKTOK_PIXEL_ID; analytics was not initialized.')
  }

  const queuedEvents = pendingEvents
  pendingEvents = []
  queuedEvents.forEach(({ eventName, parameters }) =>
    dispatchStorefrontEvent(eventName, parameters)
  )
}

function dispatchStorefrontEvent(
  eventName: StorefrontEventName,
  parameters: Record<string, unknown>
) {
  window.gtag?.('event', eventName, parameters)

  const pixelEvent =
    eventName === 'view_item'
      ? 'ViewContent'
      : eventName === 'whatsapp_click'
        ? 'Contact'
        : eventName
  if (eventName === 'view_item_list') {
    window.fbq?.('trackCustom', eventName, parameters)
  } else {
    window.fbq?.('track', pixelEvent, parameters)
  }
  window.ttq?.track(pixelEvent, parameters)
}

export function trackStorefrontEvent(
  eventName: StorefrontEventName,
  parameters: Record<string, unknown>
) {
  if (!window.gtag && !window.fbq && !window.ttq) {
    pendingEvents.push({ eventName, parameters })
    return
  }
  dispatchStorefrontEvent(eventName, parameters)
}
