'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Copy, Eye, EyeOff, Loader2, Pencil, Star, Trash2 } from 'lucide-react'
import {
  deleteProduct,
  duplicateProduct,
  toggleProductFeatured,
  toggleProductStatus,
} from '@/lib/actions/products'

interface ProductRowActionsProps {
  product: {
    id: string
    name: string
    status: 'DRAFT' | 'PUBLISHED'
    isFeatured: boolean
  }
}

export default function ProductRowActions({ product }: ProductRowActionsProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const run = (
    task: () => Promise<{ success: true; redirectTo?: string } | { success: false; error: string }>,
    successMessage: string
  ) => {
    startTransition(async () => {
      const result = await task()
      if (!result.success) {
        toast.error(result.error || 'Action failed.')
        return
      }
      toast.success(successMessage)
      if (result.redirectTo) router.push(result.redirectTo)
      router.refresh()
    })
  }

  return (
    <div className="flex items-center justify-end gap-0.5">
      <Link
        href={`/admin/products/${product.id}`}
        className="rounded-lg p-2 text-espresso transition-colors hover:bg-white hover:text-[#a7823d] hover:shadow-soft"
        aria-label={`Edit ${product.name}`}
        title="Edit product"
      >
        <Pencil size={15} />
      </Link>

      <button
        type="button"
        onClick={() =>
          run(async () => {
            const result = await duplicateProduct(product.id)
            if (result.success && result.data) {
              return { success: true as const, redirectTo: `/admin/products/${result.data.id}` }
            }
            return result
          }, 'Product duplicated.')
        }
        disabled={pending}
        className="rounded-lg p-2 text-taupe transition-colors hover:bg-white hover:text-espresso hover:shadow-soft disabled:opacity-40"
        aria-label={`Duplicate ${product.name}`}
        title="Duplicate product"
      >
        <Copy size={15} />
      </button>

      <button
        type="button"
        onClick={() =>
          run(
            () => toggleProductStatus(product.id),
            product.status === 'PUBLISHED' ? 'Product unpublished.' : 'Product published.'
          )
        }
        disabled={pending}
        className="rounded-lg p-2 text-taupe transition-colors hover:bg-white hover:text-espresso hover:shadow-soft disabled:opacity-40"
        aria-label={product.status === 'PUBLISHED' ? `Unpublish ${product.name}` : `Publish ${product.name}`}
        title={product.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
      >
        {product.status === 'PUBLISHED' ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>

      <button
        type="button"
        onClick={() =>
          run(
            () => toggleProductFeatured(product.id),
            product.isFeatured ? 'Removed from featured.' : 'Added to featured.'
          )
        }
        disabled={pending}
        className={`rounded-lg p-2 transition-colors hover:bg-white hover:shadow-soft disabled:opacity-40 ${
          product.isFeatured ? 'text-gold' : 'text-taupe hover:text-gold'
        }`}
        aria-label={product.isFeatured ? `Unfeature ${product.name}` : `Feature ${product.name}`}
        title={product.isFeatured ? 'Remove from featured' : 'Mark as featured'}
      >
        <Star size={15} fill={product.isFeatured ? 'currentColor' : 'none'} />
      </button>

      <button
        type="button"
        onClick={() => {
          if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return
          run(() => deleteProduct(product.id), 'Product deleted.')
        }}
        disabled={pending}
        className="rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
        aria-label={`Delete ${product.name}`}
        title="Delete product"
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
      </button>
    </div>
  )
}
