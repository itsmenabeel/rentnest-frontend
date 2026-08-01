import { MapPin, Pencil } from "lucide-react"

import type { Property } from "@/lib/types/models"
import { formatPrice } from "@/lib/utils/currency"
import { Badge } from "@/components/ui/badge"
import { ButtonLink } from "@/components/ui/button"
import { DeletePropertyButton } from "@/components/properties/delete-property-button"
import { PropertyImage } from "@/components/properties/property-image"

export function LandlordPropertyRow({
  property,
  onDeleted,
}: {
  property: Property
  onDeleted?: () => void
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-3">
      <PropertyImage
        src={property.images[0]}
        alt={property.title}
        className="size-16 flex-none rounded-lg"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="min-w-0 truncate font-heading text-sm font-semibold text-foreground">
            {property.title}
          </p>
          <Badge variant={property.isAvailable ? "default" : "outline"}>
            {property.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
        <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
          <MapPin className="size-3 flex-none text-primary" />
          {property.location}
        </p>
        <p className="text-xs font-bold text-price">
          {formatPrice(property.price)} /mo
        </p>
      </div>
      <div className="flex flex-none items-center gap-2">
        <ButtonLink
          variant="outline"
          size="icon-sm"
          aria-label="Edit listing"
          href={`/dashboard/landlord/properties/${property.id}/edit`}
        >
          <Pencil className="size-4" />
        </ButtonLink>
        <DeletePropertyButton
          propertyId={property.id}
          propertyTitle={property.title}
          onDeleted={onDeleted}
        />
      </div>
    </div>
  )
}
