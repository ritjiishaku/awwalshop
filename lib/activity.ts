import 'server-only'
import { prisma } from '@/lib/db'

interface ActivityInput {
  adminId: string
  action: string
  entityType: string
  entityId?: string | null
  description?: string | null
}

/**
 * Records an administrative mutation. Logging failures are intentionally
 * non-fatal so an audit-trail issue never blocks the underlying change.
 */
export async function logAdminActivity(input: ActivityInput): Promise<void> {
  try {
    await prisma.adminActivity.create({
      data: {
        adminId: input.adminId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        description: input.description ?? null,
      },
    })
  } catch (error) {
    console.error('[admin-activity] Failed to record activity:', error)
  }
}
