import { cache } from "react"

import { serverApiFetch } from "@/lib/api/server"
import type { Property } from "@/lib/types/models"
import { toQueryString } from "@/lib/utils/query-string"
import type { PropertiesResponse, PropertyFilters } from "@/lib/api/properties"

export function getPropertiesServer(filters?: PropertyFilters) {
  return serverApiFetch<PropertiesResponse>(
    `/api/properties${toQueryString(filters)}`
  )
}

// Wrapped in React's cache() so generateMetadata and the page component,
// which both need the same property on every request, share one fetch.
export const getPropertyServer = cache((id: string) =>
  serverApiFetch<Property>(`/api/properties/${id}`)
)
