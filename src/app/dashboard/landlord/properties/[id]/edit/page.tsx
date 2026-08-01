import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

import { ApiRequestError } from "@/lib/api/client"
import { getCategoriesServer } from "@/lib/api/categories.server"
import { getPropertyServer } from "@/lib/api/properties.server"
import { TOKEN_COOKIE_NAME } from "@/lib/auth/cookie"
import { decodeAuthToken } from "@/lib/auth/jwt"
import { PropertyForm } from "@/components/forms/property-form"

type Params = Promise<{ id: string }>

export const metadata: Metadata = {
  title: "Edit property | RentNest",
}

export default async function EditPropertyPage({
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

  // GET /api/properties/:id is public, so ownership isn't enforced there —
  // check it here too (the PUT/DELETE routes enforce it server-side either
  // way; this just avoids showing another landlord's listing in the form).
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value
  const payload = token ? decodeAuthToken(token) : null

  if (!payload || payload.id !== property.landlordId) {
    notFound()
  }

  const categories = await getCategoriesServer()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Edit property</h1>
        <p className="text-sm text-muted-foreground">{property.title}</p>
      </div>
      <PropertyForm categories={categories} property={property} />
    </div>
  )
}
