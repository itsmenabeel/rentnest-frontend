import { serverApiFetch } from "@/lib/api/server"
import { toQueryString } from "@/lib/utils/query-string"
import type { AdminUserFilters, AdminUsersResponse } from "@/lib/api/admin-users"

export function getUsersServer(filters?: AdminUserFilters) {
  return serverApiFetch<AdminUsersResponse>(`/api/admin/users${toQueryString(filters)}`)
}
