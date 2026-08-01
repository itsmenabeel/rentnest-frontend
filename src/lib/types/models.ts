export type Role = "TENANT" | "LANDLORD" | "ADMIN"
export type UserStatus = "ACTIVE" | "BANNED"

export interface Category {
  id: string
  name: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  role: Role
  status: UserStatus
  createdAt: string
  updatedAt: string
}

/** Alias kept for call-site clarity where a property's landlord is read. */
export type LandlordSummary = User

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

export type RentalRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"

export type PaymentProvider = "SSLCOMMERZ"
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED"

/** The backend's rentals/payments modules select a slimmer user shape
 * (no createdAt/updatedAt) than properties.service.ts's propertyInclude. */
export interface RentalUserSummary {
  id: string
  name: string
  email: string
  phone: string | null
  role: Role
  status: UserStatus
}

export interface RentalProperty extends Omit<Property, "landlord"> {
  landlord: RentalUserSummary
}

export interface PaymentSummary {
  id: string
  transactionId: string
  amount: string
  provider: PaymentProvider
  status: PaymentStatus
  paidAt: string | null
  createdAt: string
  updatedAt: string
  rentalRequestId: string
}

export interface RentalReviewSummary {
  id: string
  rating: number
  comment: string | null
  createdAt: string
}

export interface RentalRequest {
  id: string
  status: RentalRequestStatus
  moveInDate: string | null
  message: string | null
  createdAt: string
  updatedAt: string
  tenantId: string
  tenant: RentalUserSummary
  propertyId: string
  property: RentalProperty
  payment: PaymentSummary | null
  review: RentalReviewSummary | null
}

/** The rentalRequest nested inside a Payment (paymentInclude) never itself
 * nests payment/review, so it's a narrower shape than RentalRequest. */
export interface PaymentRentalRequest {
  id: string
  status: RentalRequestStatus
  moveInDate: string | null
  message: string | null
  createdAt: string
  updatedAt: string
  tenantId: string
  tenant: RentalUserSummary
  propertyId: string
  property: RentalProperty
}

export interface Payment extends PaymentSummary {
  rentalRequest: PaymentRentalRequest
}
