import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { TOKEN_COOKIE_NAME } from "@/lib/auth/cookie"
import { decodeAuthToken, isTokenExpired } from "@/lib/auth/jwt"

const ROLE_HOME: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value
  const payload = token ? decodeAuthToken(token) : null

  if (!payload || isTokenExpired(payload)) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const roleHome = ROLE_HOME[payload.role]
  const requestedRole = pathname.split("/").filter(Boolean)[1]

  if (!requestedRole || `/dashboard/${requestedRole}` !== roleHome) {
    return NextResponse.redirect(new URL(roleHome, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
