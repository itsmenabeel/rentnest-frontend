import { apiFetch } from "@/lib/api/client"
import type { Paginated } from "@/lib/types/api"
import type { Property } from "@/lib/types/models"
import { toQueryString } from "@/lib/utils/query-string"

export interface PropertyFilters {
  location?: string
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  isAvailable?: boolean
  page?: number
  limit?: number
}

export type PropertiesResponse = Paginated<Property, "properties">

export function getProperties(filters?: PropertyFilters) {
  return apiFetch<PropertiesResponse>(`/api/properties${toQueryString(filters)}`)
}

export function getProperty(id: string) {
  return apiFetch<Property>(`/api/properties/${id}`)
}
