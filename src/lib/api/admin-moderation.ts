import { apiFetch } from "@/lib/api/client"
import type { Paginated } from "@/lib/types/api"
import type { Property, RentalRequest, RentalRequestStatus } from "@/lib/types/models"
import { toQueryString } from "@/lib/utils/query-string"

export interface AdminPropertyFilters {
  categoryId?: string
  isAvailable?: boolean
  page?: number
  limit?: number
}

export type AdminPropertiesResponse = Paginated<Property, "properties">

export function getAdminProperties(filters?: AdminPropertyFilters) {
  return apiFetch<AdminPropertiesResponse>(
    `/api/admin/properties${toQueryString(filters)}`
  )
}

export interface AdminRentalFilters {
  status?: RentalRequestStatus
  page?: number
  limit?: number
}

export type AdminRentalsResponse = Paginated<RentalRequest, "rentals">

export function getAdminRentals(filters?: AdminRentalFilters) {
  return apiFetch<AdminRentalsResponse>(`/api/admin/rentals${toQueryString(filters)}`)
}
