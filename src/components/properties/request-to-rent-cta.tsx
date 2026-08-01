"use client"

import Link from "next/link"
import { CircleAlert } from "lucide-react"

import { useAuthStore } from "@/lib/stores/auth-store"
import { Button } from "@/components/ui/button"
import { RequestRentalDialog } from "@/components/rentals/request-rental-dialog"

export function RequestToRentCta({
  propertyId,
  propertyTitle,
  isAvailable,
}: {
  propertyId: string
  propertyTitle: string
  isAvailable: boolean
}) {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Log in as a tenant to request this property.
        </p>
        <Button
          render={
            <Link href={`/auth/login?redirect=/properties/${propertyId}`} />
          }
          className="w-full"
        >
          Log in to request
        </Button>
      </div>
    )
  }

  if (user.role !== "TENANT") {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
        <CircleAlert className="size-4 flex-none translate-y-0.5 text-muted-foreground" />
        Only tenant accounts can request to rent a property.
      </div>
    )
  }

  if (!isAvailable) {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
        <CircleAlert className="size-4 flex-none translate-y-0.5 text-muted-foreground" />
        This property isn&apos;t accepting requests right now.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <RequestRentalDialog propertyId={propertyId} propertyTitle={propertyTitle} />
    </div>
  )
}
