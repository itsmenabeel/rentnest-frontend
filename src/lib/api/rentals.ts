import { apiFetch } from "@/lib/api/client"
import type { Paginated } from "@/lib/types/api"
import type { RentalRequest, RentalRequestStatus } from "@/lib/types/models"
import { toQueryString } from "@/lib/utils/query-string"

export interface RentalFilters {
  status?: RentalRequestStatus
  page?: number
  limit?: number
}

export type RentalsResponse = Paginated<RentalRequest, "rentals">

export interface CreateRentalInput {
  propertyId: string
  moveInDate?: string
  message?: string
}

export function createRentalRequest(input: CreateRentalInput) {
  return apiFetch<RentalRequest>("/api/rentals", {
    method: "POST",
    body: input,
  })
}

export function getRentals(filters?: RentalFilters) {
  return apiFetch<RentalsResponse>(`/api/rentals${toQueryString(filters)}`)
}

export function getRental(id: string) {
  return apiFetch<RentalRequest>(`/api/rentals/${id}`)
}
