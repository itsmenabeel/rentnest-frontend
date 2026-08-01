"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Theme is unknown until after hydration (next-themes reads
    // localStorage/DOM client-side only) — this flips once, deliberately
    // outside React's data flow, to avoid a server/client render mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-[27px] w-[50px] flex-none items-center rounded-full border border-border bg-card"
    >
      <Sun className="absolute left-[7px] size-3 text-muted-foreground" />
      <Moon className="absolute right-[7px] size-3 text-muted-foreground" />
      <span
        aria-hidden
        className={cn(
          "absolute top-[3px] left-[3px] size-[19px] rounded-full bg-primary shadow-sm transition-transform duration-[250ms] ease-in-out",
          isDark && "translate-x-[23px]"
        )}
      />
    </button>
  )
}
