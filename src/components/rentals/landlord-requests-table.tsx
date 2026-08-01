"use client"

import { useCallback, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { Inbox } from "lucide-react"

import {
  getLandlordRequests,
  updateRentalStatus,
  type LandlordRequestFilters,
} from "@/lib/api/landlord-rentals"
import type { RentalsResponse } from "@/lib/api/rentals"
import { handleApiError } from "@/lib/api/error"
import { showSuccess } from "@/lib/utils/toast"
import type { RentalRequestStatus } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/common/empty-state"
import { PaginationControl } from "@/components/common/pagination-control"
import { LandlordRequestRow } from "@/components/rentals/landlord-request-row"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const LANDLORD_REQUESTS_KEY = "landlord-requests"

const STATUS_OPTIONS: { value: RentalRequestStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
]

const STATUS_TOAST: Record<string, string> = {
  APPROVED: "Request approved.",
  REJECTED: "Request rejected.",
  COMPLETED: "Marked as completed.",
}

export function LandlordRequestsTable({
  initialData,
  initialFilters,
}: {
  initialData: RentalsResponse
  initialFilters: LandlordRequestFilters
}) {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<LandlordRequestFilters>(
    initialFilters
  )

  const isInitialFilters =
    JSON.stringify(filters) === JSON.stringify(initialFilters)
  const queryKey = [LANDLORD_REQUESTS_KEY, filters]

  const { data, isFetching } = useQuery({
    queryKey,
    queryFn: () => getLandlordRequests(filters),
    initialData: isInitialFilters ? initialData : undefined,
    placeholderData: keepPreviousData,
  })

  const mutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: "APPROVED" | "REJECTED" | "COMPLETED"
    }) => updateRentalStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<RentalsResponse>(queryKey)

      if (previous) {
        queryClient.setQueryData<RentalsResponse>(queryKey, {
          ...previous,
          rentals: previous.rentals.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        })
      }

      return { previous }
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
      handleApiError(error)
    },
    onSuccess: (_data, { status }) => {
      showSuccess(STATUS_TOAST[status] ?? "Request updated.")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [LANDLORD_REQUESTS_KEY] })
    },
  })

  const updateFilters = useCallback(
    (next: Partial<LandlordRequestFilters>) => {
      const merged: LandlordRequestFilters = {
        ...filters,
        ...next,
        page: next.page ?? 1,
      }
      setFilters(merged)

      const params = new URLSearchParams()
      Object.entries(merged).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== "" &&
          !(key === "page" && value === 1)
        ) {
          params.set(key, String(value))
        }
      })
      router.replace(`${pathname}${params.toString() ? `?${params}` : ""}`, {
        scroll: false,
      })
    },
    [filters, pathname, router]
  )

  const result = data ?? initialData

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={filters.status ?? "all"}
        onValueChange={(value) =>
          updateFilters({
            status:
              value === "all" ? undefined : (value as RentalRequestStatus),
          })
        }
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div
        className={cn(
          "flex flex-col gap-4 transition-opacity duration-200",
          isFetching && "opacity-60"
        )}
      >
        {result.rentals.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No requests found"
            description="Try a different status filter."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.rentals.map((rental) => (
                  <LandlordRequestRow
                    key={rental.id}
                    rental={rental}
                    onApprove={() =>
                      mutation.mutate({ id: rental.id, status: "APPROVED" })
                    }
                    onReject={() =>
                      mutation.mutate({ id: rental.id, status: "REJECTED" })
                    }
                    onMarkCompleted={() =>
                      mutation.mutate({ id: rental.id, status: "COMPLETED" })
                    }
                    isMutating={
                      mutation.isPending &&
                      mutation.variables?.id === rental.id
                    }
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <PaginationControl
          page={result.meta.page}
          totalPages={result.meta.totalPages}
          onPageChange={(page) => updateFilters({ page })}
        />
      </div>
    </div>
  )
}
