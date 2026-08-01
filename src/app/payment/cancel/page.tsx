import type { Metadata } from "next"
import { XCircle } from "lucide-react"

import { ButtonLink } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Payment not completed | RentNest",
}

type SearchParams = Promise<{ rentalId?: string }>

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { rentalId } = await searchParams

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-4 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400">
        <XCircle className="size-7" />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold">
          Payment not completed
        </h1>
        <p className="text-sm text-muted-foreground">
          Your rental request is still approved. You can try again anytime.
        </p>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row">
        {rentalId && (
          <ButtonLink
            href={`/dashboard/tenant/requests/${rentalId}/pay`}
            className="flex-1"
          >
            Try again
          </ButtonLink>
        )}
        <ButtonLink
          variant="outline"
          href="/dashboard/tenant/requests"
          className="flex-1"
        >
          Back to my requests
        </ButtonLink>
      </div>
    </div>
  )
}
