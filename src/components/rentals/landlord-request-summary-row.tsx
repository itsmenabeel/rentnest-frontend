import { User } from "lucide-react"

import type { RentalRequest } from "@/lib/types/models"
import { formatDate } from "@/lib/utils/format-date"
import { RentalStatusBadge } from "@/components/rentals/rental-status-badge"

export function LandlordRequestSummaryRow({
  rental,
}: {
  rental: RentalRequest
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="truncate text-sm font-semibold text-foreground">
          {rental.property.title}
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="size-3 flex-none text-primary" />
          {rental.tenant.name} · {formatDate(rental.createdAt)}
        </p>
      </div>
      <RentalStatusBadge status={rental.status} className="flex-none" />
    </div>
  )
}
