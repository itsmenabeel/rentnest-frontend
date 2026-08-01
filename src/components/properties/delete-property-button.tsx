"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"

import { deleteLandlordProperty } from "@/lib/api/landlord-properties"
import { handleApiError } from "@/lib/api/error"
import { showSuccess } from "@/lib/utils/toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function DeletePropertyButton({
  propertyId,
  propertyTitle,
  onDeleted,
}: {
  propertyId: string
  propertyTitle: string
  onDeleted?: () => void
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteLandlordProperty(propertyId)
      showSuccess("Listing deleted.")
      setOpen(false)
      onDeleted?.()
      router.refresh()
    } catch (error) {
      handleApiError(error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="destructive"
            size="icon-sm"
            aria-label="Delete listing"
          />
        }
      >
        <Trash2 className="size-4" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
          <AlertDialogDescription>
            &quot;{propertyTitle}&quot; will be removed permanently. This
            can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting && <Loader2 className="size-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
