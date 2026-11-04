export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string }

export function actionError(error: unknown, fallback = 'Something went wrong.'): ActionResult<never> {
  if (error instanceof Error && error.message === 'Unauthorized') {
    return { success: false, error: 'You do not have permission to perform this action.' }
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2002'
  ) {
    return { success: false, error: 'A record with that slug or SKU already exists.' }
  }

  console.error('[admin-action]', error)
  return { success: false, error: fallback }
}
