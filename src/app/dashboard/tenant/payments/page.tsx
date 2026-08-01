import type { Metadata } from "next"
import { Receipt } from "lucide-react"

import { getPaymentsServer } from "@/lib/api/payments.server"
import { EmptyState } from "@/components/common/empty-state"
import { PaymentSummaryRow } from "@/components/payments/payment-summary-row"

export const metadata: Metadata = {
  title: "My payments | RentNest",
}

export default async function TenantPaymentsPage() {
  const payments = await getPaymentsServer()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">My payments</h1>
        <p className="text-sm text-muted-foreground">
          {payments.length} payment{payments.length === 1 ? "" : "s"} total.
        </p>
      </div>

      {payments.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No payments yet"
          description="Payments appear here once a request is approved and paid."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {payments.map((payment) => (
            <PaymentSummaryRow key={payment.id} payment={payment} />
          ))}
        </div>
      )}
    </div>
  )
}
