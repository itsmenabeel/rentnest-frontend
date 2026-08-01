import { SearchX } from "lucide-react"

import { ButtonLink } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <SearchX className="size-6" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-semibold">
          Page not found
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          This page doesn&apos;t exist.
        </p>
      </div>
      <ButtonLink href="/">Back to home</ButtonLink>
    </div>
  )
}
