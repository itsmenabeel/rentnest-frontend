import { apiFetch } from "@/lib/api/client"
import type { Role, User } from "@/lib/types/models"

export interface AuthResult {
  user: User
  token: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  phone?: string
  role: Extract<Role, "TENANT" | "LANDLORD">
}

export interface LoginInput {
  email: string
  password: string
}

export function registerAccount(input: RegisterInput) {
  return apiFetch<AuthResult>("/api/auth/register", {
    method: "POST",
    body: input,
  })
}

export function login(input: LoginInput) {
  return apiFetch<AuthResult>("/api/auth/login", {
    method: "POST",
    body: input,
  })
}

export function getMe() {
  return apiFetch<User>("/api/auth/me")
}
