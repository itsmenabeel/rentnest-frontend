import { apiFetch } from "@/lib/api/client"
import type { Category } from "@/lib/types/models"

export function getCategories() {
  return apiFetch<Category[]>("/api/categories")
}
