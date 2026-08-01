import { getToken } from "@/lib/auth/cookie"
import type { ApiErrorDetail, ApiResponseBody } from "@/lib/types/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export type ApiFetchInit = Omit<RequestInit, "body"> & {
  body?: BodyInit | object
}

export class ApiRequestError extends Error {
  status: number
  errorDetails?: ApiErrorDetail[]

  constructor(status: number, message: string, errorDetails?: ApiErrorDetail[]) {
    super(message)
    this.name = "ApiRequestError"
    this.status = status
    this.errorDetails = errorDetails
  }
}

export async function apiRequest<T>(
  path: string,
  init: ApiFetchInit,
  token: string | undefined
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData

  const headers = new Headers(init.headers)
  if (token) headers.set("Authorization", `Bearer ${token}`)
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const body =
    isFormData || init.body === undefined || typeof init.body === "string"
      ? (init.body as BodyInit | undefined)
      : JSON.stringify(init.body)

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    body,
  })

  const parsed = (await res.json().catch(() => null)) as ApiResponseBody<T> | null

  if (!res.ok || !parsed || !parsed.success) {
    throw new ApiRequestError(
      res.status,
      parsed?.message ?? "Something went wrong. Try again.",
      parsed && !parsed.success ? parsed.errorDetails : undefined
    )
  }

  return parsed.data
}

export function apiFetch<T>(path: string, init: ApiFetchInit = {}): Promise<T> {
  return apiRequest<T>(path, init, getToken())
}
