export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatPrice(
  amount: number | string | { toNumber(): number },
  options: {
    currency?: string
    symbol?: string
    decimals?: number
  } = {}
): string {
  const { symbol = '₦', decimals = 0 } = options

  const num =
    typeof amount === 'object' && 'toNumber' in amount
      ? amount.toNumber()
      : Number(amount)

  if (isNaN(num)) return `${symbol}0`

  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)

  return `${symbol}${formatted}`
}

interface WhatsAppOrderDetails {
  productName: string
  price: string
  variants?: Record<string, string>
  quantity: number
  productUrl: string
  whatsappNumber: string
  messageTemplate?: string
}

export function buildWhatsAppOrderUrl({
  productName,
  price,
  variants = {},
  quantity,
  productUrl,
  whatsappNumber,
  messageTemplate,
}: WhatsAppOrderDetails): string {
  const normalizedNumber = whatsappNumber.replace(/[^\d]/g, '')

  const variantLines = Object.entries(variants)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')

  const defaultTemplate = `Hello Awwalshop,\n\nI am interested in ordering:\n\nProduct: {productName}\nPrice: {price}\n{variants}Quantity: {quantity}\nProduct link: {productUrl}\n\nPlease provide more information about availability and delivery.`

  const attributedProductUrl = new URL(productUrl)
  attributedProductUrl.searchParams.set('utm_source', 'awwalshop')
  attributedProductUrl.searchParams.set('utm_medium', 'whatsapp')
  attributedProductUrl.searchParams.set('utm_campaign', 'product_enquiry')

  const template = messageTemplate || defaultTemplate

  const message = template
    .replace('{productName}', productName)
    .replace('{price}', price)
    .replace('{variants}', variantLines ? `${variantLines}\n` : '')
    .replace('{quantity}', String(quantity))
    .replace('{productUrl}', attributedProductUrl.toString())

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${normalizedNumber}?text=${encodedMessage}`
}

export type DetectedMediaSource = 'YOUTUBE' | 'VIMEO' | 'VIDEO' | 'IMAGE' | 'EXTERNAL_URL'

export function detectMediaSource(url: string): DetectedMediaSource {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.toLowerCase()
    const pathname = parsed.pathname.toLowerCase()

    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return 'YOUTUBE'
    }
    if (hostname.includes('vimeo.com')) {
      return 'VIMEO'
    }
    if (/\.(mp4|webm|mov|avi|mkv|m4v)(\?.*)?$/.test(pathname)) {
      return 'VIDEO'
    }
    if (/\.(jpg|jpeg|png|webp|avif|gif|svg|bmp)(\?.*)?$/.test(pathname)) {
      return 'IMAGE'
    }
    return 'EXTERNAL_URL'
  } catch {
    return 'EXTERNAL_URL'
  }
}

export function getYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1)
    }
    return parsed.searchParams.get('v')
  } catch {
    return null
  }
}

export function getVimeoVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    const match = parsed.pathname.match(/\/(\d+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
}

export function getVimeoEmbedUrl(videoId: string): string {
  return `https://player.vimeo.com/video/${videoId}?dnt=1`
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}
