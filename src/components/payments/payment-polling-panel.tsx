"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { ExternalLink, Loader2 } from "lucide-react"

import { getPayment } from "@/lib/api/payments"
import { qk } from "@/lib/query/keys"
import { formatPrice } from "@/lib/utils/currency"
import { Button, ButtonLink } from "@/components/ui/button"

export function PaymentPollingPanel({
  paymentId,
  rentalId,
  gatewayUrl,
  onGetLink,
  isGettingLink,
}: {
  paymentId: string
  rentalId: string
  gatewayUrl: string | null
  onGetLink: () => void
  isGettingLink: boolean
}) {
  const router = useRouter()

  const { data: payment } = useQuery({
    queryKey: qk.payment(paymentId),
    queryFn: () => getPayment(paymentId),
    refetchInterval: (query) =>
      query.state.data?.status === "PENDING" ? 3000 : false,
  })

  useEffect(() => {
    if (payment?.status === "COMPLETED") {
      router.replace(`/payment/success?rentalId=${rentalId}`)
    } else if (payment?.status === "FAILED") {
      router.replace(`/payment/cancel?rentalId=${rentalId}&reason=failed`)
    }
  }, [payment?.status, rentalId, router])

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
        <Loader2 className="size-4 flex-none animate-spin text-primary" />
        Waiting for payment confirmation
      </div>
      <p className="text-sm text-muted-foreground">
        {gatewayUrl
          ? "Continue to SSLCommerz to finish paying. This page updates automatically once it's done, no need to refresh."
          : "Get a secure checkout link to finish paying."}
      </p>
      {payment && (
        <p className="text-xs text-muted-foreground">
          Transaction {payment.transactionId} &middot; {formatPrice(payment.amount)}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {gatewayUrl ? (
          <ButtonLink
            href={gatewayUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
          >
            <ExternalLink className="size-3.5" />
            Open secure checkout
          </ButtonLink>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onGetLink}
            disabled={isGettingLink}
          >
            {isGettingLink && <Loader2 className="size-3.5 animate-spin" />}
            Get checkout link
          </Button>
        )}
        <Link
          href={`/dashboard/tenant/requests/${rentalId}`}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to request
        </Link>
      </div>
    </div>
  )
}
