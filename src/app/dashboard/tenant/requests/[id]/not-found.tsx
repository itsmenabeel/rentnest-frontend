import Link from "next/link"
import { SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <SearchX className="size-6" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-semibold">
          Request not found
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          This rental request doesn&apos;t exist or isn&apos;t yours to view.
        </p>
      </div>
      <Button render={<Link href="/dashboard/tenant/requests" />}>
        Back to my requests
      </Button>
    </div>
  )
}
