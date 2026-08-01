import type { Metadata } from "next"
import { Plus } from "lucide-react"

import { getCategoriesServer } from "@/lib/api/categories.server"
import type { LandlordPropertyFilters } from "@/lib/api/landlord-properties"
import { getLandlordPropertiesServer } from "@/lib/api/landlord-properties.server"
import { ButtonLink } from "@/components/ui/button"
import { LandlordPropertyBrowser } from "@/components/properties/landlord-property-browser"

export const metadata: Metadata = {
  title: "My properties | RentNest",
}

type SearchParams = Record<string, string | string[] | undefined>

function parseFilters(sp: SearchParams): LandlordPropertyFilters {
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

export default async function LandlordPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const filters = parseFilters(await searchParams)

  const [properties, categories] = await Promise.all([
    getLandlordPropertiesServer(filters),
    getCategoriesServer(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">
            My properties
          </h1>
          <p className="text-sm text-muted-foreground">
            {properties.meta.total} listing
            {properties.meta.total === 1 ? "" : "s"} total.
          </p>
        </div>
        <ButtonLink href="/dashboard/landlord/properties/new">
          <Plus className="size-4" />
          Add property
        </ButtonLink>
      </div>
      <LandlordPropertyBrowser
        initialData={properties}
        initialFilters={filters}
        categories={categories}
      />
    </div>
  )
}
