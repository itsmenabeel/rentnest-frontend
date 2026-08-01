import type { FieldValues, Path, UseFormSetError } from "react-hook-form"

import { ApiRequestError } from "@/lib/api/client"
import { clearToken } from "@/lib/auth/cookie"
import { showError } from "@/lib/utils/toast"

export function handleApiError<T extends FieldValues = FieldValues>(
  error: unknown,
  setError?: UseFormSetError<T>
) {
  if (!(error instanceof ApiRequestError)) {
    showError("Network error. Check your connection and try again.")
    return
  }

  if (error.status === 401) {
    clearToken()
    showError("Your session expired. Log in again.")
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login"
    }
    return
  }

  if (error.status === 403) {
    showError("You don't have permission to do that.")
    return
  }

  if (setError && error.errorDetails?.length) {
    for (const detail of error.errorDetails) {
      setError(detail.path as Path<T>, { message: detail.message })
    }
    return
  }

  showError(error.message)
}
