"use client"

import { Tags } from "lucide-react"

import type { Category } from "@/lib/types/models"
import { EmptyState } from "@/components/common/empty-state"
import { CategoryForm } from "@/components/admin/category-form"
import { CategoryRow } from "@/components/admin/category-row"

export function CategoriesManager({ categories }: { categories: Category[] }) {
  return (
    <div className="flex flex-col gap-4">
      <CategoryForm />

      {categories.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="No categories yet"
          description="Add your first category above."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  )
}
