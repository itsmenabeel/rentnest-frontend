import type { Metadata } from "next"

import { getCategoriesServer } from "@/lib/api/categories.server"
import { getPropertiesServer } from "@/lib/api/properties.server"
import type { PropertyFilters } from "@/lib/api/properties"
import { normalizeRange, toPositiveNumber } from "@/lib/utils/number"
import { DecorativeBackground } from "@/components/common/decorative-background"
import { PropertyBrowser } from "@/components/properties/property-browser"

export const metadata: Metadata = {
  title: "Browse properties | RentNest",
  description: "Filter rental listings across Dhaka by area, type, and price.",
}

type SearchParams = Record<string, string | string[] | undefined>

function parseFilters(sp: SearchParams): PropertyFilters {
  const get = (key: string) => {
    const value = sp[key]
    return Array.isArray(value) ? value[0] : value
  }
  const { min, max } = normalizeRange(
    toPositiveNumber(get("minPrice")),
    toPositiveNumber(get("maxPrice"))
  )

  return {
    search: get("search") || undefined,
    categoryId: get("categoryId") || undefined,
    minPrice: min,
    maxPrice: max,
    page: toPositiveNumber(get("page")) ?? 1,
    limit: 12,
  }
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const filters = parseFilters(await searchParams)

  const [properties, categories] = await Promise.all([
    getPropertiesServer(filters),
    getCategoriesServer(),
  ])

  return (
    <div className="flex-1">
      <section className="relative overflow-hidden py-10 sm:py-12">
        <DecorativeBackground className="opacity-50" />
        <div className="relative mx-auto flex w-full max-w-[90rem] flex-col gap-1.5 px-4 sm:px-6 lg:px-12">
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
            Browse properties
          </h1>
          <p className="text-sm text-muted-foreground">
            {properties.meta.total} listing
            {properties.meta.total === 1 ? "" : "s"} available across Dhaka.
          </p>
        </div>
      </section>
      <div className="mx-auto w-full max-w-[90rem] px-4 pb-10 sm:px-6 lg:px-12">
        <PropertyBrowser
          initialData={properties}
          initialFilters={filters}
          categories={categories}
        />
      </div>
    </div>
  )
}
