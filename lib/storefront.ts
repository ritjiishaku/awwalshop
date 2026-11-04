import 'server-only'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import type { CategoryNavItem } from '@/lib/storefront-types'

// =============================================================================
// AWWALSHOP — Public Storefront Queries
// =============================================================================

export const STOREFRONT_PAGE_SIZE = 12

export const productCardInclude = {
  media: {
    where: { mediaType: 'IMAGE' },
    orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
    take: 4,
  },
  category: { select: { name: true, slug: true } },
} satisfies Prisma.ProductInclude

export type StorefrontProduct = Prisma.ProductGetPayload<{
  include: typeof productCardInclude
}>

export interface CatalogueSearchParams {
  q?: string
  category?: string
  availability?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  page?: string
}

const PUBLISHED = 'PUBLISHED' as const

const AVAILABILITY_VALUES = [
  'AVAILABLE',
  'OUT_OF_STOCK',
  'MADE_TO_ORDER',
  'COMING_SOON',
  'DISCONTINUED',
] as const

type Availability = (typeof AVAILABILITY_VALUES)[number]

function toNumber(value?: string): number | undefined {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

// =============================================================================
// SETTINGS & CONTENT
// =============================================================================

export async function getPublicSettings() {
  return prisma.businessSettings.findFirst()
}

// =============================================================================
// TAXONOMY
// =============================================================================

export async function getVisibleCategories(): Promise<CategoryNavItem[]> {
  const categories = await prisma.category.findMany({
    where: { isVisible: true, parentId: null },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      children: {
        where: { isVisible: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        select: {
          name: true,
          slug: true,
          _count: { select: { products: { where: { status: PUBLISHED } } } },
        },
      },
      _count: { select: { products: { where: { status: PUBLISHED } } } },
    },
  })

  return categories.map((category) => {
    const children = category.children.map((child) => ({
      name: child.name,
      slug: child.slug,
      count: child._count.products,
    }))

    // A parent's own `_count` only includes products assigned directly to it,
    // so add the branch total for useful counts in the nav and filters.
    return {
      name: category.name,
      slug: category.slug,
      imageUrl: category.imageUrl,
      count:
        category._count.products +
        children.reduce((total, child) => total + child.count, 0),
      children,
    }
  })
}

// =============================================================================
// CATALOGUE
// =============================================================================

export async function getCatalogue(params: CatalogueSearchParams) {
  const query = params.q?.trim()
  const minPrice = toNumber(params.minPrice)
  const maxPrice = toNumber(params.maxPrice)
  const availability = AVAILABILITY_VALUES.includes(
    (params.availability ?? '') as Availability
  )
    ? (params.availability as Availability)
    : undefined

  const where: Prisma.ProductWhereInput = { status: PUBLISHED }
  const and: Prisma.ProductWhereInput[] = []

  if (query) {
    and.push({
      OR: [
        { name: { contains: query } },
        { shortDescription: { contains: query } },
        { fullDescription: { contains: query } },
        { sku: { contains: query } },
        { material: { contains: query } },
      ],
    })
  }

  if (params.category) {
    and.push({
      category: {
        is: {
          OR: [
            { slug: params.category },
            { parent: { slug: params.category } },
          ],
        },
      },
    })
  }

  if (availability) {
    and.push({ availability })
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const range = {
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
    }
    // Compare the effective selling price (discount price when present).
    and.push({
      OR: [
        { AND: [{ discountPrice: { not: null } }, { discountPrice: range }] },
        { AND: [{ discountPrice: null }, { regularPrice: range }] },
      ],
    })
  }

  if (and.length > 0) where.AND = and

  const orderBy: Prisma.ProductOrderByWithRelationInput[] =
    params.sort === 'price-asc'
      ? [{ regularPrice: 'asc' }]
      : params.sort === 'price-desc'
        ? [{ regularPrice: 'desc' }]
        : params.sort === 'featured'
          ? [{ isFeatured: 'desc' }, { updatedAt: 'desc' }]
          : [{ createdAt: 'desc' }]

  const page = Math.max(1, Math.floor(Number(params.page) || 1))

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * STOREFRONT_PAGE_SIZE,
      take: STOREFRONT_PAGE_SIZE,
      include: productCardInclude,
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / STOREFRONT_PAGE_SIZE)),
  }
}

// =============================================================================
// PRODUCT DETAIL
// =============================================================================

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: PUBLISHED },
    include: {
      media: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
      variants: { orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          parent: { select: { name: true, slug: true } },
        },
      },
    },
  })
}

export type ProductDetail = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  take = 4
) {
  return prisma.product.findMany({
    where: {
      status: PUBLISHED,
      id: { not: productId },
      ...(categoryId ? { categoryId } : {}),
    },
    orderBy: [{ isFeatured: 'desc' }, { updatedAt: 'desc' }],
    take,
    include: productCardInclude,
  })
}

// =============================================================================
// SITEMAP
// =============================================================================

export async function getSitemapData() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: PUBLISHED },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({
      where: { isVisible: true },
      select: { slug: true, updatedAt: true },
    }),
  ])

  return { products, categories }
}
