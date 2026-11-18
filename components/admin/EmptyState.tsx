import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="aw-admin-empty">
      {icon && <div className="aw-admin-empty-icon">{icon}</div>}
      <h3 className="aw-admin-empty-title">{title}</h3>
      {description && <p className="aw-admin-empty-description">{description}</p>}
      {action && <div className="aw-admin-empty-action">{action}</div>}
    </div>
  )
}
