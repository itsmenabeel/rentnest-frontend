"use client"

import { useCallback, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Inbox } from "lucide-react"

import {
  getAdminRentals,
  type AdminRentalFilters,
  type AdminRentalsResponse,
} from "@/lib/api/admin-moderation"
import { qk } from "@/lib/query/keys"
import type { RentalRequestStatus } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/common/empty-state"
import { PaginationControl } from "@/components/common/pagination-control"
import { AdminRentalRow } from "@/components/admin/admin-rental-row"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const STATUS_OPTIONS: { value: RentalRequestStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
]

export function AdminRentalsTable({
  initialData,
  initialFilters,
}: {
  initialData: AdminRentalsResponse
  initialFilters: AdminRentalFilters
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [filters, setFilters] = useState<AdminRentalFilters>(initialFilters)

  const isInitialFilters =
    JSON.stringify(filters) === JSON.stringify(initialFilters)

  const { data, isFetching } = useQuery({
    queryKey: qk.adminRentals(filters),
    queryFn: () => getAdminRentals(filters),
    initialData: isInitialFilters ? initialData : undefined,
    placeholderData: keepPreviousData,
  })

  const updateFilters = useCallback(
    (next: Partial<AdminRentalFilters>) => {
      const merged: AdminRentalFilters = {
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
      <Select
        value={filters.status ?? "all"}
        onValueChange={(value) =>
          updateFilters({
            status: value === "all" ? undefined : (value as RentalRequestStatus),
          })
        }
      >
        <SelectTrigger className="w-44">
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

      <div
        className={cn(
          "flex flex-col gap-4 transition-opacity duration-200",
          isFetching && "opacity-60"
        )}
      >
        {result.rentals.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No requests found"
            description="Try a different status filter."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Landlord</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.rentals.map((rental) => (
                  <AdminRentalRow key={rental.id} rental={rental} />
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
