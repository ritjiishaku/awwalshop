const FALLBACK_URL = '/admin'
const LOGIN_PATH = '/admin/login'

/**
 * Resolve an admin post-login destination without allowing an open redirect.
 * Only local admin paths are accepted, and the login page itself is excluded
 * so a crafted link cannot trap an admin in a redirect loop.
 */
export function safeAdminCallbackUrl(
  raw?: string | null,
  fallbackUrl: string = FALLBACK_URL
) {
  if (!raw) return fallbackUrl

  try {
    const url = new URL(raw, 'https://awwalshop.local')

    if (url.origin !== 'https://awwalshop.local') return fallbackUrl

    const pathname = url.pathname.replace(/\/+$/, '') || '/'
    const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/')
    if (!isAdminPath || pathname === LOGIN_PATH) return fallbackUrl

    return `${url.pathname}${url.search}${url.hash}` || fallbackUrl
  } catch {
    return fallbackUrl
  }
}
