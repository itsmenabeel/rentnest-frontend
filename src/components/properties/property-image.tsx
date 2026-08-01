import Image from "next/image"
import { ImageOff } from "lucide-react"

import { cn } from "@/lib/utils"

export function PropertyImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority,
}: {
  src?: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-photo-label"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, var(--placeholder-light), var(--placeholder-light) 10px, var(--placeholder-dark) 10px, var(--placeholder-dark) 20px)",
          }}
        >
          <ImageOff className="size-5" />
          <span className="font-mono text-[11px]">no photo yet</span>
        </div>
      )}
    </div>
  )
}
