import { getAmenityIcon } from "@/lib/utils/amenity-icon"

export function AmenitiesList({ amenities }: { amenities: string[] }) {
  if (amenities.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-heading text-lg font-semibold">Amenities</h2>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3">
        {amenities.map((amenity) => {
          const Icon = getAmenityIcon(amenity)
          return (
            <li
              key={amenity}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <Icon className="size-4 flex-none text-primary" />
              {amenity}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
