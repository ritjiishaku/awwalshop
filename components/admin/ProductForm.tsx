'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Plus,
  Star,
  Trash2,
  Video,
} from 'lucide-react'
import { createProduct, updateProduct } from '@/lib/actions/products'
import MediaUploader from '@/components/admin/MediaUploader'
import { detectMediaSource, slugify } from '@/lib/utils'
import type { ProductInput } from '@/lib/validations'

interface CategoryOption {
  id: string
  name: string
  parentId: string | null
}

interface CollectionOption {
  id: string
  name: string
}

interface ProductFormProps {
  mode: 'create' | 'edit'
  productId?: string
  categories: CategoryOption[]
  collections: CollectionOption[]
  initialValues?: ProductInput
}

const emptyProduct: ProductInput = {
  name: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  sku: '',
  categoryId: '',
  regularPrice: 0,
  discountPrice: null,
  currency: 'NGN',
  showPrice: true,
  material: '',
  colour: '',
  size: '',
  weight: '',
  customAttributes: [],
  processingTime: '',
  deliveryInfo: '',
  status: 'DRAFT',
  availability: 'AVAILABLE',
  isFeatured: false,
  isNewArrival: false,
  seoTitle: '',
  seoDescription: '',
  seoImage: '',
  collectionIds: [],
  variants: [],
  media: [],
}

const availabilityOptions = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'OUT_OF_STOCK', label: 'Out of stock' },
  { value: 'MADE_TO_ORDER', label: 'Made to order' },
  { value: 'COMING_SOON', label: 'Coming soon' },
  { value: 'DISCONTINUED', label: 'Discontinued' },
] as const

function orderedCategories(categories: CategoryOption[]) {
  const result: { id: string; label: string }[] = []
  const parentIds = new Set(categories.filter((category) => category.parentId).map((c) => c.parentId!))

  for (const category of categories.filter((c) => !c.parentId)) {
    result.push({ id: category.id, label: category.name })
    for (const child of categories.filter((c) => c.parentId === category.id)) {
      result.push({ id: child.id, label: `— ${child.name}` })
    }
    parentIds.delete(category.id)
  }

  for (const category of categories) {
    if (!result.some((option) => option.id === category.id)) {
      result.push({ id: category.id, label: category.name })
    }
  }

  return result
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="surface p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="font-heading text-xl text-espresso">{title}</h2>
        {description && <p className="text-xs text-taupe mt-1">{description}</p>}
      </div>
      {children}
    </section>
  )
}

