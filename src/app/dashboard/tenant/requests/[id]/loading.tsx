import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-44 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>
  )
}
