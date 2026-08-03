import { DecorativeBackground } from "@/components/common/decorative-background"
import { DashboardNav } from "@/components/layout/dashboard-nav"

const navItems = [
  { href: "/dashboard/landlord", label: "Overview" },
  { href: "/dashboard/landlord/properties", label: "My properties" },
  { href: "/dashboard/landlord/requests", label: "Requests" },
]

export default function LandlordDashboardLayout({
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
