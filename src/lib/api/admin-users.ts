import { apiFetch } from "@/lib/api/client"
import type { Paginated } from "@/lib/types/api"
import type { Role, User, UserStatus } from "@/lib/types/models"
import { toQueryString } from "@/lib/utils/query-string"

export interface AdminUserFilters {
  role?: Role
  status?: UserStatus
  page?: number
  limit?: number
}

export type AdminUsersResponse = Paginated<User, "users">

export function getUsers(filters?: AdminUserFilters) {
  return apiFetch<AdminUsersResponse>(`/api/admin/users${toQueryString(filters)}`)
}

export function updateUserStatus(id: string, status: UserStatus) {
  return apiFetch<User>(`/api/admin/users/${id}`, {
    method: "PATCH",
    body: { status },
  })
}
