'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { logAdminActivity } from '@/lib/activity'
import { actionError, type ActionResult } from '@/lib/actions/shared'
import { createCategorySchema, type CategoryInput } from '@/lib/validations'

function revalidateCategories() {
  revalidatePath('/admin/categories')
  revalidatePath('/admin/products')
  revalidatePath('/admin')
  revalidatePath('/shop')
  revalidatePath('/')
  revalidatePath('/sitemap.xml')
}

async function createsCycle(categoryId: string, parentId: string): Promise<boolean> {
  if (categoryId === parentId) return true

  const categories = await prisma.category.findMany({ select: { id: true, parentId: true } })
  const parentById = new Map(categories.map((category) => [category.id, category.parentId]))

  let current: string | null | undefined = parentId
  const visited = new Set<string>()

  while (current) {
    if (current === categoryId) return true
    if (visited.has(current)) return true
    visited.add(current)
    current = parentById.get(current) ?? null
  }

  return false
}

export async function createCategory(
  input: CategoryInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireAdmin()
    const parsed = createCategorySchema.safeParse(input)

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid category data.' }
    }

    const data = parsed.data
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        parentId: data.parentId || null,
        sortOrder: data.sortOrder,
        isVisible: data.isVisible,
      },
    })

    await logAdminActivity({
      adminId: session.user.id,
      action: 'CREATE',
      entityType: 'Category',
      entityId: category.id,
      description: `Created category “${category.name}”.`,
    })

    revalidateCategories()
    return { success: true, data: { id: category.id } }
  } catch (error) {
    return actionError(error, 'Unable to create the category.')
  }
}

export async function updateCategory(
  id: string,
  input: CategoryInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireAdmin()
    const parsed = createCategorySchema.safeParse(input)

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid category data.' }
    }

    const data = parsed.data
    if (data.parentId && (await createsCycle(id, data.parentId))) {
      return { success: false, error: 'A category cannot be nested inside itself or its descendants.' }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        parentId: data.parentId || null,
        sortOrder: data.sortOrder,
        isVisible: data.isVisible,
      },
    })

    await logAdminActivity({
      adminId: session.user.id,
      action: 'UPDATE',
      entityType: 'Category',
      entityId: category.id,
      description: `Updated category “${category.name}”.`,
    })

    revalidateCategories()
    return { success: true, data: { id: category.id } }
  } catch (error) {
    return actionError(error, 'Unable to update the category.')
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin()
    const category = await prisma.category.findUnique({
      where: { id },
      select: { name: true },
    })

    if (!category) return { success: false, error: 'Category not found.' }

    await prisma.category.delete({ where: { id } })

    await logAdminActivity({
      adminId: session.user.id,
      action: 'DELETE',
      entityType: 'Category',
      entityId: id,
      description: `Deleted category “${category.name}”.`,
    })

    revalidateCategories()
    return { success: true }
  } catch (error) {
    return actionError(error, 'Unable to delete the category.')
  }
}

export async function toggleCategoryVisibility(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin()
    const category = await prisma.category.findUnique({
      where: { id },
      select: { name: true, isVisible: true },
    })

    if (!category) return { success: false, error: 'Category not found.' }

    await prisma.category.update({
      where: { id },
      data: { isVisible: !category.isVisible },
    })

    await logAdminActivity({
      adminId: session.user.id,
      action: category.isVisible ? 'HIDE' : 'SHOW',
      entityType: 'Category',
      entityId: id,
      description: `${category.isVisible ? 'Hid' : 'Showed'} category “${category.name}”.`,
    })

    revalidateCategories()
    return { success: true }
  } catch (error) {
    return actionError(error, 'Unable to change category visibility.')
  }
}
