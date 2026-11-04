import { z } from 'zod'

export const productStatusSchema = z.enum(['DRAFT', 'PUBLISHED'])
export const productAvailabilitySchema = z.enum([
  'AVAILABLE',
  'OUT_OF_STOCK',
  'MADE_TO_ORDER',
  'COMING_SOON',
  'DISCONTINUED',
])

export const productVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Variant name is required'),
  value: z.string().min(1, 'Variant value is required'),
  priceModifier: z.coerce.number().default(0),
  availability: productAvailabilitySchema.default('AVAILABLE'),
  sortOrder: z.coerce.number().default(0),
})

export const productMediaSchema = z.object({
  id: z.string().optional(),
  mediaType: z.enum(['IMAGE', 'VIDEO']).default('IMAGE'),
  sourceType: z
    .enum(['UPLOAD', 'EXTERNAL_URL', 'YOUTUBE', 'VIMEO'])
    .default('EXTERNAL_URL'),
  url: z.string().url('Enter a valid media URL'),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  altText: z.string().max(200).optional().or(z.literal('')),
  caption: z.string().max(300).optional().or(z.literal('')),
  sortOrder: z.coerce.number().default(0),
  isPrimary: z.boolean().default(false),
  publicId: z.string().optional().or(z.literal('')),
})

const productAttributesSchema = z
  .array(
    z.object({
      name: z.string().trim().min(1).max(100),
      value: z.string().trim().min(1).max(500),
    })
  )
  .default([])
  .superRefine((attributes, context) => {
    const labels = new Set<string>()
    attributes.forEach((attribute, index) => {
      const label = attribute.name.toLowerCase()
      if (labels.has(label)) {
        context.addIssue({
          code: 'custom',
          message: 'Product detail labels must be unique.',
          path: [index, 'name'],
        })
      }
      labels.add(label)
    })
  })

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  shortDescription: z.string().max(500).optional().or(z.literal('')),
  fullDescription: z.string().optional().or(z.literal('')),
  sku: z.string().max(100).optional().or(z.literal('')),
  categoryId: z.string().optional().or(z.literal('')),
  regularPrice: z.coerce.number().min(0, 'Price must be positive'),
  discountPrice: z.coerce.number().min(0).optional().nullable(),
  currency: z.string().default('NGN'),
  showPrice: z.boolean().default(true),
  material: z.string().max(200).optional().or(z.literal('')),
  colour: z.string().max(200).optional().or(z.literal('')),
  size: z.string().max(200).optional().or(z.literal('')),
  weight: z.string().max(200).optional().or(z.literal('')),
  customAttributes: productAttributesSchema,
  processingTime: z.string().max(200).optional().or(z.literal('')),
  deliveryInfo: z.string().optional().or(z.literal('')),
  status: productStatusSchema.default('DRAFT'),
  availability: productAvailabilitySchema.default('AVAILABLE'),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  seoTitle: z.string().max(70).optional().or(z.literal('')),
  seoDescription: z.string().max(160).optional().or(z.literal('')),
  seoImage: z.string().url().optional().or(z.literal('')),
  collectionIds: z.array(z.string()).default([]),
  variants: z.array(productVariantSchema).default([]),
  media: z.array(productMediaSchema).default([]),
})

export const updateProductSchema = createProductSchema.partial()

export type ProductInput = z.infer<typeof createProductSchema>

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  parentId: z.string().optional().or(z.literal('')),
  sortOrder: z.coerce.number().default(0),
  isVisible: z.boolean().default(true),
})

export const updateCategorySchema = createCategorySchema.partial()
export type CategoryInput = z.infer<typeof createCategorySchema>

export const createCollectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional().or(z.literal('')),
  bannerUrl: z.string().url().optional().or(z.literal('')),
  isVisible: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
})

export const updateCollectionSchema = createCollectionSchema.partial()
export type CollectionInput = z.infer<typeof createCollectionSchema>

// =============================================================================
// BUSINESS SETTINGS
// =============================================================================

const socialLinkSchema = z
  .string()
  .trim()
  .max(500, 'Link is too long')
  .refine(
    (value) => value === '' || /^https?:\/\//i.test(value),
    'Enter a full URL beginning with https://'
  )

export const businessSettingsSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(1, 'Business name is required')
    .max(100),
  tagline: z.string().trim().max(200).default(''),
  whatsappNumber: z
    .string()
    .trim()
    .min(7, 'WhatsApp number is required')
    .max(30)
    .regex(/^[+\d][\d\s()-]{6,}$/, 'Enter a valid phone number'),
  whatsappMessage: z
    .string()
    .trim()
    .min(1, 'WhatsApp message template is required')
    .max(2000),
  contactPhone: z.string().trim().max(40).default(''),
  email: z
    .string()
    .trim()
    .max(200)
    .refine(
      (value) => value === '' || z.string().email().safeParse(value).success,
      'Enter a valid email address'
    ),
  address: z.string().trim().max(300).default(''),
  currency: z.enum(['NGN', 'USD', 'GBP', 'EUR']),
  currencySymbol: z
    .string()
    .trim()
    .min(1, 'Currency symbol is required')
    .max(8),
  deliveryInfo: z.string().trim().max(1000).default(''),
  processingInfo: z.string().trim().max(1000).default(''),
  seoTitle: z.string().trim().max(70).default(''),
  seoDescription: z.string().trim().max(160).default(''),
  socialLinks: z.object({
    instagram: socialLinkSchema.default(''),
    facebook: socialLinkSchema.default(''),
    twitter: socialLinkSchema.default(''),
    tiktok: socialLinkSchema.default(''),
    youtube: socialLinkSchema.default(''),
  }),
  openingHours: z.object({
    weekdays: z.string().trim().max(100).default(''),
    saturday: z.string().trim().max(100).default(''),
    sunday: z.string().trim().max(100).default(''),
  }),
})

export type BusinessSettingsInput = z.infer<typeof businessSettingsSchema>

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})
