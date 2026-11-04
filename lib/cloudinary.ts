import 'server-only'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

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

/**
 * Cloudinary credentials are optional in local development. When they are
 * absent (or still set to the template placeholders), the upload endpoint
 * returns a clear configuration error instead of a generic 500.
 */
export function isCloudinaryConfigured(): boolean {
  const values = [
    process.env.CLOUDINARY_CLOUD_NAME,
    process.env.CLOUDINARY_API_KEY,
    process.env.CLOUDINARY_API_SECRET,
  ]

  return values.every(
    (value) => Boolean(value) && !/your-|replace|example/i.test(value as string)
  )
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string
    resourceType?: 'image' | 'video' | 'raw' | 'auto'
    publicId?: string
  } = {}
): Promise<{ url: string; publicId: string; thumbnailUrl?: string }> {
  const { folder = 'awwalshop/products', resourceType = 'auto', publicId } = options

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: publicId,
        ...(resourceType === 'image' && {
          fetch_format: 'auto',
          quality: 'auto',
        }),
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'))
          return
        }

        const thumbnailUrl =
          result.resource_type === 'video'
            ? cloudinary.url(result.public_id, {
                resource_type: 'video',
                format: 'jpg',
                transformation: [{ width: 400, height: 400, crop: 'fill' }],
              })
            : undefined

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          thumbnailUrl,
        })
      }
    )

    uploadStream.end(buffer)
  })
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' = 'image'
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}

