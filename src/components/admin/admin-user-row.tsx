import { Ban, CircleCheck, Loader2 } from "lucide-react"

import type { User } from "@/lib/types/models"
import { formatDate } from "@/lib/utils/format-date"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"

export function AdminUserRow({
  user,
  onToggleStatus,
  isMutating,
}: {
  user: User
  onToggleStatus: () => void
  isMutating: boolean
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell className="text-muted-foreground">{user.email}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>
        <span
          className={cn(
            "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
            user.status === "ACTIVE"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400"
              : "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400"
          )}
        >
          {user.status === "ACTIVE" ? "Active" : "Banned"}
        </span>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(user.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        {user.role !== "ADMIN" && (
          <Button
            size="sm"
            variant={user.status === "ACTIVE" ? "destructive" : "outline"}
            onClick={onToggleStatus}
            disabled={isMutating}
          >
            {isMutating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : user.status === "ACTIVE" ? (
              <Ban className="size-3.5" />
            ) : (
              <CircleCheck className="size-3.5" />
            )}
            {user.status === "ACTIVE" ? "Ban" : "Unban"}
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}
