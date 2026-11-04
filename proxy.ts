import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// =============================================================================
// AWWALSHOP — Route Proxy (Next.js 16)
// Protects all /admin/* routes except /admin/login
// =============================================================================

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  if (pathname === '/admin/login') {
    if (session) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    if (!session) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}

