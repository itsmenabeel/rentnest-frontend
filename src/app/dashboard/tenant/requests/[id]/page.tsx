import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, MapPin, MessageSquare, Star } from "lucide-react"

import { ApiRequestError } from "@/lib/api/client"
import { getRentalServer } from "@/lib/api/rentals.server"
import { formatDate } from "@/lib/utils/format-date"
import { formatPrice } from "@/lib/utils/currency"
import { cn } from "@/lib/utils"
import { ButtonLink } from "@/components/ui/button"
import { PropertyImage } from "@/components/properties/property-image"
import { RentalStatusBadge } from "@/components/rentals/rental-status-badge"
import { ReviewForm } from "@/components/reviews/review-form"

type Params = Promise<{ id: string }>

export const metadata: Metadata = {
  title: "Request details | RentNest",
}

export default async function TenantRequestDetailPage({
  params,
}: {
  params: Params
}) {
  const { id } = await params

  let rental
  try {
    rental = await getRentalServer(id)
  } catch (error) {
    // Treat "not yours" the same as "not found" — no reason to confirm to a
    // tenant that some other tenant's request id exists.
    if (
      error instanceof ApiRequestError &&
      (error.status === 404 || error.status === 403)
    ) {
      notFound()
    }
    throw error
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/tenant/requests"
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to my requests
      </Link>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row">
        <PropertyImage
          src={rental.property.images[0]}
          alt={rental.property.title}
          className="h-40 w-full flex-none rounded-lg sm:w-56"
        />
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              href={`/properties/${rental.property.id}`}
              className="font-heading text-lg font-semibold hover:underline"
            >
              {rental.property.title}
            </Link>
            <RentalStatusBadge status={rental.status} />
          </div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 text-primary" />
            {rental.property.location}
          </p>
          <p className="text-base font-bold text-price">
            {formatPrice(rental.property.price)}
            <span className="text-xs font-medium text-muted-foreground">
              {" "}
              /mo
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Calendar className="size-3.5" />
            Move-in date
          </span>
          <span className="text-sm text-foreground">
            {rental.moveInDate ? formatDate(rental.moveInDate) : "Not specified"}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
          <span className="text-xs font-semibold text-muted-foreground">
            Requested on
          </span>
          <span className="text-sm text-foreground">
            {formatDate(rental.createdAt)}
          </span>
        </div>
      </div>

      {rental.message && (
        <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <MessageSquare className="size-3.5" />
            Your message
          </span>
          <p className="text-sm text-foreground">{rental.message}</p>
        </div>
      )}

      {rental.status === "APPROVED" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
          <span>
            {rental.payment?.status === "PENDING"
              ? "Payment in progress."
              : "Approved. Pay to activate your rental."}
          </span>
          <ButtonLink
            size="sm"
            href={`/dashboard/tenant/requests/${rental.id}/pay`}
          >
            {rental.payment?.status === "PENDING" ? "Continue payment" : "Pay now"}
          </ButtonLink>
        </div>
      )}

      {rental.status === "COMPLETED" && !rental.review && (
        <ReviewForm rentalRequestId={rental.id} />
      )}

      {rental.review && (
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">
              Your review
            </p>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-3.5",
                    i < rental.review!.rating
                      ? "fill-price text-price"
                      : "text-border"
                  )}
                />
              ))}
            </div>
          </div>
          {rental.review.comment && (
            <p className="text-sm text-muted-foreground">
              {rental.review.comment}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {formatDate(rental.review.createdAt)}
          </p>
        </div>
      )}
    </div>
  )
}
