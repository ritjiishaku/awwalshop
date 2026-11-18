import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadEnvConfig } from '@next/env'

/**
 * Prisma CLI loads `.env` before a seed script runs. Next.js gives
 * `.env.local` priority, so scripts that use the same database must apply the
 * same file precedence or they will write to a different database than the
 * running app.
 */
export function loadScriptEnv() {
  if (!existsSync(resolve(process.cwd(), '.env.local'))) return

  const { combinedEnv } = loadEnvConfig(process.cwd())
  for (const [key, value] of Object.entries(combinedEnv)) {
    if (value !== undefined) process.env[key] = value
  }
}
