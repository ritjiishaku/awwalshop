'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { logAdminActivity } from '@/lib/activity'
import { actionError, type ActionResult } from '@/lib/actions/shared'
import { createProductSchema, type ProductInput } from '@/lib/validations'

function revalidateProduct(slug?: string) {
  revalidatePath('/admin/products')
  revalidatePath('/admin')
  revalidatePath('/shop')
  revalidatePath('/collections')
  revalidatePath('/')
  revalidatePath('/sitemap.xml')
  if (slug) revalidatePath(`/products/${slug}`)
}

function normalizeMedia(media: ProductInput['media']) {
  const primaryIndex = media.findIndex((item) => item.isPrimary)
  const resolvedPrimary = primaryIndex === -1 ? 0 : primaryIndex

  return media.map((item, index) => ({
    mediaType: item.mediaType,
    sourceType: item.sourceType,
    url: item.url,
    thumbnailUrl: item.thumbnailUrl || null,
    altText: item.altText || null,
    caption: item.caption || null,
    publicId: item.publicId || null,
    sortOrder: index,
    isPrimary: index === resolvedPrimary,
  }))
}

function toProductData(input: ProductInput) {
  return {
    name: input.name,
    slug: input.slug,
    shortDescription: input.shortDescription || null,
    fullDescription: input.fullDescription || null,
    sku: input.sku || null,
    categoryId: input.categoryId || null,
    regularPrice: input.regularPrice,
    discountPrice: input.discountPrice ?? null,
    currency: input.currency,
    showPrice: input.showPrice,
    material: input.material || null,
    colour: input.colour || null,
    size: input.size || null,
    weight: input.weight || null,
    customAttributes: Object.fromEntries(
      input.customAttributes
        .filter((attribute) => attribute.name.trim() && attribute.value.trim())
        .map((attribute) => [attribute.name.trim(), attribute.value.trim()])
    ),
    processingTime: input.processingTime || null,
    deliveryInfo: input.deliveryInfo || null,
    status: input.status,
    availability: input.availability,
    isFeatured: input.isFeatured,
    isNewArrival: input.isNewArrival,
    seoTitle: input.seoTitle || null,
    seoDescription: input.seoDescription || null,
    seoImage: input.seoImage || null,
  }
}

export async function createProduct(input: ProductInput): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireAdmin()
    const parsed = createProductSchema.safeParse(input)

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid product data.' }
    }

    const data = parsed.data
    const product = await prisma.product.create({
      data: {
        ...toProductData(data),
        media: { create: normalizeMedia(data.media) },
        variants: {
          create: data.variants.map((variant, index) => ({
            name: variant.name,
            value: variant.value,
            priceModifier: variant.priceModifier,
            availability: variant.availability,
            sortOrder: index,
          })),
        },
        collections: {
          create: data.collectionIds.map((collectionId, index) => ({
            collectionId,
            sortOrder: index,
          })),
        },
      },
    })

    await logAdminActivity({
      adminId: session.user.id,
      action: 'CREATE',
      entityType: 'Product',
      entityId: product.id,
      description: `Created product “${product.name}”.`,
    })

    revalidateProduct(product.slug)
    return { success: true, data: { id: product.id } }
  } catch (error) {
    return actionError(error, 'Unable to create the product.')
  }
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireAdmin()
    const parsed = createProductSchema.safeParse(input)

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid product data.' }
    }

    const data = parsed.data
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...toProductData(data),
        media: { deleteMany: {}, create: normalizeMedia(data.media) },
        variants: {
          deleteMany: {},
          create: data.variants.map((variant, index) => ({
            name: variant.name,
            value: variant.value,
            priceModifier: variant.priceModifier,
            availability: variant.availability,
            sortOrder: index,
          })),
        },
        collections: {
          deleteMany: {},
          create: data.collectionIds.map((collectionId, index) => ({
            collectionId,
            sortOrder: index,
          })),
        },
      },
    })

    await logAdminActivity({
      adminId: session.user.id,
      action: 'UPDATE',
      entityType: 'Product',
      entityId: product.id,
      description: `Updated product “${product.name}”.`,
    })

    revalidateProduct(product.slug)
    return { success: true, data: { id: product.id } }
  } catch (error) {
    return actionError(error, 'Unable to update the product.')
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin()
    const product = await prisma.product.findUnique({
      where: { id },
      select: { name: true, slug: true },
    })

    if (!product) return { success: false, error: 'Product not found.' }

    await prisma.product.delete({ where: { id } })

    await logAdminActivity({
      adminId: session.user.id,
      action: 'DELETE',
      entityType: 'Product',
      entityId: id,
      description: `Deleted product “${product.name}”.`,
    })

    revalidateProduct(product.slug)
    return { success: true }
  } catch (error) {
    return actionError(error, 'Unable to delete the product.')
  }
}

