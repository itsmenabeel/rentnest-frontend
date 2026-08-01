import { serverApiFetch } from "@/lib/api/server"
import type { Category } from "@/lib/types/models"

export function getCategoriesServer() {
  return serverApiFetch<Category[]>("/api/categories")
}
