'use client'

import { useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'

interface ContactFormProps {
  whatsappNumber: string
  defaultMessage?: string
}

const interests = [
  'Fine Jewellery',
  'Traditional Attire',
  'Timepieces',
  'Leather Footwear',
  'Accessories',
  'Bespoke Commission',
  'Order Status',
]

export default function ContactForm({
  whatsappNumber,
  defaultMessage = 'Hello AWWALSHOP, I would like to speak with the concierge.',
}: ContactFormProps) {
  const [name, setName] = useState('')
  const [interest, setInterest] = useState(interests[0])
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const cleanNumber = whatsappNumber.replace(/[^\d]/g, '')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = [
      defaultMessage,
      '',
      `Name: ${name || 'Not provided'}`,
      `Interest: ${interest}`,
      message ? `Details: ${message}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    window.open(
      `https://wa.me/${cleanNumber}?text=${encodeURIComponent(body)}`,
      '_blank',
      'noopener,noreferrer'
    )
    setSent(true)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="contact-name" className="label">
          Your Name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="How should we address you?"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="contact-interest" className="label">
          I&apos;m enquiring about
        </label>
        <select
          id="contact-interest"
          value={interest}
          onChange={(event) => setInterest(event.target.value)}
          className="input"
        >
          {interests.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="label">
          Your Message
        </label>
        <textarea
          id="contact-message"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Share sizing, occasion, timeline or any special requests."
          className="input textarea"
        />
      </div>

      <button type="submit" className="btn btn-primary w-full gap-2">
        <MessageCircle size={16} className="text-gold" />
        Continue on WhatsApp
        <Send size={14} />
      </button>

      <p className="text-[11px] text-taupe leading-relaxed text-center">
        {sent
          ? 'WhatsApp should have opened in a new tab. If not, check your pop-up settings.'
          : 'This opens WhatsApp with your message prepared. Nothing is sent until you press send there.'}
      </p>
    </form>
  )
}
