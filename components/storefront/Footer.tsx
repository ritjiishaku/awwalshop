import Link from 'next/link'
import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react'
import Logo from '@/components/brand/Logo'
import type { CategoryNavItem } from '@/lib/storefront-types'

interface FooterProps {
  businessName?: string
  whatsappNumber?: string
  categories?: CategoryNavItem[]
  email?: string | null
  contactPhone?: string | null
  address?: string | null
  deliveryInfo?: string | null
  socialLinks?: { label: string; href: string }[]
}

export default function Footer({
  businessName = 'AWWALSHOP',
  whatsappNumber = '+2348000000000',
  categories = [],
  email,
  contactPhone,
  address,
  deliveryInfo,
  socialLinks = [],
}: FooterProps) {
  const cleanWhatsAppNumber = whatsappNumber.replace(/[^\d]/g, '')
  const whatsappHref = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
    'Hello Awwalshop, I would like to inquire about your catalogue.'
  )}`
  const location = address ? null : 'Lagos, Nigeria'

  return (
    <footer className="mt-auto bg-espresso text-ivory">
      <div className="container-brand py-6 sm:py-12">
        <div className="grid gap-y-0 sm:gap-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div className="pb-5 sm:pb-0">
            <Logo href="/shop" variant="light" showTagline={false} />
            <div className="mt-2 text-[9px] uppercase tracking-[0.16em] text-ivory/45 sm:text-[10px]">
              Modern African luxury
            </div>
          </div>

          <div>
            <details className="group sm:hidden">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between border-b border-ivory/10 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory/75 transition-colors hover:text-ivory focus-visible:outline-offset-2 marker:hidden">
                Shop
                <span aria-hidden="true" className="footer-accordion-indicator text-base text-gold" />
              </summary>
              <ul className="space-y-1.5 pt-2">
                <li>
                  <Link
                    href="/shop"
                    className="inline-flex min-h-11 items-center text-xs text-ivory/75 transition-colors hover:text-gold"
                  >
                    All pieces
                  </Link>
                </li>
                {categories.map((category, index) => (
                  <li key={category.slug} className={index >= 4 ? 'hidden' : undefined}>
                    <Link
                      href={`/shop?category=${category.slug}`}
                      className="inline-flex min-h-11 items-center gap-1.5 text-xs text-ivory/75 transition-colors hover:text-gold"
                    >
                      {category.name}
                      <span className="text-[10px] tabular-nums text-ivory/30">
                        {category.count}
                      </span>
                    </Link>
                  </li>
                ))}
                {categories.length > 4 && (
                  <li>
                    <Link
                      href="/shop#catalogue"
                      className="inline-flex min-h-11 items-center text-xs font-medium text-gold transition-colors hover:text-ivory"
                    >
                      View all categories
                    </Link>
                  </li>
                )}
              </ul>
            </details>
            <h3 className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/40 sm:block">
              Shop
            </h3>
            <ul className="mt-3 hidden space-y-2 sm:block sm:mt-4">
              <li>
                <Link
                  href="/shop"
                  className="inline-flex min-h-8 items-center text-sm text-ivory/65 transition-colors hover:text-ivory"
                >
                  All pieces
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/shop?category=${category.slug}`}
                    className="inline-flex min-h-8 items-center text-sm text-ivory/65 transition-colors hover:text-ivory"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {(email || contactPhone || address) && (
              <>
                <details className="group mt-0 border-t-0 pt-0 sm:hidden">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory/75 transition-colors hover:text-ivory focus-visible:outline-offset-2 marker:hidden">
                    Contact details
                    <span aria-hidden="true" className="footer-accordion-indicator text-base text-gold" />
                  </summary>
                  <ul className="space-y-2 pb-2 text-xs text-ivory/60">
                    {email && (
                      <li>
                        <a
                          href={`mailto:${email}`}
                          className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-gold"
                        >
                          <Mail size={13} className="text-gold/70" />
                          {email}
                        </a>
                      </li>
                    )}
                    {contactPhone && (
                      <li>
                        <a
                          href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`}
                          className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-gold"
                        >
                          <Phone size={13} className="text-gold/70" />
                          {contactPhone}
                        </a>
                      </li>
                    )}
                    {address && (
                      <li className="flex items-start gap-2">
                        <MapPin size={13} className="mt-1 shrink-0 text-gold/70" />
                        <span className="leading-relaxed">{address}</span>
                      </li>
                    )}
                  </ul>
                </details>
                <ul className="mt-4 hidden space-y-2 text-sm text-ivory/60 sm:block">
                {email && (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                    >
                      <Mail size={13} className="text-gold/70" />
                      {email}
                    </a>
                  </li>
                )}
                {contactPhone && (
                  <li>
                    <a
                      href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                    >
                      <Phone size={13} className="text-gold/70" />
                      {contactPhone}
                    </a>
                  </li>
                )}
                {address && (
                  <li className="flex items-start gap-2">
                    <MapPin size={13} className="mt-1 shrink-0 text-gold/70" />
                    <span className="leading-relaxed">{address}</span>
                  </li>
                )}
                </ul>
              </>
            )}

            {socialLinks.length > 0 && (
              <>
              <details className="group mt-2 border-t border-ivory/10 pt-2 sm:hidden">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory/75 transition-colors hover:text-ivory focus-visible:outline-offset-2 marker:hidden">
                  Follow us
                  <span aria-hidden="true" className="footer-accordion-indicator text-base text-gold" />
                </summary>
                <div className="flex flex-wrap gap-x-4 gap-y-2 pb-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory/60 transition-colors hover:text-gold"
                    >
                      {link.label}
                      <ArrowUpRight size={11} />
                    </a>
                  ))}
                </div>
              </details>
              <div className="mt-4 hidden flex-wrap gap-x-4 gap-y-2 border-t border-ivory/10 pt-3 sm:flex">
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-8 items-center text-xs text-ivory/60 transition-colors hover:text-ivory"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              </>
            )}

            <section className="mt-3 border-t border-ivory/10 pt-3 sm:mt-5">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory/45">
                Need help?
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ivory/70">
                Sizing or bespoke requests? Chat with our team.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-gold px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-espresso transition-colors hover:bg-[#d2b37e] focus-visible:outline-offset-2 sm:w-fit"
              >
                <MessageCircle size={14} />
                Chat on WhatsApp
              </a>
            </section>

            {deliveryInfo && (
              <p className="mt-3 max-w-sm text-[10px] leading-relaxed text-ivory/55">
                {deliveryInfo}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-1.5 border-t border-ivory/10 pt-3 text-center sm:mt-8 sm:flex-row sm:gap-3 sm:pt-4 sm:text-left">
          <p className="text-[10px] text-ivory/55">
            &copy; {new Date().getFullYear()} {businessName}. All rights
            reserved.
          </p>
          {location && (
            <p className="text-[9px] uppercase tracking-[0.12em] text-ivory/45">
              {location}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
