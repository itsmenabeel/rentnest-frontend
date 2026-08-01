type Filters = object | undefined

export const qk = {
  me: () => ["me"] as const,
  categories: () => ["categories"] as const,
  properties: (filters?: Filters) => ["properties", filters ?? {}] as const,
  property: (id: string) => ["properties", id] as const,
  reviewsByProperty: (propertyId: string) =>
    ["reviews", "property", propertyId] as const,
  landlordProperties: (filters?: Filters) =>
    ["landlord-properties", filters ?? {}] as const,
  rentals: (filters?: Filters) => ["rentals", filters ?? {}] as const,
  rental: (id: string) => ["rentals", id] as const,
  landlordRequests: (filters?: Filters) =>
    ["landlord-requests", filters ?? {}] as const,
  payments: (filters?: Filters) => ["payments", filters ?? {}] as const,
  payment: (id: string) => ["payments", id] as const,
  adminUsers: (filters?: Filters) => ["admin-users", filters ?? {}] as const,
  adminProperties: (filters?: Filters) =>
    ["admin-properties", filters ?? {}] as const,
  adminRentals: (filters?: Filters) =>
    ["admin-rentals", filters ?? {}] as const,
}
