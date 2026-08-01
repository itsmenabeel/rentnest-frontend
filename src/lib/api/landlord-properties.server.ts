import { serverApiFetch } from "@/lib/api/server"
import { toQueryString } from "@/lib/utils/query-string"
import type {
  LandlordPropertiesResponse,
  LandlordPropertyFilters,
} from "@/lib/api/landlord-properties"

export function getLandlordPropertiesServer(filters?: LandlordPropertyFilters) {
  return serverApiFetch<LandlordPropertiesResponse>(
    `/api/landlord/properties${toQueryString(filters)}`
  )
}
