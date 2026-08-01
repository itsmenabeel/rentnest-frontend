import { apiFetch } from "@/lib/api/client"
import type { Payment } from "@/lib/types/models"

// GET /api/payments returns the tenant's full history, unpaginated — the
// backend ignores query params entirely, so any "recent N" slicing happens
// client-side. POST /create, /confirm, and the polling flow are Phase 8.
export function getPayments() {
  return apiFetch<Payment[]>("/api/payments")
}
