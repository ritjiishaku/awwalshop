import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  hint?: string
  icon: ReactNode
  href?: string
}

export default function StatCard({ label, value, hint, icon, href }: StatCardProps) {
  const content = (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-lift">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(197,164,109,0.16),transparent_70%)]"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-taupe">
            {label}
          </p>
          <p className="mt-2 font-heading text-[2.5rem] leading-none text-espresso">
            {value}
          </p>
          {hint && (
            <p className="mt-2.5 text-[11px] leading-snug text-[#8b8178]">{hint}</p>
          )}
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#efe6d8] bg-[#faf6ee] text-[#a7823d] transition-colors group-hover:border-gold/40 group-hover:bg-gold group-hover:text-white">
          {icon}
        </span>
      </div>
      {href && (
        <span className="relative mt-4 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe transition-colors group-hover:text-espresso">
          Manage
          <ArrowUpRight
            size={12}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    )
  }

  return content
}
