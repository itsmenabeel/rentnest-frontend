"use client"

import { useEffect } from "react"

import { ErrorState } from "@/components/common/error-state"

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorState
      title="Couldn't load properties"
      description={error.message || "Something broke loading listings. Try again."}
      onRetry={() => unstable_retry()}
    />
  )
}
