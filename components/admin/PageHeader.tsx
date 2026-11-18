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
    <div className="aw-admin-page-header">
      <div className="aw-admin-page-header-copy">
        {eyebrow && <p className="aw-admin-eyebrow">{eyebrow}</p>}
        <h1 className="aw-admin-title">{title}</h1>
        {description && <p className="aw-admin-description">{description}</p>}
      </div>
      {actions && <div className="aw-admin-actions">{actions}</div>}
    </div>
  )
}
