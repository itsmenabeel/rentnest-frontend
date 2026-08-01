import { z } from "zod"

export const reviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Choose a rating")
    .max(5, "Choose a rating"),
  comment: z
    .string()
    .trim()
    .max(1000, "Comment cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
})

export type ReviewValues = z.infer<typeof reviewSchema>
