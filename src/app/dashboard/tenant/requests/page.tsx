import type { Metadata } from "next"

import type { RentalFilters } from "@/lib/api/rentals"
import { getRentalsServer } from "@/lib/api/rentals.server"
import type { RentalRequestStatus } from "@/lib/types/models"
import { TenantRentalBrowser } from "@/components/rentals/tenant-rental-browser"

export const metadata: Metadata = {
  title: "My requests | RentNest",
}

type SearchParams = Record<string, string | string[] | undefined>

const VALID_STATUSES: RentalRequestStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
]

function parseFilters(sp: SearchParams): RentalFilters {
  const get = (key: string) => {
    const value = sp[key]
    return Array.isArray(value) ? value[0] : value
  }
  const status = get("status")
  const page = get("page")

  return {
    status:
      status && VALID_STATUSES.includes(status as RentalRequestStatus)
        ? (status as RentalRequestStatus)
        : undefined,
    page: page ? Number(page) : 1,
    limit: 10,
  }
}

export default async function TenantRequestsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const filters = parseFilters(await searchParams)
  const rentals = await getRentalsServer(filters)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">My requests</h1>
        <p className="text-sm text-muted-foreground">
          {rentals.meta.total} request{rentals.meta.total === 1 ? "" : "s"}{" "}
          total.
        </p>
      </div>
      <TenantRentalBrowser initialData={rentals} initialFilters={filters} />
    </div>
  )
}
