import type { Metadata } from "next"

import { getAdminPropertiesServer } from "@/lib/api/admin-moderation.server"
import { getCategoriesServer } from "@/lib/api/categories.server"
import type { AdminPropertyFilters } from "@/lib/api/admin-moderation"
import { AdminPropertiesTable } from "@/components/admin/admin-properties-table"

export const metadata: Metadata = {
  title: "Manage properties | RentNest",
}

type SearchParams = Record<string, string | string[] | undefined>

function parseFilters(sp: SearchParams): AdminPropertyFilters {
  const get = (key: string) => {
    const value = sp[key]
    return Array.isArray(value) ? value[0] : value
  }
  const categoryId = get("categoryId")
  const isAvailable = get("isAvailable")
  const page = get("page")

  return {
    categoryId: categoryId || undefined,
    isAvailable:
      isAvailable === "true" ? true : isAvailable === "false" ? false : undefined,
    page: page ? Number(page) : 1,
    limit: 10,
  }
}

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const filters = parseFilters(await searchParams)
  const [properties, categories] = await Promise.all([
    getAdminPropertiesServer(filters),
    getCategoriesServer(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Properties</h1>
        <p className="text-sm text-muted-foreground">
          {properties.meta.total} listing{properties.meta.total === 1 ? "" : "s"}{" "}
          total.
        </p>
      </div>
      <AdminPropertiesTable
        initialData={properties}
        initialFilters={filters}
        categories={categories}
      />
    </div>
  )
}
