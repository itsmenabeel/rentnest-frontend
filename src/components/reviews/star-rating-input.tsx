"use client"

import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

export function StarRatingInput({
  value,
  onChange,
  disabled,
}: {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}) {
  return (
    <div role="radiogroup" aria-label="Rating" className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const rating = i + 1
        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={rating === value}
            disabled={disabled}
            onClick={() => onChange(rating)}
            aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
            className="disabled:pointer-events-none disabled:opacity-50"
          >
            <Star
              className={cn(
                "size-6 transition-colors",
                rating <= value ? "fill-price text-price" : "text-border"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
