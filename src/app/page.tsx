import Link from "next/link"
import { CreditCard, Handshake, Home as HomeIcon, Search, ShieldCheck } from "lucide-react"

import { getCategoriesServer } from "@/lib/api/categories.server"
import { getPropertiesServer } from "@/lib/api/properties.server"
import { ButtonLink } from "@/components/ui/button"
import { CategoryPills } from "@/components/properties/category-pills"
import { DecorativeBackground } from "@/components/common/decorative-background"
import { EmptyState } from "@/components/common/empty-state"
import { PropertyGrid } from "@/components/properties/property-grid"

const valueProps = [
  {
    icon: ShieldCheck,
    title: "Verified listings",
    description:
      "Every landlord verifies ownership before a listing goes live.",
  },
  {
    icon: Handshake,
    title: "No broker fees",
    description: "Message landlords directly and skip the middleman markup.",
  },
  {
    icon: CreditCard,
    title: "Secure payments",
    description:
      "Pay rent through SSLCommerz and track every transaction in your dashboard.",
  },
]

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getPropertiesServer({ limit: 6 }),
    getCategoriesServer(),
  ])

  return (
    <div>
      <section className="relative flex flex-col items-center gap-4 overflow-hidden px-4 py-20 text-center sm:px-6 sm:py-28">
        <DecorativeBackground />
        <h1 className="max-w-2xl font-heading text-4xl font-semibold leading-tight sm:text-5xl">
          Renting in Dhaka, made simple
        </h1>
        <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
          Browse verified rental listings, request to move in, and pay
          securely. No broker in the middle.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink size="lg" href="/properties">
            <Search className="size-4" />
            Browse properties
          </ButtonLink>
          <ButtonLink size="lg" variant="outline" href="/auth/register">
            <HomeIcon className="size-4" />
            List your property
          </ButtonLink>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[90rem] px-4 py-12 sm:px-6 lg:px-12">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-heading text-2xl font-semibold">
            Featured homes
          </h2>
          <Link
            href="/properties"
            className="text-sm font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            View all properties
          </Link>
        </div>
        {featured.properties.length === 0 ? (
          <EmptyState
            title="No listings yet"
            description="Check back soon, or list your own property."
          />
        ) : (
          <PropertyGrid properties={featured.properties} />
        )}
      </section>

      {categories.length > 0 && (
        <section className="mx-auto w-full max-w-[90rem] px-4 py-12 sm:px-6 lg:px-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold">
            Browse by category
          </h2>
          <CategoryPills categories={categories} />
        </section>
      )}

      <section className="relative overflow-hidden py-16">
        <DecorativeBackground className="opacity-60" />
        <div className="relative mx-auto grid w-full max-w-[90rem] grid-cols-1 gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-12">
          {valueProps.map((prop) => (
            <div key={prop.title} className="group flex flex-col gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-transform duration-200 group-hover:-translate-y-0.5">
                <prop.icon className="size-4.5" />
              </span>
              <h3 className="text-base font-semibold text-foreground">
                {prop.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
