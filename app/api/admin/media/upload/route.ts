import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  isSupabaseStorageConfigured,
  uploadToSupabaseStorage,
} from '@/lib/supabase-storage'

export const maxDuration = 60

const imageTypes: readonly string[] = ALLOWED_IMAGE_TYPES
const videoTypes: readonly string[] = ALLOWED_VIDEO_TYPES

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json(
      { error: 'You must be signed in to upload media.' },
      { status: 401 }
    )
  }

  if (!isSupabaseStorageConfigured()) {
    return NextResponse.json(
      {
        error:
          'Supabase Storage is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your environment, create a public bucket named product-media, then restart the server.',
      },
      { status: 503 }
    )
  }

  let formData: FormData

  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { error: 'The upload could not be read. Please try again.' },
      { status: 400 }
    )
  }

  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'Choose an image or video file to upload.' },
      { status: 400 }
    )
  }

  const isImage = imageTypes.includes(file.type)
  const isVideo = videoTypes.includes(file.type)

  if (!isImage && !isVideo) {
    return NextResponse.json(
      {
        error:
          'Unsupported file type. Upload a JPEG, PNG, WebP, AVIF, GIF, MP4, WebM, MOV or AVI file.',
      },
      { status: 415 }
    )
  }

  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE

  if (file.size > maxSize) {
    return NextResponse.json(
      {
        error: `This file is too large. The maximum ${
          isImage ? 'image' : 'video'
        } size is ${Math.round(maxSize / (1024 * 1024))} MB.`,
      },
      { status: 413 }
    )
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadToSupabaseStorage(buffer, {
      folder: 'products',
      contentType: file.type,
    })

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
      thumbnailUrl: result.thumbnailUrl ?? null,
      mediaType: isImage ? 'IMAGE' : 'VIDEO',
      sourceType: 'UPLOAD',
      originalName: file.name,
    })
  } catch (error) {
    console.error('[media-upload]', error)
    return NextResponse.json(
      { error: 'The upload failed. Please try again in a moment.' },
      { status: 500 }
    )
  }
}
