import { z } from "zod"

export const rentalRequestSchema = z.object({
  moveInDate: z.string().optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(1000, "Message cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
})

export type RentalRequestValues = z.infer<typeof rentalRequestSchema>
