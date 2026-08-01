import type { Metadata } from "next"
import Link from "next/link"
import { Building2, Inbox, Users } from "lucide-react"

import { getUsersServer } from "@/lib/api/admin-users.server"
import {
  getAdminPropertiesServer,
  getAdminRentalsServer,
} from "@/lib/api/admin-moderation.server"
import { StatCard } from "@/components/common/stat-card"

export const metadata: Metadata = {
  title: "Admin dashboard | RentNest",
}

export default async function AdminDashboardPage() {
  const [users, properties, rentals] = await Promise.all([
    getUsersServer({ limit: 1 }),
    getAdminPropertiesServer({ limit: 1 }),
    getAdminRentalsServer({ limit: 1 }),
  ])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Manage users, listings, and rentals across RentNest.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/dashboard/admin/users">
          <StatCard icon={Users} label="Total users" value={users.meta.total} />
        </Link>
        <Link href="/dashboard/admin/properties">
          <StatCard
            icon={Building2}
            label="Total listings"
            value={properties.meta.total}
          />
        </Link>
        <Link href="/dashboard/admin/rentals">
          <StatCard
            icon={Inbox}
            label="Total requests"
            value={rentals.meta.total}
          />
        </Link>
      </div>
    </div>
  )
}
