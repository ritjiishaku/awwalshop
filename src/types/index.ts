export type MediaType = "image" | "video"

export type MediaItem = {
  id: string
  type: MediaType
  src: string // direct upload URL or external link
  alt?: string
  poster?: string
}

export type Product = {
  id: string
  slug: string
  name: string
  price: number
  currency?: string
  category: "jewellery" | "clothes" | "other"
  description?: string
  inStock?: boolean
  featured?: boolean
  media: MediaItem[]
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

export type SiteConfig = {
  siteName: string
  tagline?: string
  logoText: string
  whatsappNumber: string
  trustItems: string[]
  about?: string
  heroTitle?: string
  heroSubtitle?: string
}
