import { DecorativeBackground } from "@/components/common/decorative-background"
import { DashboardNav } from "@/components/layout/dashboard-nav"

const navItems = [
  { href: "/dashboard/tenant", label: "Overview" },
  { href: "/dashboard/tenant/requests", label: "My requests" },
  { href: "/dashboard/tenant/payments", label: "Payments" },
]

export default function TenantDashboardLayout({
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
