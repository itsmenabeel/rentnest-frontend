"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { PropertyImage } from "@/components/properties/property-image"

export function PropertyGallery({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col gap-3">
      <PropertyImage
        src={images[active]}
        alt={`${title} photo ${active + 1}`}
        className="aspect-[16/10] w-full rounded-xl"
        priority
      />
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative size-16 flex-none overflow-hidden rounded-lg border-2 transition-colors duration-150",
                i === active ? "border-primary" : "border-transparent"
              )}
            >
              <PropertyImage src={src} alt="" className="size-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
