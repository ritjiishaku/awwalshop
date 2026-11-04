'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Pencil, Trash2 } from 'lucide-react'
import { deleteCollection, toggleCollectionVisibility } from '@/lib/actions/collections'

interface CollectionRowActionsProps {
  collection: { id: string; name: string; isVisible: boolean }
}

export default function CollectionRowActions({ collection }: CollectionRowActionsProps) {
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
        href={`/admin/collections/${collection.id}`}
        className="rounded-lg p-2 text-espresso transition-colors hover:bg-white hover:text-[#a7823d] hover:shadow-soft"
        aria-label={`Edit ${collection.name}`}
      >
        <Pencil size={15} />
      </Link>
      <button
        type="button"
        onClick={() =>
          run(
            () => toggleCollectionVisibility(collection.id),
            collection.isVisible ? 'Collection hidden.' : 'Collection visible.'
          )
        }
        disabled={pending}
        className="rounded-lg p-2 text-taupe transition-colors hover:bg-white hover:text-espresso hover:shadow-soft disabled:opacity-40"
        aria-label={collection.isVisible ? `Hide ${collection.name}` : `Show ${collection.name}`}
      >
        {collection.isVisible ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
      <button
        type="button"
        onClick={() => {
          if (
            !window.confirm(
              `Delete “${collection.name}”? Products will remain, but will be removed from this collection.`
            )
          ) {
            return
          }
          run(() => deleteCollection(collection.id), 'Collection deleted.')
        }}
        disabled={pending}
        className="rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
        aria-label={`Delete ${collection.name}`}
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
      </button>
    </div>
  )
}
