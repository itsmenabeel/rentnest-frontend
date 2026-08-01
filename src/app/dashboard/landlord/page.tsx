import type { Metadata } from "next"
import Link from "next/link"
import { Building2, CheckCircle2, XCircle } from "lucide-react"

import { getLandlordPropertiesServer } from "@/lib/api/landlord-properties.server"
import { EmptyState } from "@/components/common/empty-state"
import { StatCard } from "@/components/common/stat-card"
import { Button } from "@/components/ui/button"
import { LandlordPropertyRow } from "@/components/properties/landlord-property-row"

export const metadata: Metadata = {
  title: "Landlord dashboard | RentNest",
}

export default async function LandlordDashboardPage() {
  const properties = await getLandlordPropertiesServer({ limit: 100 })
  const available = properties.properties.filter((p) => p.isAvailable).length
  const recent = properties.properties.slice(0, 5)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          A snapshot of your listings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Building2}
          label="Total listings"
          value={properties.meta.total}
        />
        <StatCard icon={CheckCircle2} label="Available" value={available} />
        <StatCard
          icon={XCircle}
          label="Unavailable"
          value={properties.properties.length - available}
        />
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">
            Recent listings
          </h2>
          <Link
            href="/dashboard/landlord/properties"
            className="text-sm font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No listings yet"
            description="Create your first listing to start receiving requests."
            action={
              <Button render={<Link href="/dashboard/landlord/properties/new" />}>
                Add property
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-2">
            {recent.map((property) => (
              <LandlordPropertyRow key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
