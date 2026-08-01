"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, Pencil, Trash2, X } from "lucide-react"

import { deleteCategory, updateCategory } from "@/lib/api/admin-categories"
import { handleApiError } from "@/lib/api/error"
import { showSuccess } from "@/lib/utils/toast"
import type { Category } from "@/lib/types/models"
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
import { Input } from "@/components/ui/input"

export function CategoryRow({ category }: { category: Category }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(category.name)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  async function handleSave() {
    const trimmed = name.trim()
    if (trimmed === category.name) {
      setEditing(false)
      return
    }

    setSaving(true)
    try {
      await updateCategory(category.id, trimmed)
      showSuccess("Category updated.")
      setEditing(false)
      router.refresh()
    } catch (error) {
      handleApiError(error)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteCategory(category.id)
      showSuccess("Category deleted.")
      setDeleteOpen(false)
      router.refresh()
    } catch (error) {
      handleApiError(error)
    } finally {
      setDeleting(false)
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
          autoFocus
        />
        <div className="flex flex-none gap-1">
          <Button
            size="icon-sm"
            variant="outline"
            onClick={handleSave}
            disabled={saving}
            aria-label="Save"
          >
            {saving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Check className="size-3.5" />
            )}
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => {
              setName(category.name)
              setEditing(false)
            }}
            disabled={saving}
            aria-label="Cancel"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
      <span className="text-sm font-medium text-foreground">
        {category.name}
      </span>
      <div className="flex flex-none gap-1">
        <Button
          size="icon-sm"
          variant="outline"
          onClick={() => setEditing(true)}
          aria-label="Edit category"
        >
          <Pencil className="size-3.5" />
        </Button>
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogTrigger
            render={
              <Button
                size="icon-sm"
                variant="destructive"
                aria-label="Delete category"
              />
            }
          >
            <Trash2 className="size-3.5" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this category?</AlertDialogTitle>
              <AlertDialogDescription>
                &quot;{category.name}&quot; will be removed. Categories still
                assigned to properties can&apos;t be deleted.
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
      </div>
    </div>
  )
}
