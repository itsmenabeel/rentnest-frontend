import { AuthTabs } from "@/components/auth/auth-tabs"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px] rounded-2xl border border-border bg-card p-9 shadow-md">
        <AuthTabs />
        {children}
      </div>
    </div>
  )
}
