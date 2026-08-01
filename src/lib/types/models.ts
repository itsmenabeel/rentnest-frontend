export type Role = "TENANT" | "LANDLORD" | "ADMIN"
export type UserStatus = "ACTIVE" | "BANNED"

export interface Category {
  id: string
  name: string
}

export interface LandlordSummary {
  id: string
  name: string
  email: string
  phone: string | null
  role: Role
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export interface Property {
  id: string
  title: string
  description: string
  location: string
  /** Prisma Decimal, serialized as a string over the wire. */
  price: string
  amenities: string[]
  images: string[]
  isAvailable: boolean
  createdAt: string
  updatedAt: string
  landlordId: string
  landlord: LandlordSummary
  categoryId: string
  category: Category
}

export interface ReviewTenant {
  id: string
  name: string
}

export interface ReviewProperty {
  id: string
  title: string
}

export interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  tenant: ReviewTenant
  property: ReviewProperty
}
