"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { createReview } from "@/lib/api/reviews"
import { handleApiError } from "@/lib/api/error"
import { showSuccess } from "@/lib/utils/toast"
import { reviewSchema, type ReviewValues } from "@/lib/validation/review.schema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { StarRatingInput } from "@/components/reviews/star-rating-input"

export function ReviewForm({ rentalRequestId }: { rentalRequestId: string }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  })

  async function onSubmit(values: ReviewValues) {
    setSubmitting(true)
    try {
      await createReview({
        rentalRequestId,
        rating: values.rating,
        comment: values.comment || undefined,
      })
      showSuccess("Review submitted. Thanks for the feedback.")
      router.refresh()
    } catch (error) {
      handleApiError(error, form.setError)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <p className="text-sm font-medium text-foreground">Leave a review</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <StarRatingInput
                    value={field.value}
                    onChange={field.onChange}
                    disabled={submitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="How was your stay?"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Up to 1000 characters.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={submitting} className="w-fit">
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Submit review
          </Button>
        </form>
      </Form>
    </div>
  )
}
