import { DecorativeBackground } from "@/components/common/decorative-background"
import { DashboardNav } from "@/components/layout/dashboard-nav"

const navItems = [
  { href: "/dashboard/admin", label: "Overview" },
  { href: "/dashboard/admin/users", label: "Users" },
  { href: "/dashboard/admin/properties", label: "Properties" },
  { href: "/dashboard/admin/rentals", label: "Rentals" },
  { href: "/dashboard/admin/categories", label: "Categories" },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DecorativeBackground fixed className="opacity-20" />
      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-12">
        <DashboardNav items={navItems} />
        {children}
      </div>
    </>
  )
}
