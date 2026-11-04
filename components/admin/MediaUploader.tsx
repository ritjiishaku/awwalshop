'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle2, Loader2, UploadCloud, XCircle } from 'lucide-react'

export interface UploadedMedia {
  url: string
  publicId: string
  thumbnailUrl: string | null
  mediaType: 'IMAGE' | 'VIDEO'
  sourceType: 'UPLOAD'
  originalName: string
}

interface MediaUploaderProps {
  onUploaded: (media: UploadedMedia) => void
  accept?: string
}

const DEFAULT_ACCEPT =
  'image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm,video/quicktime,video/x-msvideo'

interface UploadState {
  name: string
  progress: number
  status: 'uploading' | 'done' | 'error'
  message?: string
}

export default function MediaUploader({
  onUploaded,
  accept = DEFAULT_ACCEPT,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploads, setUploads] = useState<UploadState[]>([])

  const uploadFile = (file: File) =>
    new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()
      formData.append('file', file)

      setUploads((current) => [
        ...current,
        { name: file.name, progress: 0, status: 'uploading' },
      ])

      const update = (patch: Partial<UploadState>) => {
        setUploads((current) =>
          current.map((item) =>
            item.name === file.name && item.status === 'uploading'
              ? { ...item, ...patch }
              : item
          )
        )
      }

      xhr.open('POST', '/api/admin/media/upload')

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return
        update({ progress: Math.round((event.loaded / event.total) * 100) })
      }

      xhr.onload = () => {
        let payload: UploadedMedia & { error?: string }

        try {
          payload = JSON.parse(xhr.responseText)
        } catch {
          update({ status: 'error', message: 'Unexpected server response.' })
          resolve()
          return
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          update({ status: 'done', progress: 100 })
          onUploaded(payload)
          toast.success(`${file.name} uploaded.`)
        } else {
          update({
            status: 'error',
            message: payload.error || 'Upload failed.',
          })
          toast.error(payload.error || 'Upload failed.')
        }

        resolve()
      }

      xhr.onerror = () => {
        update({ status: 'error', message: 'Network error during upload.' })
        toast.error('Network error during upload.')
        resolve()
      }

      xhr.send(formData)
    })

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    for (const file of Array.from(files)) {
      await uploadFile(file)
    }

    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          void handleFiles(event.dataTransfer.files)
        }}
        className={`flex flex-col items-center justify-center gap-2 border border-dashed px-6 py-8 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-gold bg-gold/10'
            : 'border-line bg-[#faf7f1] hover:border-gold'
        }`}
      >
        <UploadCloud size={22} className="text-gold" />
        <p className="text-sm text-espresso font-medium">
          Drag &amp; drop media here, or click to browse
        </p>
        <p className="text-[11px] text-taupe">
          Images up to 10 MB · Videos up to 100 MB · JPEG, PNG, WebP, AVIF, GIF, MP4, WebM, MOV
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="sr-only"
          onChange={(event) => void handleFiles(event.target.files)}
        />
      </div>

      {uploads.length > 0 && (
        <ul className="space-y-2">
          {uploads.map((upload) => (
            <li
              key={`${upload.name}-${upload.status}`}
              className="flex items-center gap-3 rounded-lg border border-line bg-white px-3 py-2"
            >
              {upload.status === 'uploading' && (
                <Loader2 size={14} className="text-gold animate-spin shrink-0" />
              )}
              {upload.status === 'done' && (
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              )}
              {upload.status === 'error' && (
                <XCircle size={14} className="text-rose-600 shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-espresso truncate">{upload.name}</span>
                  <span className="text-[10px] text-taupe shrink-0">
                    {upload.status === 'uploading'
                      ? `${upload.progress}%`
                      : upload.status === 'done'
                        ? 'Complete'
                        : 'Failed'}
                  </span>
                </div>

                {upload.status === 'uploading' && (
                  <div className="mt-1 h-1 w-full bg-[#E8DED0] overflow-hidden">
                    <div
                      className="h-full bg-gold transition-all"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                )}

                {upload.message && (
                  <p className="text-[10px] text-rose-700 mt-1">{upload.message}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
