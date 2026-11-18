/**
 * Reset the single admin password without changing the catalogue data.
 *
 * Usage: npm run admin:password
 * The password is read from ADMIN_PASSWORD using the same env precedence as
 * Next.js (`.env.local` overrides `.env`).
 */
import { AdminRole, PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { loadScriptEnv } from './load-script-env'

loadScriptEnv()

const prisma = new PrismaClient()

async function main() {
  const email = (process.env.ADMIN_EMAIL || 'admin@awwalshop.com').toLowerCase()
  const password = process.env.ADMIN_PASSWORD

  if (!password) {
    throw new Error('ADMIN_PASSWORD must be set before resetting the admin password.')
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, role: AdminRole.SUPER_ADMIN },
    create: {
      name: 'Awwalshop Administrator',
      email,
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
    },
  })

  console.log(`✓ Admin password updated for ${admin.email}`)
  console.log('  Use the value of ADMIN_PASSWORD to sign in at /admin/login.')
}

main()
  .catch((error) => {
    console.error('\n✗ Could not reset the admin password:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
