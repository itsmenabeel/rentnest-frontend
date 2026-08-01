import type { RentalRequestStatus } from "@/lib/types/models"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<RentalRequestStatus, string> = {
  PENDING:
    "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  APPROVED: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
  ACTIVE:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-muted text-muted-foreground line-through decoration-1",
}

const STATUS_LABELS: Record<RentalRequestStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

export function RentalStatusBadge({
  status,
  className,
}: {
  status: RentalRequestStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STATUS_STYLES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
