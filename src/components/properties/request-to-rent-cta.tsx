import Link from "next/link"
import { CalendarCheck } from "lucide-react"

import { Button } from "@/components/ui/button"

export function RequestToRentCta({ propertyId }: { propertyId: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">
        Log in as a tenant to request this property.
      </p>
      <Button
        render={<Link href={`/auth/login?redirect=/properties/${propertyId}`} />}
        className="w-full"
      >
        <CalendarCheck className="size-4" />
        Request to rent
      </Button>
    </div>
  )
}
