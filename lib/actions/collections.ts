'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { logAdminActivity } from '@/lib/activity'
import { actionError, type ActionResult } from '@/lib/actions/shared'
import { createCollectionSchema, type CollectionInput } from '@/lib/validations'

function revalidateCollections() {
  revalidatePath('/admin/collections')
  revalidatePath('/admin/products')
  revalidatePath('/admin')
  revalidatePath('/shop')
  revalidatePath('/collections')
  revalidatePath('/')
  revalidatePath('/sitemap.xml')
}

export async function createCollection(
  input: CollectionInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireAdmin()
    const parsed = createCollectionSchema.safeParse(input)

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid collection data.' }
    }

    const data = parsed.data
    const collection = await prisma.collection.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        bannerUrl: data.bannerUrl || null,
        isVisible: data.isVisible,
        sortOrder: data.sortOrder,
      },
    })

    await logAdminActivity({
      adminId: session.user.id,
      action: 'CREATE',
      entityType: 'Collection',
      entityId: collection.id,
      description: `Created collection “${collection.name}”.`,
    })

    revalidateCollections()
    return { success: true, data: { id: collection.id } }
  } catch (error) {
    return actionError(error, 'Unable to create the collection.')
  }
}

export async function updateCollection(
  id: string,
  input: CollectionInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireAdmin()
    const parsed = createCollectionSchema.safeParse(input)

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid collection data.' }
    }

    const data = parsed.data
    const collection = await prisma.collection.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        bannerUrl: data.bannerUrl || null,
        isVisible: data.isVisible,
        sortOrder: data.sortOrder,
      },
    })

    await logAdminActivity({
      adminId: session.user.id,
      action: 'UPDATE',
      entityType: 'Collection',
      entityId: collection.id,
      description: `Updated collection “${collection.name}”.`,
    })

    revalidateCollections()
    return { success: true, data: { id: collection.id } }
  } catch (error) {
    return actionError(error, 'Unable to update the collection.')
  }
}

export async function deleteCollection(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin()
    const collection = await prisma.collection.findUnique({
      where: { id },
      select: { name: true },
    })

    if (!collection) return { success: false, error: 'Collection not found.' }

    await prisma.collection.delete({ where: { id } })

    await logAdminActivity({
      adminId: session.user.id,
      action: 'DELETE',
      entityType: 'Collection',
      entityId: id,
      description: `Deleted collection “${collection.name}”.`,
    })

    revalidateCollections()
    return { success: true }
  } catch (error) {
    return actionError(error, 'Unable to delete the collection.')
  }
}

export async function toggleCollectionVisibility(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin()
    const collection = await prisma.collection.findUnique({
      where: { id },
      select: { name: true, isVisible: true },
    })

    if (!collection) return { success: false, error: 'Collection not found.' }

    await prisma.collection.update({
      where: { id },
      data: { isVisible: !collection.isVisible },
    })

    await logAdminActivity({
      adminId: session.user.id,
      action: collection.isVisible ? 'HIDE' : 'SHOW',
      entityType: 'Collection',
      entityId: id,
      description: `${collection.isVisible ? 'Hid' : 'Showed'} collection “${collection.name}”.`,
    })

    revalidateCollections()
    return { success: true }
  } catch (error) {
    return actionError(error, 'Unable to change collection visibility.')
  }
}
