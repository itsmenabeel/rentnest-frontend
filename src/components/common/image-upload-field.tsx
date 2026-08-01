"use client"

import { useEffect, useRef, useState } from "react"
import { ImagePlus, X } from "lucide-react"

import { showError } from "@/lib/utils/toast"

const MAX_FILES = 8
const MAX_SIZE_MB = 5

export function ImageUploadField({
  files,
  onFilesChange,
  existingImages = [],
  onExistingImagesChange,
}: {
  files: File[]
  onFilesChange: (files: File[]) => void
  existingImages?: string[]
  onExistingImagesChange?: (images: string[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const totalCount = files.length + existingImages.length

  function handleSelect(selected: FileList | null) {
    if (!selected) return
    const incoming = Array.from(selected)
    const accepted: File[] = []

    for (const file of incoming) {
      if (!file.type.startsWith("image/")) {
        showError(`${file.name} isn't an image.`)
        continue
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        showError(`${file.name} is larger than ${MAX_SIZE_MB}MB.`)
        continue
      }
      accepted.push(file)
    }

    const room = MAX_FILES - totalCount
    if (accepted.length > room) {
      showError(`You can upload up to ${MAX_FILES} photos total.`)
    }

    onFilesChange([...files, ...accepted.slice(0, Math.max(room, 0))])
  }

  function removeNewFile(index: number) {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  function removeExisting(url: string) {
    onExistingImagesChange?.(existingImages.filter((u) => u !== url))
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {existingImages.map((url) => (
          <div
            key={url}
            className="relative size-20 flex-none overflow-hidden rounded-lg border border-border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary Cloudinary URL in a small fixed-size thumbnail, not worth next/image here */}
            <img src={url} alt="" className="size-full object-cover" />
            <button
              type="button"
              onClick={() => removeExisting(url)}
              aria-label="Remove image"
              className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}

        {files.map((file, index) => (
          <NewImageThumb
            key={`${file.name}-${file.lastModified}-${index}`}
            file={file}
            onRemove={() => removeNewFile(index)}
          />
        ))}

        {totalCount < MAX_FILES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex size-20 flex-none flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ImagePlus className="size-5" />
            <span className="text-[11px] font-medium">Add</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleSelect(e.target.files)
          e.target.value = ""
        }}
      />
      <p className="text-xs text-muted-foreground">
        Up to {MAX_FILES} photos, {MAX_SIZE_MB}MB each.
      </p>
    </div>
  )
}

function NewImageThumb({
  file,
  onRemove,
}: {
  file: File
  onRemove: () => void
}) {
  const [url] = useState(() => URL.createObjectURL(file))

  useEffect(() => {
    return () => URL.revokeObjectURL(url)
  }, [url])

  return (
    <div className="relative size-20 flex-none overflow-hidden rounded-lg border border-border">
      {/* eslint-disable-next-line @next/next/no-img-element -- blob: object URL for a local file preview; next/image can't optimize these */}
      <img src={url} alt="" className="size-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove image"
        className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
      >
        <X className="size-3" />
      </button>
    </div>
  )
}
