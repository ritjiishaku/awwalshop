'use client'

import { MessageCircle } from 'lucide-react'

interface WhatsAppFloatProps {
  whatsappNumber?: string
}

export default function WhatsAppFloat({
  whatsappNumber = '+2348000000000',
}: WhatsAppFloatProps) {
  const cleanNumber = whatsappNumber.replace(/[^\d]/g, '')

  return (
    <aside aria-label="WhatsApp ordering assistant">
      <a
        href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(
          'Hello Awwalshop, I would like to inquire about ordering from your catalogue.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order or inquire on WhatsApp"
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 inline-flex size-12 items-center justify-center rounded-full border border-[#C5A46D] bg-[#241C19] text-[#F8F5EF] shadow-lg transition-all hover:bg-[#1a1310] hover:scale-105 active:scale-95 sm:h-auto sm:w-auto sm:gap-2.5 sm:px-5 sm:py-3.5 group"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A46D] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C5A46D]"></span>
        </span>
        <MessageCircle size={20} className="text-[#C5A46D]" />
        <span className="hidden sm:inline-block text-xs uppercase tracking-wider font-semibold">
          Order on WhatsApp
        </span>
      </a>
    </aside>
  )
}
