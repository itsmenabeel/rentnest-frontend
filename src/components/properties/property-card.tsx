import Link from "next/link"
import { MapPin } from "lucide-react"

import type { Property } from "@/lib/types/models"
import { formatPrice } from "@/lib/utils/currency"
import { PropertyImage } from "@/components/properties/property-image"

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative">
        <PropertyImage
          src={property.images[0]}
          alt={property.title}
          className="h-36 w-full"
        />
        <span className="absolute left-2.5 top-2.5 rounded-md bg-badge-bg px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-xs">
          {property.category.name}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-heading text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
          {property.title}
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 flex-none text-primary" />
          {property.location}
        </p>
        <p className="mt-2 text-base font-bold text-price">
          {formatPrice(property.price)}
          <span className="text-xs font-medium text-muted-foreground"> /mo</span>
        </p>
      </div>
    </Link>
  )
}
