import { decodeJwt } from "jose"

import type { Role } from "@/lib/types/models"

export interface AuthTokenPayload {
  id: string
  role: Role
  iat: number
  exp: number
}

function isAuthTokenPayload(value: unknown): value is AuthTokenPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).id === "string" &&
    typeof (value as Record<string, unknown>).role === "string" &&
    typeof (value as Record<string, unknown>).exp === "number"
  )
}

/** Decode only — the backend re-verifies the signature on every real
 * request, so this is a UX/routing convenience, not the security boundary. */
export function decodeAuthToken(token: string): AuthTokenPayload | null {
  try {
    const payload = decodeJwt(token)
    return isAuthTokenPayload(payload) ? payload : null
  } catch {
    return null
  }
}

export function isTokenExpired(payload: AuthTokenPayload) {
  return payload.exp * 1000 < Date.now()
}
