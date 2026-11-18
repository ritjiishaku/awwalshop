import 'server-only'
import { timingSafeEqual } from 'node:crypto'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { AdminRole } from '@prisma/client'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const loginSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const adminEmail = (process.env.ADMIN_EMAIL || 'admin@awwalshop.com').toLowerCase()
const adminName = 'Awwalshop Administrator'
const configuredPassword = process.env.ADMIN_PASSWORD

/**
 * The environment variable is the source of truth for this single-admin
 * catalogue. Compare in constant time so the login endpoint does not leak
 * information about the configured password through response timings.
 */
function matchesConfiguredPassword(candidate: string) {
  if (!configuredPassword) return false

  const supplied = Buffer.from(candidate, 'utf8')
  const expected = Buffer.from(configuredPassword, 'utf8')
  return supplied.length === expected.length && timingSafeEqual(supplied, expected)
}

function sessionUser(admin: {
  id: string
  name: string | null
  email: string
  role: string
}) {
  return {
    id: admin.id,
    name: admin.name ?? adminName,
    email: admin.email,
    role: admin.role,
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { password } = parsed.data

        let admin: {
          id: string
          name: string | null
          email: string
          role: string
          passwordHash: string
        } | null = null
        let databaseAvailable = true

        try {
          admin = await prisma.adminUser.findUnique({
            where: { email: adminEmail },
          })
        } catch (error) {
          databaseAvailable = false
          console.error('[auth] Could not load the admin account:', error)
        }

        if (admin) {
          try {
            if (await bcrypt.compare(password, admin.passwordHash)) {
              return sessionUser(admin)
            }
          } catch (error) {
            console.error('[auth] Could not verify the admin password hash:', error)
          }
        }

        if (!matchesConfiguredPassword(password)) return null

        // A correct ADMIN_PASSWORD still grants access when the stored hash is
        // stale (for example, after the env value changed without reseeding).
        if (!databaseAvailable || !admin) {
          return {
            id: admin?.id ?? 'env-admin',
            name: admin?.name ?? adminName,
            email: adminEmail,
            role: AdminRole.SUPER_ADMIN,
          }
        }

        try {
          const passwordHash = await bcrypt.hash(configuredPassword!, 12)
          const synced = await prisma.adminUser.update({
            where: { id: admin.id },
            data: { passwordHash, role: AdminRole.SUPER_ADMIN },
          })
          return sessionUser(synced)
        } catch (error) {
          console.error('[auth] Signed in, but could not refresh the admin hash:', error)
          return sessionUser(admin)
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    // Keep the admin signed in for a week so routine catalogue edits do not
    // require a password every day. Sign out still ends the session immediately.
    maxAge: 7 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        ;(session.user as { role?: string }).role = token.role as string
      }
      return session
    },
  },

  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
})

export interface AdminSession {
  user: {
    id: string
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: (session.user as { role?: string }).role,
    },
  }
}
