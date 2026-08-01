"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { CircleAlert } from "lucide-react"

import { createPayment } from "@/lib/api/payments"
import { handleApiError } from "@/lib/api/error"
import { showError } from "@/lib/utils/toast"
import { formatPrice } from "@/lib/utils/currency"
import type { PaymentSummary, RentalRequest } from "@/lib/types/models"
import { PayNowButton } from "@/components/payments/pay-now-button"
import { PaymentPollingPanel } from "@/components/payments/payment-polling-panel"

export function PayFlow({ rental }: { rental: RentalRequest }) {
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
      <PaymentPollingPanel
        paymentId={payment.id}
        rentalId={rental.id}
        onReopen={handlePay}
        isReopening={createMutation.isPending}
      />
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
