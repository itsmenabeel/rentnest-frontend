import Link from "next/link"
import { MapPin } from "lucide-react"

import type { RentalRequest } from "@/lib/types/models"
import { formatDate } from "@/lib/utils/format-date"
import { formatPrice } from "@/lib/utils/currency"
import { PropertyImage } from "@/components/properties/property-image"
import { RentalStatusBadge } from "@/components/rentals/rental-status-badge"

export function RentalRow({ rental }: { rental: RentalRequest }) {
  return (
    <Link
      href={`/dashboard/tenant/requests/${rental.id}`}
      className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 transition-colors hover:border-accent-tint-border"
    >
      <PropertyImage
        src={rental.property.images[0]}
        alt={rental.property.title}
        className="size-16 flex-none rounded-lg"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-heading text-sm font-semibold text-foreground">
            {rental.property.title}
          </p>
          <RentalStatusBadge status={rental.status} />
        </div>
        <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
          <MapPin className="size-3 flex-none text-primary" />
          {rental.property.location}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatPrice(rental.property.price)} /mo</span>
          <span>Requested {formatDate(rental.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}
