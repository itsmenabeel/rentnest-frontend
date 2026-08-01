"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, LayoutDashboard, LogOut, Menu } from "lucide-react"

import { clearToken } from "@/lib/auth/cookie"
import { useAuthStore } from "@/lib/stores/auth-store"
import { showSuccess } from "@/lib/utils/toast"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { UserMenu } from "@/components/layout/user-menu"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const clear = useAuthStore((state) => state.clear)

  // "List your property" only makes sense for a landlord (or a visitor who
  // isn't one yet) — a logged-in tenant/admin has nothing useful to land on.
  const listPropertyHref = !user
    ? "/auth/register"
    : user.role === "LANDLORD"
      ? "/dashboard/landlord/properties/new"
      : null

  const navLinks = [
    { href: "/properties", label: "Browse" },
    ...(listPropertyHref
      ? [{ href: listPropertyHref, label: "List your property" }]
      : []),
  ]

  function handleLogout() {
    clearToken()
    clear()
    showSuccess("Logged out.")
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 flex-none items-center justify-center rounded-[9px] bg-primary text-primary-foreground">
            <Home className="size-4.5" />
          </span>
          <span className="font-heading text-xl font-semibold text-foreground">
            RentNest
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.href && "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <UserMenu />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open menu" />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={<Link href={link.href} />}
                    className="rounded-md px-2 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    {link.label}
                  </SheetClose>
                ))}
                <div className="my-2 border-t border-border" />
                {user ? (
                  <>
                    <SheetClose
                      render={
                        <Link href={`/dashboard/${user.role.toLowerCase()}`} />
                      }
                      className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </SheetClose>
                    <SheetClose
                      render={<button type="button" onClick={handleLogout} />}
                      className="flex items-center gap-2 rounded-md px-2 py-2.5 text-left text-sm font-medium text-destructive hover:bg-muted"
                    >
                      <LogOut className="size-4" />
                      Log out
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose
                      render={<Link href="/auth/login" />}
                      className="rounded-md px-2 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      Log in
                    </SheetClose>
                    <SheetClose
                      render={<Link href="/auth/register" />}
                      className="rounded-md px-2 py-2.5 text-sm font-medium text-primary hover:bg-muted"
                    >
                      Sign up
                    </SheetClose>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
