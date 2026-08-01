import type { Metadata } from "next"
import { Suspense } from "react"

import { AuthFormSkeleton } from "@/components/auth/auth-form-skeleton"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Log in | RentNest",
  description: "Log in to your RentNest account.",
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton fields={2} />}>
      <LoginForm />
    </Suspense>
  )
}
