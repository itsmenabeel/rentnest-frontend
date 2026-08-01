import type { Metadata } from "next"

import { getUsersServer } from "@/lib/api/admin-users.server"
import type { AdminUserFilters } from "@/lib/api/admin-users"
import type { Role, UserStatus } from "@/lib/types/models"
import { AdminUsersTable } from "@/components/admin/admin-users-table"

export const metadata: Metadata = {
  title: "Manage users | RentNest",
}

type SearchParams = Record<string, string | string[] | undefined>

const VALID_ROLES: Role[] = ["TENANT", "LANDLORD", "ADMIN"]
const VALID_STATUSES: UserStatus[] = ["ACTIVE", "BANNED"]

function parseFilters(sp: SearchParams): AdminUserFilters {
  const get = (key: string) => {
    const value = sp[key]
    return Array.isArray(value) ? value[0] : value
  }
  const role = get("role")
  const status = get("status")
  const page = get("page")

  return {
    role: role && VALID_ROLES.includes(role as Role) ? (role as Role) : undefined,
    status:
      status && VALID_STATUSES.includes(status as UserStatus)
        ? (status as UserStatus)
        : undefined,
    page: page ? Number(page) : 1,
    limit: 10,
  }
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const filters = parseFilters(await searchParams)
  const users = await getUsersServer(filters)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          {users.meta.total} user{users.meta.total === 1 ? "" : "s"} total.
        </p>
      </div>
      <AdminUsersTable initialData={users} initialFilters={filters} />
    </div>
  )
}
