"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

import {
  createLandlordProperty,
  updateLandlordProperty,
} from "@/lib/api/landlord-properties"
import { handleApiError } from "@/lib/api/error"
import { showSuccess } from "@/lib/utils/toast"
import {
  propertyFormSchema,
  type PropertyFormValues,
} from "@/lib/validation/property.schema"
import type { Category, Property } from "@/lib/types/models"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUploadField } from "@/components/common/image-upload-field"
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function PropertyForm({
  categories,
  property,
}: {
  categories: Category[]
  property?: Property
}) {
  const router = useRouter()
  const isEdit = Boolean(property)
  const [submitting, setSubmitting] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>(
    property?.images ?? []
  )

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: property?.title ?? "",
      description: property?.description ?? "",
      location: property?.location ?? "",
      price: property ? Number(property.price) : 0,
      categoryId: property?.categoryId ?? "",
      amenities: property?.amenities.join(", ") ?? "",
      isAvailable: property?.isAvailable ?? true,
    },
  })

  async function onSubmit(values: PropertyFormValues) {
    setSubmitting(true)
    try {
      if (isEdit && property) {
        await updateLandlordProperty(
          property.id,
          values,
          files,
          existingImages
        )
        showSuccess("Listing updated.")
      } else {
        await createLandlordProperty(values, files)
        showSuccess("Listing created.")
      }
      router.push("/dashboard/landlord/properties")
    } catch (error) {
      handleApiError(error, form.setError)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Sunny 2BHK Apartment in Gulshan"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Describe the property, the neighborhood, and what makes it a good fit."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Gulshan, Dhaka" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (৳/mo)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    name={field.name}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amenities (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="WiFi, Parking, Lift" {...field} />
                </FormControl>
                <FormDescription>Comma-separated.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isAvailable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">
                Available for rent
              </FormLabel>
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <Label>Photos</Label>
          <ImageUploadField
            files={files}
            onFilesChange={setFiles}
            existingImages={existingImages}
            onExistingImagesChange={setExistingImages}
          />
        </div>

        <Button type="submit" disabled={submitting} className="w-fit">
          {submitting && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? "Save changes" : "Create listing"}
        </Button>
      </form>
    </Form>
  )
}
