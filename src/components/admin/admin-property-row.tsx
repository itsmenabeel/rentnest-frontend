import Link from "next/link"

import type { Property } from "@/lib/types/models"
import { formatDate } from "@/lib/utils/format-date"
import { formatPrice } from "@/lib/utils/currency"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableRow } from "@/components/ui/table"

export function AdminPropertyRow({ property }: { property: Property }) {
  return (
    <TableRow>
      <TableCell className="max-w-48 truncate">
        <Link
          href={`/properties/${property.id}`}
          className="font-medium hover:underline"
        >
          {property.title}
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {property.landlord.name}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {property.category.name}
      </TableCell>
      <TableCell className="text-price font-semibold">
        {formatPrice(property.price)}
      </TableCell>
      <TableCell>
        <Badge variant={property.isAvailable ? "default" : "outline"}>
          {property.isAvailable ? "Available" : "Unavailable"}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(property.createdAt)}
      </TableCell>
    </TableRow>
  )
}
