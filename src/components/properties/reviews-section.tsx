import { Star } from "lucide-react"

import type { Review } from "@/lib/types/models"
import { formatDate } from "@/lib/utils/format-date"
import { cn } from "@/lib/utils"

export function ReviewsSection({
  reviews,
  averageRating,
  total,
}: {
  reviews: Review[]
  averageRating: number | null
  total: number
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h2 className="font-heading text-lg font-semibold">Reviews</h2>
        {averageRating !== null && (
          <span className="flex items-center gap-1 text-sm font-medium text-foreground">
            <Star className="size-4 fill-price text-price" />
            {averageRating.toFixed(1)}
            <span className="text-muted-foreground">({total})</span>
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          This property has no reviews yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-lg border border-border p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {review.tenant.name}
                </p>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-3.5",
                        i < review.rating
                          ? "fill-price text-price"
                          : "text-border"
                      )}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {review.comment}
                </p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {formatDate(review.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
