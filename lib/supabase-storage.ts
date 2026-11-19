import 'server-only'
import { randomUUID } from 'node:crypto'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
] as const

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
] as const

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024

const DEFAULT_BUCKET = 'product-media'

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'video/x-msvideo': 'avi',
}

interface StorageConfig {
  url: string
  serviceRoleKey: string
  bucket: string
}

function hasValue(value: string | undefined): value is string {
  return Boolean(value) && !/your-|replace|example|<|>/i.test(value as string)
}

function readConfig(): StorageConfig {
  return {
    url: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    bucket: process.env.SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET,
  }
}

/**
 * Uploads are optional in local development. When credentials are missing (or
 * still set to template placeholders), the upload endpoint returns a clear
 * configuration error instead of a generic 500.
 */
export function isSupabaseStorageConfigured(): boolean {
  const { url, serviceRoleKey } = readConfig()
  return hasValue(url) && hasValue(serviceRoleKey)
}

let client: SupabaseClient | null = null

function getClient(config: StorageConfig): SupabaseClient {
  if (!client) {
    client = createClient(config.url, config.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
  }

  return client
}

function requireConfig(): StorageConfig {
  const config = readConfig()

  if (!hasValue(config.url) || !hasValue(config.serviceRoleKey)) {
    throw new Error(
      'Supabase Storage is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your environment, then restart the server.'
    )
  }

  return config
}

function objectPath(folder: string, contentType: string): string {
  const cleanFolder = folder.replace(/^\/+|\/+$/g, '') || 'products'
  const extension = EXTENSIONS[contentType] ?? 'bin'

  return `${cleanFolder}/${randomUUID()}.${extension}`
}

export async function uploadToSupabaseStorage(
  buffer: Buffer,
  options: {
    contentType: string
    folder?: string
    cacheControl?: string
  }
): Promise<{ url: string; publicId: string; thumbnailUrl?: string }> {
  const config = requireConfig()
  const path = objectPath(options.folder ?? 'products', options.contentType)
  const storage = getClient(config).storage.from(config.bucket)

  const { error } = await storage.upload(path, buffer, {
    contentType: options.contentType,
    cacheControl: options.cacheControl ?? '31536000',
    upsert: false,
  })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = storage.getPublicUrl(path)

  // Transformations are a Pro+ feature, so only store a transformed thumbnail
  // URL when the project explicitly opts in.
  const thumbnailUrl =
    options.contentType.startsWith('image/') &&
    process.env.SUPABASE_IMAGE_TRANSFORMATIONS === 'true'
      ? storage.getPublicUrl(path, {
          transform: { width: 400, height: 400, resize: 'cover', quality: 75 },
        }).data.publicUrl
      : undefined

  return {
    url: data.publicUrl,
    publicId: path,
    thumbnailUrl,
  }
}

export async function deleteFromSupabaseStorage(publicId: string): Promise<void> {
  const config = requireConfig()
  const { error } = await getClient(config).storage.from(config.bucket).remove([publicId])

  if (error) {
    throw new Error(error.message)
  }
}
