'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { logAdminActivity } from '@/lib/activity'
import { actionError, type ActionResult } from '@/lib/actions/shared'
import {
  businessSettingsSchema,
  type BusinessSettingsInput,
} from '@/lib/validations'

// Settings changes can affect every storefront surface (footer, product
// currency and WhatsApp templates), so refresh the whole tree.
function revalidateStorefront() {
  revalidatePath('/', 'layout')
  revalidatePath('/sitemap.xml')
}

// =============================================================================
// BUSINESS SETTINGS
// =============================================================================

export async function updateBusinessSettings(
  input: BusinessSettingsInput
): Promise<ActionResult> {
  try {
    const session = await requireAdmin()
    const parsed = businessSettingsSchema.safeParse(input)

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? 'Invalid business settings.',
      }
    }

    const data = parsed.data
    const existing = await prisma.businessSettings.findFirst({
      select: { id: true },
    })

    const socialLinks = Object.fromEntries(
      Object.entries(data.socialLinks).filter(([, value]) => Boolean(value))
    )
    const openingHours = Object.fromEntries(
      Object.entries(data.openingHours).filter(([, value]) => Boolean(value))
    )

    const settingsData = {
      businessName: data.businessName,
      tagline: data.tagline,
      whatsappNumber: data.whatsappNumber,
      whatsappMessage: data.whatsappMessage,
      contactPhone: data.contactPhone || null,
      email: data.email || null,
      address: data.address || null,
      currency: data.currency,
      currencySymbol: data.currencySymbol,
      deliveryInfo: data.deliveryInfo || null,
      processingInfo: data.processingInfo || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      socialLinks,
      openingHours,
    }

    if (existing) {
      await prisma.businessSettings.update({
        where: { id: existing.id },
        data: settingsData,
      })
    } else {
      await prisma.businessSettings.create({ data: settingsData })
    }

    await logAdminActivity({
      adminId: session.user.id,
      action: 'UPDATE',
      entityType: 'BusinessSettings',
      entityId: existing?.id ?? null,
      description: 'Updated business settings and WhatsApp ordering details.',
    })

    revalidatePath('/admin/settings')
    revalidateStorefront()
    return { success: true }
  } catch (error) {
    return actionError(error, 'Unable to update the business settings.')
  }
}
