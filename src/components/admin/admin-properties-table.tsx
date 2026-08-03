"use client"

import { useCallback, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Building2 } from "lucide-react"

import {
  getAdminProperties,
  type AdminPropertiesResponse,
  type AdminPropertyFilters,
} from "@/lib/api/admin-moderation"
import { qk } from "@/lib/query/keys"
import type { Category } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/common/empty-state"
import { PaginationControl } from "@/components/common/pagination-control"
import { AdminPropertyRow } from "@/components/admin/admin-property-row"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function AdminPropertiesTable({
  initialData,
  initialFilters,
  categories,
}: {
  initialData: AdminPropertiesResponse
  initialFilters: AdminPropertyFilters
  categories: Category[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [filters, setFilters] = useState<AdminPropertyFilters>(initialFilters)

  const isInitialFilters =
    JSON.stringify(filters) === JSON.stringify(initialFilters)

  const { data, isFetching } = useQuery({
    queryKey: qk.adminProperties(filters),
    queryFn: () => getAdminProperties(filters),
    initialData: isInitialFilters ? initialData : undefined,
    placeholderData: keepPreviousData,
  })

  const updateFilters = useCallback(
    (next: Partial<AdminPropertyFilters>) => {
      const merged: AdminPropertyFilters = {
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
          value={filters.categoryId ?? "all"}
          onValueChange={(value) =>
            updateFilters({
              categoryId: value === "all" ? undefined : (value ?? undefined),
            })
          }
          items={{
            all: "All categories",
            ...Object.fromEntries(categories.map((c) => [c.id, c.name])),
          }}
        >
          <SelectTrigger aria-label="Filter by category" className="w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={
            filters.isAvailable === undefined
              ? "all"
              : String(filters.isAvailable)
          }
          onValueChange={(value) =>
            updateFilters({
              isAvailable: value === "all" ? undefined : value === "true",
            })
          }
          items={{ all: "All listings", true: "Available", false: "Unavailable" }}
        >
          <SelectTrigger aria-label="Filter by availability" className="w-44">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All listings</SelectItem>
            <SelectItem value="true">Available</SelectItem>
            <SelectItem value="false">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        className={cn(
          "flex flex-col gap-4 transition-opacity duration-200",
          isFetching && "opacity-60"
        )}
      >
        {result.properties.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No listings found"
            description="Try a different filter."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Landlord</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Listed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.properties.map((property) => (
                  <AdminPropertyRow key={property.id} property={property} />
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
