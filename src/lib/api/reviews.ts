import { apiFetch } from "@/lib/api/client"
import type { PaginationMeta } from "@/lib/types/api"
import type { Review } from "@/lib/types/models"
import { toQueryString } from "@/lib/utils/query-string"

export interface PropertyReviewsResponse {
  meta: PaginationMeta & { averageRating: number | null }
  reviews: Review[]
}

export function getPropertyReviews(
  propertyId: string,
  filters?: { page?: number; limit?: number }
) {
  return apiFetch<PropertyReviewsResponse>(
    `/api/reviews/property/${propertyId}${toQueryString(filters)}`
  )
}
