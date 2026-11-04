import Link from 'next/link'

export default function StorefrontNotFound() {
  return (
    <section className="container-brand py-24 lg:py-32 text-center">
      <span className="text-[11px] uppercase tracking-[0.28em] text-gold font-medium">
        404 — Not Found
      </span>
      <h1 className="mt-4 font-heading text-4xl sm:text-5xl text-espresso leading-tight">
        This piece has moved on.
      </h1>
      <p className="mt-4 max-w-md mx-auto text-sm text-taupe leading-relaxed">
        The page you are looking for may have been renamed, sold, or archived.
        Browse the current catalogue to find available products.
      </p>
      <div className="mt-8 flex justify-center">
        <Link href="/shop" className="btn btn-primary">
          Browse the Catalogue
        </Link>
      </div>
    </section>
  )
}
