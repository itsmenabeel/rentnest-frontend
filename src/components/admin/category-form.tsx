"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, Plus } from "lucide-react"

import { createCategory } from "@/lib/api/admin-categories"
import { handleApiError } from "@/lib/api/error"
import { showSuccess } from "@/lib/utils/toast"
import {
  categorySchema,
  type CategoryValues,
} from "@/lib/validation/category.schema"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function CategoryForm() {
  const router = useRouter()

  const form = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  })

  async function onSubmit(values: CategoryValues) {
    try {
      await createCategory(values.name)
      showSuccess("Category created.")
      form.reset()
      router.refresh()
    } catch (error) {
      handleApiError(error, form.setError)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-start gap-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="New category name"
                  aria-label="New category name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          Add
        </Button>
      </form>
    </Form>
  )
}
