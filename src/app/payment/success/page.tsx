import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { getRentalServer } from "@/lib/api/rentals.server"
import { formatDate } from "@/lib/utils/format-date"
import { formatPrice } from "@/lib/utils/currency"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Payment successful | RentNest",
}

type SearchParams = Promise<{ rentalId?: string }>

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { rentalId } = await searchParams
  const rental = rentalId ? await getRentalServer(rentalId).catch(() => null) : null

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-4 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
        <CheckCircle2 className="size-7" />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold">
          Payment successful
        </h1>
        <p className="text-sm text-muted-foreground">
          Your rental is now active.
        </p>
      </div>

      {rental?.payment && (
        <div className="flex w-full flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Property</span>
            <span className="font-medium text-foreground">
              {rental.property.title}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium text-foreground">
              {formatPrice(rental.payment.amount)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Transaction id</span>
            <span className="font-medium text-foreground">
              {rental.payment.transactionId}
            </span>
          </div>
          {rental.payment.paidAt && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Paid on</span>
              <span className="font-medium text-foreground">
                {formatDate(rental.payment.paidAt)}
              </span>
            </div>
          )}
        </div>
      )}

      <Button
        render={
          <Link
            href={
              rentalId
                ? `/dashboard/tenant/requests/${rentalId}`
                : "/dashboard/tenant/requests"
            }
          />
        }
        className="w-full"
      >
        View request
      </Button>
    </div>
  )
}
