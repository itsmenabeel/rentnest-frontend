import type { Metadata } from "next"

import type { LandlordRequestFilters } from "@/lib/api/landlord-rentals"
import { getLandlordRequestsServer } from "@/lib/api/landlord-rentals.server"
import type { RentalRequestStatus } from "@/lib/types/models"
import { LandlordRequestsTable } from "@/components/rentals/landlord-requests-table"

export const metadata: Metadata = {
  title: "Requests | RentNest",
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

function parseFilters(sp: SearchParams): LandlordRequestFilters {
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

export default async function LandlordRequestsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const filters = parseFilters(await searchParams)
  const requests = await getLandlordRequestsServer(filters)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Requests</h1>
        <p className="text-sm text-muted-foreground">
          {requests.meta.total} request{requests.meta.total === 1 ? "" : "s"}{" "}
          total.
        </p>
      </div>
      <LandlordRequestsTable initialData={requests} initialFilters={filters} />
    </div>
  )
}
