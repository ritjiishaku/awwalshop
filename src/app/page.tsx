import { products } from "@/data/products"
import { siteConfig } from "@/data/site"
import { ProductCard } from "@/components/site/product-card"

export default function HomePage() {
  const featured = products.filter((p) => p.featured)
  const all = products

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative overflow-hidden border-b border-[var(--color-sand)]"
        style={{
          background:
            "linear-gradient(135deg, var(--color-paper) 0%, #ede5d8 40%, #f0e8da 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--color-brass) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, var(--color-olive) 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          {/* Tagline pill */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-sand)] bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-brass)] backdrop-blur-sm animate-fade-up">
            <span className="stock-dot" style={{ background: "var(--color-brass)" }} />
            {siteConfig.tagline}
          </div>

          <h1 className="mb-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[var(--color-ink)] sm:text-5xl lg:text-6xl max-w-2xl animate-fade-up delay-100">
            {siteConfig.heroTitle}
          </h1>

          <p className="mb-10 max-w-xl text-lg leading-relaxed text-[var(--color-muted)] animate-fade-up delay-200">
            {siteConfig.heroSubtitle}
          </p>

          <div className="flex flex-wrap gap-3 animate-fade-up delay-300">
            <a
              href="#catalogue"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-7 py-3 text-sm font-semibold text-[var(--color-paper)] transition-all hover:bg-[#333] hover:scale-[1.02] active:scale-95"
            >
              Browse catalogue
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Awwal, I'd like to enquire about your catalogue.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sand)] bg-white/80 px-7 py-3 text-sm font-semibold text-[var(--color-ink)] transition-all hover:bg-white hover:scale-[1.02] active:scale-95 backdrop-blur-sm"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat to order
            </a>
          </div>

          {/* Trust bar */}
          <div className="mt-16 flex flex-wrap gap-x-6 gap-y-2">
            {siteConfig.trustItems.map((item, i) => (
              <span
                key={item}
                className="flex items-center gap-2 text-sm text-[var(--color-muted)]"
                style={{ animationDelay: `${0.4 + i * 0.08}s` }}
              >
                <span className="text-[var(--color-brass)] text-xs">✦</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured ───────────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section id="featured" className="mx-auto max-w-6xl px-4 pt-16 pb-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-brass)]">
                Handpicked
              </p>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Featured pieces
              </h2>
            </div>
            <div className="divider mb-1" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── Full Catalogue ─────────────────────────────────────────────── */}
      <section id="catalogue" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-brass)]">
              Everything
            </p>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Full catalogue
            </h2>
          </div>
          <span className="text-sm text-[var(--color-muted)]">{all.length} pieces</span>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
      <section className="mx-4 mb-16 sm:mx-6">
        <div
          className="mx-auto max-w-6xl rounded-3xl p-10 text-center sm:p-16"
          style={{
            background: "linear-gradient(135deg, var(--color-olive) 0%, var(--color-ink) 100%)",
          }}
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-brass-light)]">
            How it works
          </p>
          <h2 className="mb-4 font-display text-2xl font-semibold text-[var(--color-paper)] sm:text-3xl">
            See it. Love it. Chat to get it.
          </h2>
          <p className="mx-auto mb-8 max-w-md text-base text-[var(--color-paper)]/60">
            No checkout, no cart. Find a piece you love, tap the WhatsApp button, and we'll sort out delivery.
          </p>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Awwal! I've been browsing your catalogue and I'd like to enquire.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#1ebe5d] hover:scale-[1.03] active:scale-95"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Open WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}
