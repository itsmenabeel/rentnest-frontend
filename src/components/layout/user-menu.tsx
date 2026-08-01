"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, LogOut } from "lucide-react"

import { clearToken } from "@/lib/auth/cookie"
import { useAuthStore } from "@/lib/stores/auth-store"
import { showSuccess } from "@/lib/utils/toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button, ButtonLink } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function UserMenu() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const clear = useAuthStore((state) => state.clear)

  if (!user) {
    return (
      <>
        <Link
          href="/auth/login"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Log in
        </Link>
        <ButtonLink href="/auth/register">Sign up</ButtonLink>
      </>
    )
  }

  function handleLogout() {
    clearToken()
    clear()
    showSuccess("Logged out.")
    router.push("/")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className="gap-2 px-1.5" />}
      >
        <Avatar size="sm">
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium sm:inline">
          {user.name.split(" ")[0]}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            render={<Link href={`/dashboard/${user.role.toLowerCase()}`} />}
          >
            <LayoutDashboard />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
