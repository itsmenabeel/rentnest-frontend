import { serverApiFetch } from "@/lib/api/server"
import { toQueryString } from "@/lib/utils/query-string"
import type { PropertyReviewsResponse } from "@/lib/api/reviews"

export function getPropertyReviewsServer(
  propertyId: string,
  filters?: { page?: number; limit?: number }
) {
  return serverApiFetch<PropertyReviewsResponse>(
    `/api/reviews/property/${propertyId}${toQueryString(filters)}`
  )
}
