import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-8 w-44" />
      </div>
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  )
}
