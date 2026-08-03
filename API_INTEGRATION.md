# API Integration

Maps every frontend route/component to the backend endpoint(s) it calls.
Backend: `itsmenabeel/rentnest-backend` (Express/TypeScript/Prisma/Postgres).

- **Base URL**: `NEXT_PUBLIC_API_BASE_URL` (origin only: every path below
  already includes `/api/...`).
- **Auth**: stateless JWT. The client stores the token returned by
  login/register in a cookie and sends it as `Authorization: Bearer <token>`
  on every authenticated request (see `src/proxy.ts` and `src/lib/api/client.ts`).
- **Response envelope**: success → `{ success: true, message, data }`;
  error → `{ success: false, message, errorDetails: [{ path, message }] }`.
  Every API call is parsed through the same client (`src/lib/api/client.ts`),
  so field-level `errorDetails` map directly onto form inputs.

## Public

| Frontend route/component | Backend endpoint(s) |
|---|---|
| `/`: home (hero search, featured properties) | `GET /api/properties?limit=6`, `GET /api/categories` |
| `/properties`: browse & filter | `GET /api/properties` (`location`, `search`, `categoryId`, `minPrice`, `maxPrice`, `page`, `limit`), `GET /api/categories` |
| `/properties/[id]`: details, gallery, reviews | `GET /api/properties/:id`, `GET /api/reviews/property/:id` |

## Auth

| Frontend route/component | Backend endpoint(s) |
|---|---|
| `/auth/register`: role-toggle signup form | `POST /api/auth/register` |
| `/auth/login`: login form | `POST /api/auth/login` |
| Navbar auth state / session hydration | `GET /api/auth/me` |

## Tenant

| Frontend route/component | Backend endpoint(s) |
|---|---|
| "Request to rent" CTA on `/properties/[id]` | `POST /api/rentals` |
| `/dashboard/tenant`: overview | `GET /api/rentals?limit=5`, `GET /api/payments?limit=5` |
| `/dashboard/tenant/requests`: request history | `GET /api/rentals` |
| `/dashboard/tenant/requests/[id]`: detail, review form | `GET /api/rentals/:id`, `POST /api/reviews` |
| `/dashboard/tenant/requests/[id]/pay`: payment initiation + status polling | `GET /api/rentals/:id`, `POST /api/payments/create`, `GET /api/payments/:id` |
| `/dashboard/tenant/payments`: payment history | `GET /api/payments` |
| `/payment/success`, `/payment/cancel` | `GET /api/rentals/:id` (receipt context) |

## Landlord

| Frontend route/component | Backend endpoint(s) |
|---|---|
| `/dashboard/landlord`: overview | `GET /api/landlord/properties`, `GET /api/landlord/requests?limit=5` |
| `/dashboard/landlord/properties`: my listings | `GET /api/landlord/properties` |
| `/dashboard/landlord/properties/new`: create listing (multipart) | `GET /api/categories`, `POST /api/landlord/properties` |
| `/dashboard/landlord/properties/[id]/edit`: edit/delete | `GET /api/properties/:id`, `PUT /api/landlord/properties/:id`, `DELETE /api/landlord/properties/:id` |
| `/dashboard/landlord/requests`: approve/reject/mark-completed | `GET /api/landlord/requests`, `PATCH /api/landlord/requests/:id` (`{status: APPROVED\|REJECTED}` from `PENDING`, or `{status: COMPLETED}` from `ACTIVE`) |

## Admin

| Frontend route/component | Backend endpoint(s) |
|---|---|
| `/dashboard/admin`: platform overview | `GET /api/admin/users`, `GET /api/admin/properties`, `GET /api/admin/rentals` |
| `/dashboard/admin/users`: ban/unban | `GET /api/admin/users`, `PATCH /api/admin/users/:id` |
| `/dashboard/admin/properties`: moderation | `GET /api/admin/properties` |
| `/dashboard/admin/rentals`: moderation | `GET /api/admin/rentals` |
| `/dashboard/admin/categories`: category CRUD | `GET /api/categories`, `POST /api/admin/categories`, `PUT /api/admin/categories/:id`, `DELETE /api/admin/categories/:id` |

## Notes

- This project added `GET /api/landlord/properties` and a `COMPLETED` status
  on `PATCH /api/landlord/requests/:id` to the backend (originally missing:
  no way for a landlord to list their own listings, or for a rental to reach
  `COMPLETED`, which reviews require). Both are live now.
- Payments use SSLCommerz. `.../pay` opens checkout in a new tab (a real link,
  so it's never blocked as a popup); the original tab polls
  `GET /api/payments/:id` for the status change instead of relying on
  SSLCommerz's redirect, which posts straight to the backend
  (`/api/payments/confirm`) and returns raw JSON rather than redirecting to
  any frontend page.
