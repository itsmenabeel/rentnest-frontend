"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function DashboardNav({
  items,
}: {
  items: { href: string; label: string }[]
}) {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border">
      {items.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
              active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
