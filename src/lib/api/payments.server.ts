import { serverApiFetch } from "@/lib/api/server"
import type { Payment } from "@/lib/types/models"

export function getPaymentsServer() {
  return serverApiFetch<Payment[]>("/api/payments")
}
