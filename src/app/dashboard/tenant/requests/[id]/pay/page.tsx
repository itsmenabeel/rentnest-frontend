import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { ApiRequestError } from "@/lib/api/client"
import { getRentalServer } from "@/lib/api/rentals.server"
import { PayFlow } from "@/components/payments/pay-flow"

type Params = Promise<{ id: string }>

export const metadata: Metadata = {
  title: "Pay for your rental | RentNest",
}

export default async function PayPage({ params }: { params: Params }) {
  const { id } = await params

  let rental
  try {
    rental = await getRentalServer(id)
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      (error.status === 404 || error.status === 403)
    ) {
      notFound()
    }
    throw error
  }

  if (rental.payment?.status === "COMPLETED") {
    redirect(`/payment/success?rentalId=${rental.id}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/dashboard/tenant/requests/${rental.id}`}
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to request
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-semibold">
          {rental.property.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {rental.property.location}
        </p>
      </div>

      <PayFlow rental={rental} />
    </div>
  )
}
