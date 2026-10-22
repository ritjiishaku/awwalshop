import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = "₦") {
  return `${currency}${price.toLocaleString()}`
}

export function buildWhatsAppLink({
  phone,
  productName,
  price,
  url,
  message,
}: {
  phone: string
  productName?: string
  price?: number | string
  url?: string
  message?: string
}) {
  const base = message
    ? message
    : productName && price
      ? `Hi Awwal, is the ${productName} (${typeof price === "number" ? `₦${price.toLocaleString()}` : price}) still available? ${url ? url : ""}`
      : `Hi Awwal, I'd like to enquire about your catalogue. ${url ? url : ""}`
  const encoded = encodeURIComponent(base.trim())
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encoded}`
}
