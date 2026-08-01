"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { CircleAlert, RefreshCw } from "lucide-react"

import { createPayment } from "@/lib/api/payments"
import { handleApiError } from "@/lib/api/error"
import { showError } from "@/lib/utils/toast"
import { formatPrice } from "@/lib/utils/currency"
import type { PaymentSummary, RentalRequest } from "@/lib/types/models"
import { Button } from "@/components/ui/button"
import { PayNowButton } from "@/components/payments/pay-now-button"

export function PayFlow({ rental }: { rental: RentalRequest }) {
  const router = useRouter()
  const [payment, setPayment] = useState<PaymentSummary | null>(
    rental.payment?.status === "PENDING" ? rental.payment : null
  )

  const createMutation = useMutation({
    mutationFn: () => createPayment(rental.id),
    onError: (error) => handleApiError(error),
  })

  if (rental.status !== "APPROVED") {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
        <CircleAlert className="size-4 flex-none translate-y-0.5" />
        This request needs to be approved by the landlord before you can pay.
      </div>
    )
  }

  const handlePay = () => {
    // Open the tab synchronously on the click, before the create request
    // resolves — popup blockers only allow window.open from a direct user
    // gesture, not from inside an async callback.
    const checkoutTab = window.open("about:blank", "_blank")

    createMutation.mutate(undefined, {
      onSuccess: (res) => {
        if (!res.gatewayUrl) {
          checkoutTab?.close()
          showError("Could not start checkout. Try again.")
          return
        }
        setPayment(res.payment)
        if (checkoutTab) {
          checkoutTab.location.href = res.gatewayUrl
        } else {
          showError("Allow popups for this site, then try again.")
        }
      },
      onError: () => {
        checkoutTab?.close()
      },
    })
  }

  if (payment) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
        <p className="text-sm font-medium text-foreground">
          Complete your payment in the new tab.
        </p>
        <p className="text-sm text-muted-foreground">
          Transaction {payment.transactionId} &middot; {formatPrice(payment.amount)}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => router.refresh()}
        >
          <RefreshCw className="size-3.5" />
          Refresh status
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">
        {formatPrice(rental.property.price)} due for {rental.property.title}.
      </p>
      <PayNowButton onClick={handlePay} isPending={createMutation.isPending} />
    </div>
  )
}
