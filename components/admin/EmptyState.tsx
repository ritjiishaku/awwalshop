import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="surface flex flex-col items-center border-dashed px-6 py-16 text-center">
      {icon && (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#efe6d8] bg-[#faf6ee] text-[#a7823d]">
          {icon}
        </div>
      )}
      <h3 className="font-heading text-2xl text-espresso">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#8b8178]">
          {description}
        </p>
      )}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}
