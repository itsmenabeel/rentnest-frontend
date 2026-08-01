"use client"

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

import { getMe } from "@/lib/api/auth"
import { getToken } from "@/lib/auth/cookie"
import { qk } from "@/lib/query/keys"
import { useAuthStore } from "@/lib/stores/auth-store"

/** Populates the auth store from a real GET /api/auth/me on mount, so a
 * server-side ban or role change is always reflected instead of trusting a
 * stale client-only copy. Renders nothing. */
export function AuthHydrator() {
  const setUser = useAuthStore((state) => state.setUser)

  const { data } = useQuery({
    queryKey: qk.me(),
    queryFn: getMe,
    enabled: Boolean(getToken()),
    retry: false,
  })

  useEffect(() => {
    if (data) setUser(data)
  }, [data, setUser])

  return null
}