export default function ProductForm({
  mode,
  productId,
  categories,
  collections,
  initialValues,
}: ProductFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductInput>({
    defaultValues: initialValues ?? emptyProduct,
  })

  const mediaArray = useFieldArray({ control, name: 'media' })
  const variantArray = useFieldArray({ control, name: 'variants' })
  const attributeArray = useFieldArray({ control, name: 'customAttributes' })
  const selectedCollections = watch('collectionIds') ?? []
  const mediaValues = watch('media') ?? []
  const categoryOptions = orderedCategories(categories)

  const handleNameChange = (value: string) => {
    if (!slugTouched) {
      setValue('slug', slugify(value), { shouldValidate: false })
    }
  }

  const handleMediaUrlChange = (index: number, value: string) => {
    setValue(`media.${index}.url`, value)
    const detected = detectMediaSource(value)
    const sourceType =
      detected === 'YOUTUBE' || detected === 'VIMEO' ? detected : 'EXTERNAL_URL'
    const mediaType =
      detected === 'YOUTUBE' || detected === 'VIMEO' || detected === 'VIDEO'
        ? 'VIDEO'
        : 'IMAGE'
    setValue(`media.${index}.sourceType`, sourceType)
    setValue(`media.${index}.mediaType`, mediaType)
  }

  const setPrimaryMedia = (index: number) => {
    mediaValues.forEach((_, mediaIndex) => {
      setValue(`media.${mediaIndex}.isPrimary`, mediaIndex === index)
    })
  }

  const removeMedia = (index: number) => {
    const wasPrimary = mediaValues[index]?.isPrimary
    mediaArray.remove(index)
    if (wasPrimary && mediaValues.length > 1) {
      setValue('media.0.isPrimary', true)
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true)
    setError(null)

    const payload: ProductInput = {
      ...values,
      media: values.media
        .filter((item) => item.url.trim().length > 0)
        .map((item, index) => ({ ...item, sortOrder: index })),
      variants: values.variants.filter(
        (variant) => variant.name.trim().length > 0 && variant.value.trim().length > 0
      ),
      customAttributes: values.customAttributes.filter(
        (attribute) => attribute.name.trim().length > 0 && attribute.value.trim().length > 0
      ),
    }

    const result =
      mode === 'create'
        ? await createProduct(payload)
        : await updateProduct(productId!, payload)

    if (!result.success) {
      setError(result.error)
      toast.error(result.error)
      setSaving(false)
      return
    }

    toast.success(mode === 'create' ? 'Product created.' : 'Product updated.')
    router.push('/admin/products')
    router.refresh()
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-taupe hover:text-espresso"
        >
          <ArrowLeft size={14} />
          Back to products
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-taupe">
            {mode === 'create' ? 'New product' : 'Editing product'}
          </span>
          <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
            {saving ? <Loader2 size={14} className="animate-spin" /> : null}
            {saving ? 'Saving…' : mode === 'create' ? 'Create product' : 'Save changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        <div className="space-y-6">
          <Section
            title="Product information"
            description="The name, category and copy shown in the catalogue."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="name">
                  Product name *
                </label>
                <input
                  id="name"
                  className="input"
                  placeholder="e.g. Aurelia Diamond Halo Ring"
                  {...register('name', {
                    required: 'Product name is required',
                    onChange: (event) => handleNameChange(event.target.value),
                  })}
                />
                {errors.name && <p className="text-xs text-rose-700 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="label" htmlFor="slug">
                  URL slug *
                </label>
                <input
                  id="slug"
                  className="input font-mono text-sm"
                  placeholder="aurelia-diamond-halo-ring"
                  {...register('slug', {
                    required: 'Slug is required',
                    onChange: () => setSlugTouched(true),
                  })}
                />
                {errors.slug && <p className="text-xs text-rose-700 mt-1">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="label" htmlFor="sku">
                  SKU
                </label>
                <input id="sku" className="input font-mono text-sm" placeholder="AW-JW-RNG-001" {...register('sku')} />
              </div>

              <div>
                <label className="label" htmlFor="categoryId">
                  Category
                </label>
                <select id="categoryId" className="input" {...register('categoryId')}>
                  <option value="">Uncategorised</option>
                  {categoryOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" htmlFor="availability">
                  Availability
                </label>
                <select id="availability" className="input" {...register('availability')}>
                  {availabilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="label" htmlFor="shortDescription">
                  Short description
                </label>
                <textarea
                  id="shortDescription"
                  rows={2}
                  className="input textarea min-h-0"
                  placeholder="A concise summary used on catalogue cards."
                  {...register('shortDescription')}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="label" htmlFor="fullDescription">
                  Full description
                </label>
                <textarea
                  id="fullDescription"
                  rows={7}
                  className="input textarea"
                  placeholder="The full story, craftsmanship notes and details."
                  {...register('fullDescription')}
                />
              </div>
            </div>
          </Section>

          <Section title="Pricing" description="Prices are stored in the product currency.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="label" htmlFor="regularPrice">
                  Regular price *
                </label>
                <input
                  id="regularPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  className="input"
                  {...register('regularPrice', {
                    required: 'Price is required',
                    setValueAs: (value) => (value === '' ? 0 : Number(value)),
                  })}
                />
                {errors.regularPrice && (
                  <p className="text-xs text-rose-700 mt-1">{errors.regularPrice.message}</p>
                )}
              </div>

              <div>
                <label className="label" htmlFor="discountPrice">
                  Discount price
                </label>
                <input
                  id="discountPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  className="input"
                  {...register('discountPrice', {
                    setValueAs: (value) => (value === '' ? null : Number(value)),
                  })}
                />
              </div>

              <div>
                <label className="label" htmlFor="currency">
                  Currency
                </label>
                <select id="currency" className="input" {...register('currency')}>
                  <option value="NGN">NGN — Nigerian Naira</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="EUR">EUR — Euro</option>
                </select>
              </div>
            </div>

            <label className="mt-5 flex items-center gap-3 text-sm text-espresso">
              <input type="checkbox" className="accent-[#C5A46D]" {...register('showPrice')} />
              Show price on the storefront
            </label>
          </Section>

          <Section title="Specifications" description="Optional details displayed on the product page.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label" htmlFor="material">Material</label>
                <input id="material" className="input" {...register('material')} />
              </div>
              <div>
                <label className="label" htmlFor="colour">Colour</label>
                <input id="colour" className="input" {...register('colour')} />
              </div>
              <div>
                <label className="label" htmlFor="size">Size</label>
                <input id="size" className="input" {...register('size')} />
              </div>
              <div>
                <label className="label" htmlFor="weight">Weight</label>
                <input id="weight" className="input" {...register('weight')} />
              </div>
              <div>
                <label className="label" htmlFor="processingTime">Processing time</label>
                <input id="processingTime" className="input" {...register('processingTime')} />
              </div>
              <div>
                <label className="label" htmlFor="deliveryInfo">Delivery information</label>
                <input id="deliveryInfo" className="input" {...register('deliveryInfo')} />
              </div>
            </div>
          </Section>

          <Section
            title="Additional details"
            description="Add any other product information customers should know."
          >
            <div className="space-y-3">
              {attributeArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_36px] gap-3"
                >
                  <input
                    className="input text-sm"
                    placeholder="Label (e.g. Stone)"
                    aria-label="Product detail label"
                    {...register(`customAttributes.${index}.name`)}
                  />
                  <input
                    className="input text-sm"
                    placeholder="Value (e.g. 1.0ct diamond)"
                    aria-label="Product detail value"
                    {...register(`customAttributes.${index}.value`)}
                  />
                  <button
                    type="button"
                    onClick={() => attributeArray.remove(index)}
                    className="h-10 flex items-center justify-center text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200"
                    aria-label="Remove product detail"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => attributeArray.append({ name: '', value: '' })}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={14} />
                Add detail
              </button>
            </div>
          </Section>

          <Section
            title="Media"
            description="Upload files to Cloudinary or paste image, YouTube, Vimeo and MP4 URLs. The primary item is used as the catalogue thumbnail."
          >
            <div className="space-y-4">
              <MediaUploader
                onUploaded={(asset) => {
                  mediaArray.append({
                    mediaType: asset.mediaType,
                    sourceType: 'UPLOAD',
                    url: asset.url,
                    thumbnailUrl: asset.thumbnailUrl ?? '',
                    altText: '',
                    caption: '',
                    sortOrder: mediaArray.fields.length,
                    isPrimary: mediaArray.fields.length === 0,
                    publicId: asset.publicId,
                  })
                }}
              />

              {mediaArray.fields.length === 0 && (
                <p className="text-sm text-taupe bg-[#faf7f1] border border-dashed border-line px-4 py-6 text-center">
                  No media yet. Add an image or video URL to get started.
                </p>
              )}

              {mediaArray.fields.map((field, index) => {
                const current = mediaValues[index]
                return (
                  <div key={field.id} className="border border-line p-4 bg-[#FDFCFA]">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-20 rounded-lg bg-[#faf7f1] border border-line flex items-center justify-center overflow-hidden shrink-0">
                        {current?.url ? (
                          current.mediaType === 'VIDEO' ? (
                            <Video size={20} className="text-taupe" />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={current.url}
                              alt={current.altText || ''}
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <ImageIcon size={20} className="text-taupe" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-3">
                        <input
                          className="input font-mono text-xs"
                          placeholder="https://images.unsplash.com/… or YouTube/Vimeo URL"
                          {...register(`media.${index}.url`, {
                            onChange: (event) => handleMediaUrlChange(index, event.target.value),
                          })}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input className="input text-sm" placeholder="Alt text" {...register(`media.${index}.altText`)} />
                          <input className="input text-sm" placeholder="Caption (optional)" {...register(`media.${index}.caption`)} />
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-taupe">
                          <label className="flex items-center gap-1.5">
                            <input
                              type="radio"
                              name={`primary-media-${field.id}`}
                              checked={Boolean(current?.isPrimary)}
                              onChange={() => setPrimaryMedia(index)}
                              className="accent-[#C5A46D]"
                            />
                            <Star size={12} className="text-gold" />
                            Primary
                          </label>
                          <label className="flex items-center gap-1.5">
                            <select
                              className="bg-transparent border border-line px-1.5 py-0.5 text-[11px]"
                              {...register(`media.${index}.mediaType`)}
                            >
                              <option value="IMAGE">Image</option>
                              <option value="VIDEO">Video</option>
                            </select>
                          </label>
                          <button
                            type="button"
                            onClick={() => removeMedia(index)}
                            className="ml-auto flex items-center gap-1 text-rose-700 hover:text-rose-900"
                          >
                            <Trash2 size={12} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              <button
                type="button"
                onClick={() =>
                  mediaArray.append({
                    mediaType: 'IMAGE',
                    sourceType: 'EXTERNAL_URL',
                    url: '',
                    thumbnailUrl: '',
                    altText: '',
                    caption: '',
                    sortOrder: mediaArray.fields.length,
                    isPrimary: mediaArray.fields.length === 0,
                    publicId: '',
                  })
                }
                className="btn btn-secondary btn-sm"
              >
                <Plus size={14} />
                Add media
              </button>
            </div>
          </Section>

          <Section
            title="Variants"
            description="Add options such as ring size, colour or material. Price modifiers are added to the base price."
          >
            <div className="space-y-3">
              {variantArray.fields.length === 0 && (
                <p className="text-sm text-taupe">No variants — this is a single-option product.</p>
              )}

              {variantArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_120px_150px_36px] gap-3 items-start border border-line p-3 bg-[#FDFCFA]"
                >
                  <input className="input text-sm" placeholder="Option (e.g. Size)" {...register(`variants.${index}.name`)} />
                  <input className="input text-sm" placeholder="Value (e.g. Size 9)" {...register(`variants.${index}.value`)} />
                  <input
                    type="number"
                    step="0.01"
                    className="input text-sm"
                    placeholder="+ Price"
                    {...register(`variants.${index}.priceModifier`, {
                      setValueAs: (value) => (value === '' ? 0 : Number(value)),
                    })}
                  />
                  <select className="input text-sm" {...register(`variants.${index}.availability`)}>
                    {availabilityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => variantArray.remove(index)}
                    className="h-10 flex items-center justify-center text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200"
                    aria-label="Remove variant"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  variantArray.append({
                    name: '',
                    value: '',
                    priceModifier: 0,
                    availability: 'AVAILABLE',
                    sortOrder: variantArray.fields.length,
                  })
                }
                className="btn btn-secondary btn-sm"
              >
                <Plus size={14} />
                Add variant
              </button>
            </div>
          </Section>

          <Section title="SEO" description="Optional overrides for search engines and social sharing.">
            <div className="space-y-5">
              <div>
                <label className="label" htmlFor="seoTitle">SEO title</label>
                <input id="seoTitle" className="input" maxLength={70} {...register('seoTitle')} />
              </div>
              <div>
                <label className="label" htmlFor="seoDescription">SEO description</label>
                <textarea id="seoDescription" rows={2} maxLength={160} className="input textarea min-h-0" {...register('seoDescription')} />
              </div>
              <div>
                <label className="label" htmlFor="seoImage">Social share image URL</label>
                <input id="seoImage" className="input font-mono text-xs" placeholder="https://…" {...register('seoImage')} />
              </div>
            </div>
          </Section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-20">
          <Section title="Publishing">
            <div className="space-y-4">
              <div>
                <label className="label" htmlFor="status">Status</label>
                <select id="status" className="input" {...register('status')}>
                  <option value="DRAFT">Draft — hidden from storefront</option>
                  <option value="PUBLISHED">Published — live on storefront</option>
                </select>
              </div>

              <label className="flex items-start gap-3 text-sm text-espresso">
                <input type="checkbox" className="mt-1 accent-[#C5A46D]" {...register('isFeatured')} />
                <span>
                  Featured product
                  <span className="block text-[11px] text-taupe mt-0.5">
                    Appears in homepage edit sections.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 text-sm text-espresso">
                <input type="checkbox" className="mt-1 accent-[#C5A46D]" {...register('isNewArrival')} />
                <span>
                  New arrival
                  <span className="block text-[11px] text-taupe mt-0.5">
                    Included in the New Arrivals collection.
                  </span>
                </span>
              </label>
            </div>
          </Section>

          <Section title="Collections">
            {collections.length === 0 ? (
              <p className="text-sm text-taupe">No collections yet.</p>
            ) : (
              <div className="space-y-2.5">
                {collections.map((collection) => (
                  <label key={collection.id} className="flex items-center gap-3 text-sm text-espresso">
                    <input
                      type="checkbox"
                      value={collection.id}
                      className="accent-[#C5A46D]"
                      checked={selectedCollections.includes(collection.id)}
                      onChange={(event) => {
                        const current = new Set(selectedCollections)
                        if (event.target.checked) current.add(collection.id)
                        else current.delete(collection.id)
                        setValue('collectionIds', Array.from(current))
                      }}
                    />
                    {collection.name}
                  </label>
                ))}
              </div>
            )}
          </Section>

          <div className="bg-espresso text-ivory p-5 border border-gold/30">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold mb-2">
              Storefront preview
            </p>
            <p className="text-xs text-[#E8DED0]/80 leading-relaxed">
              Save the product, then open its public page from the products list to review it as a
              customer would.
            </p>
          </div>
        </aside>
      </div>
    </form>
  )
}
