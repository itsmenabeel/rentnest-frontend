import { apiFetch } from "@/lib/api/client"
import type { Category } from "@/lib/types/models"

export function createCategory(name: string) {
  return apiFetch<Category>("/api/admin/categories", {
    method: "POST",
    body: { name },
  })
}

export function updateCategory(id: string, name: string) {
  return apiFetch<Category>(`/api/admin/categories/${id}`, {
    method: "PUT",
    body: { name },
  })
}

export function deleteCategory(id: string) {
  return apiFetch<void>(`/api/admin/categories/${id}`, {
    method: "DELETE",
  })
}
