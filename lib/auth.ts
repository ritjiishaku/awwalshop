import 'server-only'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const loginSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const adminEmail = (process.env.ADMIN_EMAIL || 'admin@awwalshop.com').toLowerCase()

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

        const admin = await prisma.adminUser.findUnique({
          where: { email: adminEmail },
        })

        if (!admin) return null

        const passwordMatch = await bcrypt.compare(password, admin.passwordHash)
        if (!passwordMatch) return null

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
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
