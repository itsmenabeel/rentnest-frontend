import {
  Building2,
  Car,
  Dumbbell,
  Layers,
  ShieldCheck,
  Sofa,
  Sparkles,
  TreePine,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react"

const AMENITY_ICONS: Record<string, LucideIcon> = {
  wifi: Wifi,
  "generator backup": Zap,
  lift: Layers,
  elevator: Layers,
  security: ShieldCheck,
  parking: Car,
  garden: TreePine,
  "rooftop access": Building2,
  furnished: Sofa,
  gym: Dumbbell,
}

export function getAmenityIcon(amenity: string): LucideIcon {
  return AMENITY_ICONS[amenity.trim().toLowerCase()] ?? Sparkles
}
