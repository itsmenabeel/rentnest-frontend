import type { Payment, PaymentStatus } from "@/lib/types/models"
import { formatDate } from "@/lib/utils/format-date"
import { formatPrice } from "@/lib/utils/currency"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<PaymentStatus, string> = {
  PENDING:
    "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  COMPLETED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
}

export function PaymentSummaryRow({ payment }: { payment: Payment }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="truncate text-sm font-semibold text-foreground">
          {payment.rentalRequest.property.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(payment.paidAt ?? payment.createdAt)}
        </p>
      </div>
      <div className="flex flex-none flex-col items-end gap-1">
        <span className="text-sm font-bold text-price">
          {formatPrice(payment.amount)}
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-semibold",
            STATUS_STYLES[payment.status]
          )}
        >
          {payment.status}
        </span>
      </div>
    </div>
  )
}
