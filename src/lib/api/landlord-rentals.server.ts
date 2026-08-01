import { serverApiFetch } from "@/lib/api/server"
import type { RentalsResponse } from "@/lib/api/rentals"
import { toQueryString } from "@/lib/utils/query-string"
import type { LandlordRequestFilters } from "@/lib/api/landlord-rentals"

export function getLandlordRequestsServer(filters?: LandlordRequestFilters) {
  return serverApiFetch<RentalsResponse>(
    `/api/landlord/requests${toQueryString(filters)}`
  )
}
