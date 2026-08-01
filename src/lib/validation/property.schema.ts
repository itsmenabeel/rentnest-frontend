import { z } from "zod"

export const propertyFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  location: z.string().trim().min(2, "Location is required"),
  price: z.number().positive("Price must be greater than 0"),
  categoryId: z.string().min(1, "Choose a category"),
  amenities: z.string().optional(),
  isAvailable: z.boolean(),
})

export type PropertyFormValues = z.infer<typeof propertyFormSchema>
