import Link from "next/link"

import type { RentalRequest } from "@/lib/types/models"
import { formatDate } from "@/lib/utils/format-date"
import { TableCell, TableRow } from "@/components/ui/table"
import { RentalStatusBadge } from "@/components/rentals/rental-status-badge"

export function AdminRentalRow({ rental }: { rental: RentalRequest }) {
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
      <TableCell className="text-muted-foreground">
        {rental.tenant.name}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {rental.property.landlord.name}
      </TableCell>
      <TableCell>
        <RentalStatusBadge status={rental.status} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(rental.createdAt)}
      </TableCell>
    </TableRow>
  )
}
