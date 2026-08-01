"use client"

import { useState } from "react"
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { handleApiError } from "@/lib/api/error"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000 },
        },
        queryCache: new QueryCache({
          onError: (error) => handleApiError(error),
        }),
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
