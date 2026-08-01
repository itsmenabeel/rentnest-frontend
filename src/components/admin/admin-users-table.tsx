"use client"

import { useCallback, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { Users } from "lucide-react"

import {
  getUsers,
  updateUserStatus,
  type AdminUserFilters,
  type AdminUsersResponse,
} from "@/lib/api/admin-users"
import { handleApiError } from "@/lib/api/error"
import { showSuccess } from "@/lib/utils/toast"
import { qk } from "@/lib/query/keys"
import type { Role, UserStatus } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/common/empty-state"
import { PaginationControl } from "@/components/common/pagination-control"
import { AdminUserRow } from "@/components/admin/admin-user-row"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const ROLE_OPTIONS: { value: Role | "all"; label: string }[] = [
  { value: "all", label: "All roles" },
  { value: "TENANT", label: "Tenant" },
  { value: "LANDLORD", label: "Landlord" },
  { value: "ADMIN", label: "Admin" },
]

const STATUS_OPTIONS: { value: UserStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "BANNED", label: "Banned" },
]

export function AdminUsersTable({
  initialData,
  initialFilters,
}: {
  initialData: AdminUsersResponse
  initialFilters: AdminUserFilters
}) {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<AdminUserFilters>(initialFilters)

  const isInitialFilters =
    JSON.stringify(filters) === JSON.stringify(initialFilters)
  const queryKey = qk.adminUsers(filters)

  const { data, isFetching } = useQuery({
    queryKey,
    queryFn: () => getUsers(filters),
    initialData: isInitialFilters ? initialData : undefined,
    placeholderData: keepPreviousData,
  })

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      updateUserStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<AdminUsersResponse>(queryKey)

      if (previous) {
        queryClient.setQueryData<AdminUsersResponse>(queryKey, {
          ...previous,
          users: previous.users.map((u) => (u.id === id ? { ...u, status } : u)),
        })
      }

      return { previous }
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
      handleApiError(error)
    },
    onSuccess: (_data, { status }) => {
      showSuccess(status === "BANNED" ? "User banned." : "User unbanned.")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
    },
  })

  const updateFilters = useCallback(
    (next: Partial<AdminUserFilters>) => {
      const merged: AdminUserFilters = {
        ...filters,
        ...next,
        page: next.page ?? 1,
      }
      setFilters(merged)

      const params = new URLSearchParams()
      Object.entries(merged).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== "" &&
          !(key === "page" && value === 1)
        ) {
          params.set(key, String(value))
        }
      })
      router.replace(`${pathname}${params.toString() ? `?${params}` : ""}`, {
        scroll: false,
      })
    },
    [filters, pathname, router]
  )

  const result = data ?? initialData

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Select
          value={filters.role ?? "all"}
          onValueChange={(value) =>
            updateFilters({ role: value === "all" ? undefined : (value as Role) })
          }
        >
          <SelectTrigger aria-label="Filter by role" className="w-40">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status ?? "all"}
          onValueChange={(value) =>
            updateFilters({
              status: value === "all" ? undefined : (value as UserStatus),
            })
          }
        >
          <SelectTrigger aria-label="Filter by status" className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        className={cn(
          "flex flex-col gap-4 transition-opacity duration-200",
          isFetching && "opacity-60"
        )}
      >
        {result.users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="Try a different filter."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.users.map((user) => (
                  <AdminUserRow
                    key={user.id}
                    user={user}
                    onToggleStatus={() =>
                      mutation.mutate({
                        id: user.id,
                        status: user.status === "ACTIVE" ? "BANNED" : "ACTIVE",
                      })
                    }
                    isMutating={
                      mutation.isPending && mutation.variables?.id === user.id
                    }
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <PaginationControl
          page={result.meta.page}
          totalPages={result.meta.totalPages}
          onPageChange={(page) => updateFilters({ page })}
        />
      </div>
    </div>
  )
}
