"use client"

import { CreditCard, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export function PayNowButton({
  onClick,
  isPending,
}: {
  onClick: () => void
  isPending: boolean
}) {
  return (
    <Button onClick={onClick} disabled={isPending} className="w-full">
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <CreditCard className="size-4" />
      )}
      Pay now
    </Button>
  )
}
