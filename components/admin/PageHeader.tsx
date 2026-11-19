import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
  /** Slug of the help-centre guide linked from this page. */
  helpGuide?: string
}

export default function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  helpGuide,
}: PageHeaderProps) {
  return (
    <div className="aw-admin-page-header">
      <div className="aw-admin-page-header-copy">
        {eyebrow && <p className="aw-admin-eyebrow">{eyebrow}</p>}
        <h1 className="aw-admin-title">{title}</h1>
        {description && <p className="aw-admin-description">{description}</p>}
      </div>
      {(actions || helpGuide) && (
        <div className="aw-admin-actions">
          {actions}
          {helpGuide && (
            <Link
              href={`/admin/help?guide=${encodeURIComponent(helpGuide)}`}
              className="aw-admin-help-link"
            >
              <BookOpen size={13} />
              How do I…?
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
