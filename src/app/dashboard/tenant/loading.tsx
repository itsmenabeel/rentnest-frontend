import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      {[0, 1].map((section) => (
        <div key={section} className="flex flex-col gap-3">
          <Skeleton className="h-5 w-32" />
          {[0, 1, 2].map((row) => (
            <Skeleton key={row} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ))}
    </div>
  )
}
