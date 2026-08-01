import { Building2, DoorOpen, Home, Layers, Users, type LucideIcon } from "lucide-react"

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  apartment: Building2,
  house: Home,
  studio: DoorOpen,
  duplex: Layers,
  sublet: Users,
}

export function getCategoryIcon(name: string): LucideIcon {
  return CATEGORY_ICONS[name.trim().toLowerCase()] ?? Building2
}
