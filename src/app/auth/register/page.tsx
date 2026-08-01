import type { Metadata } from "next"
import { Suspense } from "react"

import { AuthFormSkeleton } from "@/components/auth/auth-form-skeleton"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Sign up | RentNest",
  description: "Create a RentNest account as a tenant or a landlord.",
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton fields={4} />}>
      <RegisterForm />
    </Suspense>
  )
}
