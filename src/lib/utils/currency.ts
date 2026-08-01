export function formatPrice(price: string | number) {
  const value = typeof price === "string" ? Number(price) : price
  return `৳${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
}
