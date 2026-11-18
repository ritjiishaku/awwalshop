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

export default function StatCard({
  label,
  value,
  hint,
  icon,
  href,
}: StatCardProps) {
  const content = (
    <div className="aw-admin-stat">
      <span className="aw-admin-stat-glow" aria-hidden="true" />
      <div className="aw-admin-stat-head">
        <div>
          <p className="aw-admin-stat-label">{label}</p>
          <p className="aw-admin-stat-value">{value}</p>
          {hint && <p className="aw-admin-stat-hint">{hint}</p>}
        </div>
        <span className="aw-admin-stat-icon">{icon}</span>
      </div>
      {href && (
        <span className="aw-admin-stat-link">
          Manage
          <ArrowUpRight size={12} />
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="aw-admin-stat-wrap">
        {content}
      </Link>
    )
  }

  return content
}
