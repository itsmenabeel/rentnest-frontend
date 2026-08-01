import { apiFetch } from "@/lib/api/client"
import type { Payment } from "@/lib/types/models"

// GET /api/payments returns the tenant's full history, unpaginated — the
// backend ignores query params entirely, so any "recent N" slicing happens
// client-side.
export function getPayments() {
  return apiFetch<Payment[]>("/api/payments")
}

export interface CreatePaymentResponse {
  payment: Payment
  /** Undefined if SSLCommerz's session init didn't return a page URL. */
  gatewayUrl?: string
}

export function createPayment(rentalRequestId: string) {
  return apiFetch<CreatePaymentResponse>("/api/payments/create", {
    method: "POST",
    body: { rentalRequestId },
  })
}

export function getPayment(id: string) {
  return apiFetch<Payment>(`/api/payments/${id}`)
}
