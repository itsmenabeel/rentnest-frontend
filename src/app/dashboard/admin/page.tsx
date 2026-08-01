import type { Metadata } from "next"
import Link from "next/link"
import { Users } from "lucide-react"

import { getUsersServer } from "@/lib/api/admin-users.server"
import { StatCard } from "@/components/common/stat-card"

export const metadata: Metadata = {
  title: "Admin dashboard | RentNest",
}

export default async function AdminDashboardPage() {
  const users = await getUsersServer({ limit: 1 })

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
      </div>
    </div>
  )
}
