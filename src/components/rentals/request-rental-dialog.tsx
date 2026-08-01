"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CalendarCheck, Loader2 } from "lucide-react"

import { createRentalRequest } from "@/lib/api/rentals"
import { handleApiError } from "@/lib/api/error"
import { showSuccess } from "@/lib/utils/toast"
import {
  rentalRequestSchema,
  type RentalRequestValues,
} from "@/lib/validation/rental.schema"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function RequestRentalDialog({
  propertyId,
  propertyTitle,
}: {
  propertyId: string
  propertyTitle: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<RentalRequestValues>({
    resolver: zodResolver(rentalRequestSchema),
    defaultValues: { moveInDate: "", message: "" },
  })

  async function onSubmit(values: RentalRequestValues) {
    setSubmitting(true)
    try {
      await createRentalRequest({
        propertyId,
        moveInDate: values.moveInDate || undefined,
        message: values.message || undefined,
      })
      showSuccess("Request sent. The landlord will review it soon.")
      setOpen(false)
      form.reset()
      router.push("/dashboard/tenant/requests")
    } catch (error) {
      handleApiError(error, form.setError)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full" />}>
        <CalendarCheck className="size-4" />
        Request to rent
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request to rent</DialogTitle>
          <DialogDescription>{propertyTitle}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="moveInDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Move-in date (optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message to landlord (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Introduce yourself or ask a question."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Up to 1000 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>
                Cancel
              </DialogClose>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="size-4 animate-spin" />}
                Send request
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
