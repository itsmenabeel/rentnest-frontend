import { serverApiFetch } from "@/lib/api/server"
import { toQueryString } from "@/lib/utils/query-string"
import type {
  AdminPropertiesResponse,
  AdminPropertyFilters,
  AdminRentalFilters,
  AdminRentalsResponse,
} from "@/lib/api/admin-moderation"

export function getAdminPropertiesServer(filters?: AdminPropertyFilters) {
  return serverApiFetch<AdminPropertiesResponse>(
    `/api/admin/properties${toQueryString(filters)}`
  )
}

export function getAdminRentalsServer(filters?: AdminRentalFilters) {
  return serverApiFetch<AdminRentalsResponse>(
    `/api/admin/rentals${toQueryString(filters)}`
  )
}
