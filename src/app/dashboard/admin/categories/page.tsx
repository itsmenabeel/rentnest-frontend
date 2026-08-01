import type { Metadata } from "next"

import { getCategoriesServer } from "@/lib/api/categories.server"
import { CategoriesManager } from "@/components/admin/categories-manager"

export const metadata: Metadata = {
  title: "Manage categories | RentNest",
}

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesServer()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Categories</h1>
        <p className="text-sm text-muted-foreground">
          {categories.length} categor{categories.length === 1 ? "y" : "ies"}{" "}
          total.
        </p>
      </div>
      <CategoriesManager categories={categories} />
    </div>
  )
}
