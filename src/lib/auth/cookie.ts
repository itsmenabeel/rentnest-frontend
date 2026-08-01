import Cookies from "js-cookie"

export const TOKEN_COOKIE_NAME = "rentnest_token"

export function getToken() {
  return Cookies.get(TOKEN_COOKIE_NAME)
}

export function setToken(token: string) {
  Cookies.set(TOKEN_COOKIE_NAME, token, {
    expires: 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })
}

export function clearToken() {
  Cookies.remove(TOKEN_COOKIE_NAME, { path: "/" })
}
