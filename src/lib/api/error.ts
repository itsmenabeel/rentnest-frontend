import type { FieldValues, Path, UseFormSetError } from "react-hook-form"

import { ApiRequestError } from "@/lib/api/client"
import { clearToken } from "@/lib/auth/cookie"
import { useAuthStore } from "@/lib/stores/auth-store"
import { showError } from "@/lib/utils/toast"

export function handleApiError<T extends FieldValues = FieldValues>(
  error: unknown,
  setError?: UseFormSetError<T>,
  // POST /api/auth/login also 401s on a wrong email/password — there's no
  // session to expire there, and the backend's own message ("Invalid email
  // or password") is more useful than the generic one below. Every other
  // call site is an authenticated action, where 401 does mean a dead token.
  options?: { sessionExpiredOn401?: boolean }
) {
  const sessionExpiredOn401 = options?.sessionExpiredOn401 ?? true

  if (!(error instanceof ApiRequestError)) {
    showError("Network error. Check your connection and try again.")
    return
  }

  if (error.status === 401 && sessionExpiredOn401) {
    // Clear the stale session but don't force-navigate: this fires for a
    // passive background check (AuthHydrator) on public pages too, where a
    // redirect would yank the user off a page they're allowed to be on.
    // proxy.ts is the actual gate for protected /dashboard/* routes.
    clearToken()
    useAuthStore.getState().clear()
    showError("Your session expired. Log in again.")
    return
  }

  if (error.status === 403) {
    showError("You don't have permission to do that.")
    return
  }

  if (setError && error.errorDetails?.length) {
    for (const detail of error.errorDetails) {
      // The backend's validation middleware wraps request data in
      // body/query/params (Zod schemas like `z.object({ body: ... })`), so
      // every path arrives prefixed — "body.email", not "email". Strip the
      // wrapper segment so it matches the form's actual field names.
      const [, ...rest] = detail.path.split(".")
      const fieldName = rest.length > 0 ? rest.join(".") : detail.path
      setError(fieldName as Path<T>, { message: detail.message })
    }
    return
  }

  showError(error.message)
}