export async function duplicateProduct(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireAdmin()
    const source = await prisma.product.findUnique({
      where: { id },
      include: { media: true, variants: true, collections: true },
    })

    if (!source) return { success: false, error: 'Product not found.' }

    let slug = `${source.slug}-copy`
    let counter = 2
    while (await prisma.product.findUnique({ where: { slug }, select: { id: true } })) {
      slug = `${source.slug}-copy-${counter}`
      counter += 1
    }

    const duplicate = await prisma.product.create({
      data: {
        name: `${source.name} (Copy)`,
        slug,
        shortDescription: source.shortDescription,
        fullDescription: source.fullDescription,
        sku: null,
        categoryId: source.categoryId,
        regularPrice: source.regularPrice,
        discountPrice: source.discountPrice,
        currency: source.currency,
        showPrice: source.showPrice,
        material: source.material,
        colour: source.colour,
        size: source.size,
        weight: source.weight,
        processingTime: source.processingTime,
        deliveryInfo: source.deliveryInfo,
        customAttributes: source.customAttributes ?? undefined,
        status: 'DRAFT',
        availability: source.availability,
        isFeatured: false,
        isNewArrival: false,
        seoTitle: source.seoTitle,
        seoDescription: source.seoDescription,
        seoImage: source.seoImage,
        media: {
          create: source.media.map((item) => ({
            mediaType: item.mediaType,
            sourceType: item.sourceType,
            url: item.url,
            thumbnailUrl: item.thumbnailUrl,
            altText: item.altText,
            caption: item.caption,
            publicId: item.publicId,
            sortOrder: item.sortOrder,
            isPrimary: item.isPrimary,
          })),
        },
        variants: {
          create: source.variants.map((variant) => ({
            name: variant.name,
            value: variant.value,
            priceModifier: variant.priceModifier,
            availability: variant.availability,
            sortOrder: variant.sortOrder,
          })),
        },
        collections: {
          create: source.collections.map((item) => ({
            collectionId: item.collectionId,
            sortOrder: item.sortOrder,
          })),
        },
      },
    })

    await logAdminActivity({
      adminId: session.user.id,
      action: 'DUPLICATE',
      entityType: 'Product',
      entityId: duplicate.id,
      description: `Duplicated “${source.name}” as “${duplicate.name}”.`,
    })

    revalidateProduct(duplicate.slug)
    return { success: true, data: { id: duplicate.id } }
  } catch (error) {
    return actionError(error, 'Unable to duplicate the product.')
  }
}

export async function toggleProductStatus(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin()
    const product = await prisma.product.findUnique({
      where: { id },
      select: { name: true, status: true },
    })

    if (!product) return { success: false, error: 'Product not found.' }

    const status = product.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    await prisma.product.update({ where: { id }, data: { status } })

    await logAdminActivity({
      adminId: session.user.id,
      action: status === 'PUBLISHED' ? 'PUBLISH' : 'UNPUBLISH',
      entityType: 'Product',
      entityId: id,
      description: `${status === 'PUBLISHED' ? 'Published' : 'Unpublished'} “${product.name}”.`,
    })

    revalidateProduct()
    return { success: true }
  } catch (error) {
    return actionError(error, 'Unable to change the product status.')
  }
}

export async function toggleProductFeatured(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin()
    const product = await prisma.product.findUnique({
      where: { id },
      select: { name: true, isFeatured: true },
    })

    if (!product) return { success: false, error: 'Product not found.' }

    await prisma.product.update({
      where: { id },
      data: { isFeatured: !product.isFeatured },
    })

    await logAdminActivity({
      adminId: session.user.id,
      action: product.isFeatured ? 'UNFEATURE' : 'FEATURE',
      entityType: 'Product',
      entityId: id,
      description: `${product.isFeatured ? 'Removed' : 'Added'} “${product.name}” ${
        product.isFeatured ? 'from' : 'to'
      } featured products.`,
    })

    revalidateProduct()
    return { success: true }
  } catch (error) {
    return actionError(error, 'Unable to change the featured status.')
  }
}
