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
  // Only ever populated fresh from a createPayment response — PaymentSummary
  // (what we get back from polling, or from the rental itself) never
  // includes it, so a page reload mid-payment loses it and the panel falls
  // back to its "get a new link" affordance.
  const [gatewayUrl, setGatewayUrl] = useState<string | null>(null)

  const createMutation = useMutation({
    mutationFn: () => createPayment(rental.id),
    onSuccess: (res) => {
      setPayment(res.payment)
      if (res.gatewayUrl) {
        setGatewayUrl(res.gatewayUrl)
      } else {
        showError("Checkout link unavailable right now. Try again.")
      }
    },
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

  if (payment) {
    return (
      <PaymentPollingPanel
        paymentId={payment.id}
        rentalId={rental.id}
        gatewayUrl={gatewayUrl}
        onGetLink={() => createMutation.mutate()}
        isGettingLink={createMutation.isPending}
      />
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">
        {formatPrice(rental.property.price)} due for {rental.property.title}.
      </p>
      <PayNowButton
        onClick={() => createMutation.mutate()}
        isPending={createMutation.isPending}
      />
    </div>
  )
}
