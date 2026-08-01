import { serverApiFetch } from "@/lib/api/server"
import { toQueryString } from "@/lib/utils/query-string"
import type { RentalFilters, RentalsResponse } from "@/lib/api/rentals"
import type { RentalRequest } from "@/lib/types/models"

export function getRentalsServer(filters?: RentalFilters) {
  return serverApiFetch<RentalsResponse>(`/api/rentals${toQueryString(filters)}`)
}

export function getRentalServer(id: string) {
  return serverApiFetch<RentalRequest>(`/api/rentals/${id}`)
}
