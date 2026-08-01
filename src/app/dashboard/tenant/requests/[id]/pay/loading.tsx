import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  )
}
