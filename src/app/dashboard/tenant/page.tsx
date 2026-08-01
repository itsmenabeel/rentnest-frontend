import type { Metadata } from "next"
import Link from "next/link"
import { Inbox } from "lucide-react"

import { getRentalsServer } from "@/lib/api/rentals.server"
import { getPaymentsServer } from "@/lib/api/payments.server"
import { EmptyState } from "@/components/common/empty-state"
import { PaymentSummaryRow } from "@/components/payments/payment-summary-row"
import { RentalRow } from "@/components/rentals/rental-row"

export const metadata: Metadata = {
  title: "Tenant dashboard | RentNest",
}

export default async function TenantDashboardPage() {
  const [rentalsResult, payments] = await Promise.all([
    getRentalsServer({ limit: 5 }),
    getPaymentsServer(),
  ])

  const recentPayments = payments.slice(0, 5)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Track your rental requests and payments in one place.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">
            Recent requests
          </h2>
          <Link
            href="/dashboard/tenant/requests"
            className="text-sm font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            View all
          </Link>
        </div>
        {rentalsResult.rentals.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No requests yet"
            description="Browse properties and send your first request to rent."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {rentalsResult.rentals.map((rental) => (
              <RentalRow key={rental.id} rental={rental} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">
            Recent payments
          </h2>
          <Link
            href="/dashboard/tenant/payments"
            className="text-sm font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            View all
          </Link>
        </div>
        {recentPayments.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No payments yet"
            description="Payments appear here once a request is approved and paid."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {recentPayments.map((payment) => (
              <PaymentSummaryRow key={payment.id} payment={payment} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
