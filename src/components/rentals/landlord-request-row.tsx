import Link from "next/link"
import { Check, CheckCheck, Loader2, X } from "lucide-react"

import type { RentalRequest } from "@/lib/types/models"
import { formatDate } from "@/lib/utils/format-date"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { RentalStatusBadge } from "@/components/rentals/rental-status-badge"

export function LandlordRequestRow({
  rental,
  onApprove,
  onReject,
  onMarkCompleted,
  isMutating,
}: {
  rental: RentalRequest
  onApprove: () => void
  onReject: () => void
  onMarkCompleted: () => void
  isMutating: boolean
}) {
  return (
    <TableRow>
      <TableCell className="max-w-48 truncate">
        <Link
          href={`/properties/${rental.property.id}`}
          className="font-medium hover:underline"
        >
          {rental.property.title}
        </Link>
      </TableCell>
      <TableCell>{rental.tenant.name}</TableCell>
      <TableCell>
        <RentalStatusBadge status={rental.status} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(rental.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        {rental.status === "PENDING" && (
          <div className="flex justify-end gap-2">
            <Button size="sm" onClick={onApprove} disabled={isMutating}>
              {isMutating ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Check className="size-3.5" />
              )}
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onReject}
              disabled={isMutating}
            >
              <X className="size-3.5" />
              Reject
            </Button>
          </div>
        )}
        {rental.status === "ACTIVE" && (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={onMarkCompleted}
              disabled={isMutating}
            >
              {isMutating ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <CheckCheck className="size-3.5" />
              )}
              Mark completed
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}
