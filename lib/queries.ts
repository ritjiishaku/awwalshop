import 'server-only'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'

export const ADMIN_PAGE_SIZE = 20

// =============================================================================
// DASHBOARD
// =============================================================================

export async function getDashboardData() {
  const [
    totalProducts,
    publishedProducts,
    draftProducts,
    totalCategories,
    visibleCategories,
    totalCollections,
    recentProducts,
    recentActivity,
    featuredProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: 'PUBLISHED' } }),
    prisma.product.count({ where: { status: 'DRAFT' } }),
    prisma.category.count(),
    prisma.category.count({
      where: {
        isVisible: true,
        OR: [
          { parentId: null },
          { parent: { isVisible: true, parentId: null } },
        ],
      },
    }),
    prisma.collection.count(),
    prisma.product.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: {
        category: { select: { name: true } },
        media: { where: { isPrimary: true }, take: 1 },
      },
    }),
    prisma.adminActivity.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { admin: { select: { name: true } } },
    }),
    prisma.product.count({ where: { isFeatured: true, status: 'PUBLISHED' } }),
  ])

  return {
    stats: {
      totalProducts,
      publishedProducts,
      draftProducts,
      totalCategories,
      visibleCategories,
      totalCollections,
      featuredProducts,
    },
    recentProducts,
    recentActivity,
  }
}

// =============================================================================
// PRODUCTS
// =============================================================================

interface ProductListParams {
  q?: string
  status?: string
  categoryId?: string
  page?: number
}

export async function getAdminProducts({
  q,
  status,
  categoryId,
  page = 1,
}: ProductListParams) {
  const where: Prisma.ProductWhereInput = {}

  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { sku: { contains: q, mode: 'insensitive' } },
      { shortDescription: { contains: q, mode: 'insensitive' } },
    ]
  }

  if (status === 'PUBLISHED' || status === 'DRAFT') {
    where.status = status
  }

  if (categoryId) {
    // Include products in the selected category and its direct children.
    const children = await prisma.category.findMany({
      where: { parentId: categoryId },
      select: { id: true },
    })
    where.categoryId = { in: [categoryId, ...children.map((child) => child.id)] }
  }

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (safePage - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      include: {
        category: { select: { name: true } },
        media: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1 },
      },
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    total,
    page: safePage,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  }
}

export async function getAdminProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      media: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
      variants: { orderBy: { sortOrder: 'asc' } },
      collections: { orderBy: { sortOrder: 'asc' } },
    },
  })
}

export async function getProductFormOptions() {
  const [categories, collections] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true, slug: true, parentId: true },
    }),
    prisma.collection.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true, slug: true },
    }),
  ])

  return { categories, collections }
}

// =============================================================================
// CATEGORIES
// =============================================================================

export async function getAdminCategories() {
  return prisma.category.findMany({
    orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      parent: { select: { id: true, name: true } },
      _count: { select: { products: true, children: true } },
    },
  })
}

export async function getAdminCategory(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true, children: true } } },
  })
}

export async function getCategoryParentOptions(excludeId?: string) {
  return prisma.category.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true, parentId: true },
  })
}

// =============================================================================
// COLLECTIONS
// =============================================================================

export async function getAdminCollections() {
  return prisma.collection.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { products: true } } },
  })
}

export async function getAdminCollection(id: string) {
  return prisma.collection.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  })
}

// =============================================================================
// MEDIA LIBRARY
// =============================================================================

export async function getAdminMediaAssets() {
  return prisma.productMedia.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      product: { select: { id: true, name: true, slug: true } },
    },
  })
}

// =============================================================================
// SETTINGS
// =============================================================================

export async function getBusinessSettings() {
  return prisma.businessSettings.findFirst()
}
