import { apiFetch } from "@/lib/api/client"
import type { RentalsResponse } from "@/lib/api/rentals"
import type { RentalRequest, RentalRequestStatus } from "@/lib/types/models"
import { toQueryString } from "@/lib/utils/query-string"

export interface LandlordRequestFilters {
  status?: RentalRequestStatus
  page?: number
  limit?: number
}

export function getLandlordRequests(filters?: LandlordRequestFilters) {
  return apiFetch<RentalsResponse>(
    `/api/landlord/requests${toQueryString(filters)}`
  )
}

export function updateRentalStatus(
  id: string,
  status: Extract<RentalRequestStatus, "APPROVED" | "REJECTED" | "COMPLETED">
) {
  return apiFetch<RentalRequest>(`/api/landlord/requests/${id}`, {
    method: "PATCH",
    body: { status },
  })
}
