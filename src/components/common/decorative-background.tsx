import { cn } from "@/lib/utils"

/** Purely decorative blurred gradient accents. Built from the existing
 * --primary/--accent tokens (not new colors), so it stays theme-aware in
 * light and dark without a separate branch.
 *
 * By default it's `absolute inset-0`, so the wrapping element needs
 * `relative` (and must NOT itself carry a max-width, or the gradient gets
 * clipped to the content column instead of spanning the viewport — give it
 * a full-bleed wrapper and put the max-width on an inner content div
 * instead). Pass `fixed` to anchor it to the viewport instead, for shells
 * (e.g. dashboards) whose content height varies per page. */
export function DecorativeBackground({
  className,
  fixed = false,
}: {
  className?: string
  fixed?: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none -z-10 overflow-hidden",
        fixed ? "fixed inset-0" : "absolute inset-0",
        className
      )}
    >
      <div className="absolute -top-24 -left-24 size-72 rounded-full bg-primary/20 blur-3xl sm:size-96" />
      <div className="absolute top-1/3 -right-16 size-64 rounded-full bg-accent/50 blur-3xl sm:size-80" />
      <div className="absolute bottom-0 left-1/3 size-56 rounded-full bg-primary/10 blur-3xl sm:size-72" />
    </div>
  )
}
