import Link from "next/link"

import type { Category } from "@/lib/types/models"
import { getCategoryIcon } from "@/lib/utils/category-icon"

export function CategoryPills({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((category) => {
        const Icon = getCategoryIcon(category.name)
        return (
          <Link
            key={category.id}
            href={`/properties?categoryId=${category.id}`}
            className="group flex flex-col items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-tint-border hover:shadow-md"
          >
            <span className="flex size-10 items-center justify-center rounded-[10px] bg-accent text-accent-foreground transition-transform duration-200 group-hover:scale-105">
              <Icon className="size-5" />
            </span>
            <span className="text-sm font-semibold text-foreground">
              {category.name}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
