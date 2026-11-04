'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createCategory, updateCategory } from '@/lib/actions/categories'
import { slugify } from '@/lib/utils'
import type { CategoryInput } from '@/lib/validations'

interface ParentOption {
  id: string
  name: string
}

interface CategoryFormProps {
  mode: 'create' | 'edit'
  categoryId?: string
  parents: ParentOption[]
  initialValues?: CategoryInput
}

const emptyCategory: CategoryInput = {
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
  parentId: '',
  sortOrder: 0,
  isVisible: true,
}

export default function CategoryForm({
  mode,
  categoryId,
  parents,
  initialValues,
}: CategoryFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryInput>({ defaultValues: initialValues ?? emptyCategory })

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true)
    setError(null)
    const result =
      mode === 'create'
        ? await createCategory(values)
        : await updateCategory(categoryId!, values)

    if (!result.success) {
      setError(result.error)
      toast.error(result.error)
      setSaving(false)
      return
    }

    toast.success(mode === 'create' ? 'Category created.' : 'Category updated.')
    router.push('/admin/categories')
    router.refresh()
  })

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-taupe hover:text-espresso"
      >
        <ArrowLeft size={14} />
        Back to categories
      </Link>

      {error && (
        <div className="border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <div className="surface p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="name">Category name *</label>
            <input
              id="name"
              className="input"
              {...register('name', {
                required: 'Category name is required',
                onChange: (event) => {
                  if (!slugTouched) setValue('slug', slugify(event.target.value))
                },
              })}
            />
            {errors.name && <p className="text-xs text-rose-700 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="slug">URL slug *</label>
            <input
              id="slug"
              className="input font-mono text-sm"
              {...register('slug', {
                required: 'Slug is required',
                onChange: () => setSlugTouched(true),
              })}
            />
            {errors.slug && <p className="text-xs text-rose-700 mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="parentId">Parent category</label>
            <select id="parentId" className="input" {...register('parentId')}>
              <option value="">None — top-level category</option>
              {parents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="sortOrder">Sort order</label>
            <input
              id="sortOrder"
              type="number"
              className="input"
              {...register('sortOrder', {
                setValueAs: (value) => (value === '' ? 0 : Number(value)),
              })}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={4}
              className="input textarea"
              placeholder="A short introduction shown at the top of the category page."
              {...register('description')}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="imageUrl">Banner image URL</label>
            <input
              id="imageUrl"
              className="input font-mono text-xs"
              placeholder="https://…"
              {...register('imageUrl')}
            />
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-espresso">
          <input type="checkbox" className="accent-[#C5A46D]" {...register('isVisible')} />
          Visible in storefront navigation
        </label>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/categories" className="btn btn-secondary btn-sm">
          Cancel
        </Link>
        <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? 'Saving…' : mode === 'create' ? 'Create category' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
