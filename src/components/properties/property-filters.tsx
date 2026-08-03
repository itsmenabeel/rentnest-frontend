"use client"

import { useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"

import type { PropertyFilters } from "@/lib/api/properties"
import type { Category } from "@/lib/types/models"
import { normalizeRange, toPositiveNumber } from "@/lib/utils/number"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function PropertyFiltersBar({
  categories,
  filters,
  onChange,
}: {
  categories: Category[]
  filters: PropertyFilters
  onChange: (next: Partial<PropertyFilters>) => void
}) {
  const externalKey = `${filters.search ?? ""}|${filters.minPrice ?? ""}|${filters.maxPrice ?? ""}`
  const [lastExternalKey, setLastExternalKey] = useState(externalKey)
  const [draft, setDraft] = useState({
    search: filters.search ?? "",
    minPrice: filters.minPrice?.toString() ?? "",
    maxPrice: filters.maxPrice?.toString() ?? "",
  })

  // Re-sync local drafts when filters change from outside this component
  // (e.g. "Clear filters"). Adjusting state during render, per React's
  // guidance, instead of an effect that would cascade an extra render.
  if (externalKey !== lastExternalKey) {
    setLastExternalKey(externalKey)
    setDraft({
      search: filters.search ?? "",
      minPrice: filters.minPrice?.toString() ?? "",
      maxPrice: filters.maxPrice?.toString() ?? "",
    })
  }

  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    const handle = setTimeout(() => {
      const { min, max } = normalizeRange(
        toPositiveNumber(draft.minPrice),
        toPositiveNumber(draft.maxPrice)
      )
      onChange({
        search: draft.search || undefined,
        minPrice: min,
        maxPrice: max,
      })
    }, 400)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  const hasActiveFilters = Boolean(
    filters.search || filters.categoryId || filters.minPrice || filters.maxPrice
  )

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-52">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={draft.search}
          onChange={(e) => setDraft((d) => ({ ...d, search: e.target.value }))}
          placeholder="Search by title, area, or description"
          aria-label="Search properties"
          className="pl-8"
        />
      </div>

      <Select
        value={filters.categoryId ?? "all"}
        onValueChange={(value) =>
          onChange({ categoryId: value === "all" ? undefined : (value ?? undefined) })
        }
        items={{
          all: "All property types",
          ...Object.fromEntries(categories.map((c) => [c.id, c.name])),
        }}
      >
        <SelectTrigger aria-label="Filter by property type" className="sm:w-44">
          <SelectValue placeholder="Property type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All property types</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          value={draft.minPrice}
          onChange={(e) => setDraft((d) => ({ ...d, minPrice: e.target.value }))}
          placeholder="Min ৳"
          aria-label="Minimum price"
          className="w-24"
        />
        <span className="text-sm text-muted-foreground">–</span>
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          value={draft.maxPrice}
          onChange={(e) => setDraft((d) => ({ ...d, maxPrice: e.target.value }))}
          placeholder="Max ৳"
          aria-label="Maximum price"
          className="w-24"
        />
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange({
              search: undefined,
              categoryId: undefined,
              minPrice: undefined,
              maxPrice: undefined,
            })
          }
        >
          <X className="size-3.5" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
