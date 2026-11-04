import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
}

export default function PageHeader({
  title,
  description,
  eyebrow,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a7823d]">
            <span className="h-px w-6 bg-gold" />
            {eyebrow}
          </p>
        )}
        <h1 className="font-heading text-3xl leading-tight text-espresso sm:text-[2.6rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-[13px] leading-relaxed text-[#777068]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  )
}
