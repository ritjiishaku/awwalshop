import { siteConfig } from "@/data/site"
import { products } from "@/data/products"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About — Awwalshop",
  description: "Learn about Awwalshop — a curated jewellery catalogue from Nigeria.",
}

export default function AboutPage() {
  const inStock = products.filter((p) => p.inStock).length

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="mb-12">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-brass)]">
          Our story
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-[var(--color-ink)] sm:text-5xl">
          About Awwalshop
        </h1>
        <div className="mt-4 divider" />
      </div>

      {/* About text */}
      <div className="prose prose-lg max-w-none">
        <p className="text-lg leading-relaxed text-[var(--color-muted)]">
          {siteConfig.about}
        </p>
        <p className="mt-6 text-base leading-relaxed text-[var(--color-muted)]">
          We keep things simple: no checkout flow, no cart, no password to remember. You browse, you like something, you tap a button and chat us directly. That's it.
        </p>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">
          Our pieces are carefully curated — jewellery first, with clothing coming soon. Every item in the catalogue is available for direct enquiry on WhatsApp.
        </p>
      </div>

      {/* Stats */}
      <div className="my-12 grid grid-cols-3 gap-4">
        {[
          { label: "Pieces available", value: `${inStock}+` },
          { label: "Ships from", value: "Nigeria 🇳🇬" },
          { label: "How to buy", value: "WhatsApp" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 rounded-2xl border border-[var(--color-sand)] bg-white p-5 text-center"
          >
            <span className="font-display text-2xl font-semibold text-[var(--color-ink)]">
              {stat.value}
            </span>
            <span className="text-xs text-[var(--color-muted)]">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Trust items */}
      <div className="rounded-2xl border border-[var(--color-sand)] bg-[var(--color-sand)]/30 p-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-brass)]">
          Why shop with us
        </p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {siteConfig.trustItems.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm font-medium text-[var(--color-ink)]">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-brass)] text-white text-xs">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="mb-4 text-[var(--color-muted)]">Ready to browse?</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-7 py-3 text-sm font-semibold text-[var(--color-paper)] transition-all hover:bg-[#333] hover:scale-[1.02]"
        >
          View catalogue
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  )
}
