import type { LucideIcon } from "lucide-react"

export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: number | string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <span className="flex size-10 flex-none items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="size-5" />
      </span>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}
