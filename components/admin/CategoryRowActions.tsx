'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Pencil, Trash2 } from 'lucide-react'
import { deleteCategory, toggleCategoryVisibility } from '@/lib/actions/categories'

interface CategoryRowActionsProps {
  category: { id: string; name: string; isVisible: boolean }
}

export default function CategoryRowActions({ category }: CategoryRowActionsProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const run = (
    task: () => Promise<{ success: true } | { success: false; error: string }>,
    successMessage: string
  ) => {
    startTransition(async () => {
      const result = await task()
      if (!result.success) {
        toast.error(result.error || 'Action failed.')
        return
      }
      toast.success(successMessage)
      router.refresh()
    })
  }

  return (
    <div className="flex items-center justify-end gap-0.5">
      <Link
        href={`/admin/categories/${category.id}`}
        className="rounded-lg p-2 text-espresso transition-colors hover:bg-white hover:text-[#a7823d] hover:shadow-soft"
        aria-label={`Edit ${category.name}`}
      >
        <Pencil size={15} />
      </Link>
      <button
        type="button"
        onClick={() =>
          run(
            () => toggleCategoryVisibility(category.id),
            category.isVisible ? 'Category hidden.' : 'Category visible.'
          )
        }
        disabled={pending}
        className="rounded-lg p-2 text-taupe transition-colors hover:bg-white hover:text-espresso hover:shadow-soft disabled:opacity-40"
        aria-label={category.isVisible ? `Hide ${category.name}` : `Show ${category.name}`}
      >
        {category.isVisible ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
      <button
        type="button"
        onClick={() => {
          if (
            !window.confirm(
              `Delete “${category.name}”? Products in this category will become uncategorised.`
            )
          ) {
            return
          }
          run(() => deleteCategory(category.id), 'Category deleted.')
        }}
        disabled={pending}
        className="rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
        aria-label={`Delete ${category.name}`}
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
      </button>
    </div>
  )
}
