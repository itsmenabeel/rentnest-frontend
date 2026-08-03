import { PropertyGridSkeleton } from "@/components/properties/property-grid"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex-1">
      <section className="overflow-hidden py-10 sm:py-12">
        <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-2 px-4 sm:px-6 lg:px-12">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
      </section>
      <div className="mx-auto w-full max-w-[90rem] px-4 pb-10 sm:px-6 lg:px-12">
        <Skeleton className="mb-6 h-16 w-full rounded-xl" />
        <PropertyGridSkeleton />
      </div>
    </div>
  )
}
