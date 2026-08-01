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
      title="Something went wrong"
      description={error.message || "This page broke. Try again."}
      onRetry={() => unstable_retry()}
    />
  )
}
