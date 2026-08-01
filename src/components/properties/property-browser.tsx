"use client"

import { useCallback, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { SearchX } from "lucide-react"

import {
  getProperties,
  type PropertiesResponse,
  type PropertyFilters,
} from "@/lib/api/properties"
import { qk } from "@/lib/query/keys"
import type { Category } from "@/lib/types/models"
import { PaginationControl } from "@/components/common/pagination-control"
import { EmptyState } from "@/components/common/empty-state"
import { PropertyFiltersBar } from "@/components/properties/property-filters"
import { PropertyGrid } from "@/components/properties/property-grid"
import { cn } from "@/lib/utils"

export function PropertyBrowser({
  initialData,
  initialFilters,
  categories,
}: {
  initialData: PropertiesResponse
  initialFilters: PropertyFilters
  categories: Category[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters)

  const isInitialFilters =
    JSON.stringify(filters) === JSON.stringify(initialFilters)

  const { data, isFetching } = useQuery({
    queryKey: qk.properties(filters),
    queryFn: () => getProperties(filters),
    initialData: isInitialFilters ? initialData : undefined,
    placeholderData: keepPreviousData,
  })

  const updateFilters = useCallback(
    (next: Partial<PropertyFilters>) => {
      const merged: PropertyFilters = {
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
      router.replace(
        `${pathname}${params.toString() ? `?${params}` : ""}`,
        { scroll: false }
      )
    },
    [filters, pathname, router]
  )

  const result = data ?? initialData

  return (
    <div className="flex flex-col gap-6">
      <PropertyFiltersBar
        categories={categories}
        filters={filters}
        onChange={updateFilters}
      />

      <div
        className={cn(
          "flex flex-col gap-6 transition-opacity duration-200",
          isFetching && "opacity-60"
        )}
      >
        {result.properties.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No properties match your filters"
            description="Widen your search or clear a filter to see more listings."
          />
        ) : (
          <PropertyGrid properties={result.properties} />
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
