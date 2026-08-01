import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MapPin, Phone, User } from "lucide-react"

import { ApiRequestError } from "@/lib/api/client"
import { getPropertyServer } from "@/lib/api/properties.server"
import { getPropertyReviewsServer } from "@/lib/api/reviews.server"
import { formatDate } from "@/lib/utils/format-date"
import { formatPrice } from "@/lib/utils/currency"
import { Badge } from "@/components/ui/badge"
import { AmenitiesList } from "@/components/properties/amenities-list"
import { PropertyGallery } from "@/components/properties/property-gallery"
import { RequestToRentCta } from "@/components/properties/request-to-rent-cta"
import { ReviewsSection } from "@/components/properties/reviews-section"

type Params = Promise<{ id: string }>

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { id } = await params

  try {
    const property = await getPropertyServer(id)
    return {
      title: `${property.title} | RentNest`,
      description: property.description.slice(0, 155),
    }
  } catch {
    return { title: "Property | RentNest" }
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Params
}) {
  const { id } = await params

  let property
  try {
    property = await getPropertyServer(id)
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound()
    }
    throw error
  }

  const reviewsResult = await getPropertyReviewsServer(id, { limit: 10 })

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <PropertyGallery images={property.images} title={property.title} />

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{property.category.name}</Badge>
              {!property.isAvailable && (
                <Badge variant="outline">Not currently available</Badge>
              )}
            </div>
            <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
              {property.title}
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              {property.location}
            </p>
            <p className="text-2xl font-bold text-price">
              {formatPrice(property.price)}
              <span className="text-sm font-medium text-muted-foreground">
                {" "}
                /mo
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-lg font-semibold">
              About this place
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {property.description}
            </p>
          </div>

          <AmenitiesList amenities={property.amenities} />

          <ReviewsSection
            reviews={reviewsResult.reviews}
            averageRating={reviewsResult.meta.averageRating}
            total={reviewsResult.meta.total}
          />
        </div>

        <div className="flex flex-col gap-4">
          <RequestToRentCta
            propertyId={property.id}
            propertyTitle={property.title}
            isAvailable={property.isAvailable}
          />

          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
            <h2 className="font-heading text-sm font-semibold text-muted-foreground">
              Listed by
            </h2>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 flex-none items-center justify-center rounded-full bg-accent text-accent-foreground">
                <User className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {property.landlord.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Member since {formatDate(property.landlord.createdAt)}
                </p>
              </div>
            </div>
            {property.landlord.phone && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-3.5" />
                {property.landlord.phone}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
