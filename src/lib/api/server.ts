import "server-only"
import { cookies } from "next/headers"

import { apiRequest, type ApiFetchInit } from "@/lib/api/client"
import { TOKEN_COOKIE_NAME } from "@/lib/auth/cookie"

export async function serverApiFetch<T>(
  path: string,
  init: ApiFetchInit = {}
): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value
  return apiRequest<T>(path, init, token)
}
