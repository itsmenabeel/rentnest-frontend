import { apiFetch } from "@/lib/api/client"
import type { Paginated } from "@/lib/types/api"
import type { Property } from "@/lib/types/models"
import type { PropertyFormValues } from "@/lib/validation/property.schema"
import { toQueryString } from "@/lib/utils/query-string"

export interface LandlordPropertyFilters {
  categoryId?: string
  isAvailable?: boolean
  page?: number
  limit?: number
}

export type LandlordPropertiesResponse = Paginated<Property, "properties">

/** Builds the multipart body the backend's `upload.array('images', 8)` +
 * createPropertySchema/updatePropertySchema expect. On edit, `keptImageUrls`
 * is always sent (even empty) so the saved set always matches what the form
 * shows — never relies on the backend's "no images field = merge" fallback. */
function buildPropertyFormData(
  values: PropertyFormValues,
  files: File[],
  keptImageUrls?: string[]
) {
  const formData = new FormData()
  formData.append("title", values.title)
  formData.append("description", values.description)
  formData.append("location", values.location)
  formData.append("price", String(values.price))
  formData.append("categoryId", values.categoryId)
  formData.append("isAvailable", String(values.isAvailable))
  if (values.amenities) formData.append("amenities", values.amenities)
  if (keptImageUrls !== undefined) {
    formData.append("images", JSON.stringify(keptImageUrls))
  }
  files.forEach((file) => formData.append("images", file))
  return formData
}

export function createLandlordProperty(
  values: PropertyFormValues,
  files: File[]
) {
  return apiFetch<Property>("/api/landlord/properties", {
    method: "POST",
    body: buildPropertyFormData(values, files),
  })
}

export function updateLandlordProperty(
  id: string,
  values: PropertyFormValues,
  files: File[],
  keptImageUrls: string[]
) {
  return apiFetch<Property>(`/api/landlord/properties/${id}`, {
    method: "PUT",
    body: buildPropertyFormData(values, files, keptImageUrls),
  })
}

export function deleteLandlordProperty(id: string) {
  return apiFetch<undefined>(`/api/landlord/properties/${id}`, {
    method: "DELETE",
  })
}

export function getLandlordProperties(filters?: LandlordPropertyFilters) {
  return apiFetch<LandlordPropertiesResponse>(
    `/api/landlord/properties${toQueryString(filters)}`
  )
}
