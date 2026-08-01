import { PropertyGridSkeleton } from "@/components/properties/property-grid"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-12">
      <div className="mb-6 flex flex-col gap-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="mb-6 h-16 w-full rounded-xl" />
      <PropertyGridSkeleton />
    </div>
  )
}
