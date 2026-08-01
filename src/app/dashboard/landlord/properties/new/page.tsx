import type { Metadata } from "next"

import { getCategoriesServer } from "@/lib/api/categories.server"
import { PropertyForm } from "@/components/forms/property-form"

export const metadata: Metadata = {
  title: "Add property | RentNest",
}

export default async function NewPropertyPage() {
  const categories = await getCategoriesServer()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Add property</h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details tenants will see on your listing.
        </p>
      </div>
      <PropertyForm categories={categories} />
    </div>
  )
}
