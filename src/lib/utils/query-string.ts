export function toQueryString(filters?: object) {
  if (!filters) return ""

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "") continue
    params.set(key, String(value))
  }

  const qs = params.toString()
  return qs ? `?${qs}` : ""
}
