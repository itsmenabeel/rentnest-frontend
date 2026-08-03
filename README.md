# RentNest Frontend

A rental property marketplace frontend built with Next.js (App Router). Landlords
list properties and manage rental requests; tenants browse listings, request to
move in, and pay securely via SSLCommerz; admins moderate the platform. The
backend is [`itsmenabeel/rentnest-backend`](https://github.com/itsmenabeel/rentnest-backend)
(Express, TypeScript, Prisma, PostgreSQL), already deployed and live.

See [`API_INTEGRATION.md`](./API_INTEGRATION.md) for the full route-to-endpoint mapping.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, Base UI primitives |
| Forms & validation | React Hook Form + Zod |
| Server state | TanStack Query |
| Client state | Zustand (auth store) |
| Auth | JWT, stored in a cookie, role-based route protection via `src/proxy.ts` |
| Payments | SSLCommerz (sandbox) |
| Deployment | Render (Node web service) |

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). By default, `.env.example`
points `NEXT_PUBLIC_API_BASE_URL` at `http://localhost:5000`. Point it at the
live backend instead to skip running the backend locally:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://rentnest-backend-bpd7.onrender.com
```

## Demo accounts

The backend's seed script creates these accounts. All demo passwords are
`Demo@123` except the admin account.

| Role | Email | Password | Notes |
| --- | --- | --- | --- |
| Admin | `admin@rentnest.com` | `Admin@123` | Ban/unban users, category CRUD, platform-wide moderation views |
| Landlord | `landlord1@rentnest.com` | `Demo@123` | Owns the Gulshan apartment, Dhanmondi studio, Mirpur sublet |
| Landlord | `landlord2@rentnest.com` | `Demo@123` | Owns the Uttara house, Banani duplex |
| Tenant | `tenant1@rentnest.com` | `Demo@123` | Has a `COMPLETED` rental (with payment and review), an `ACTIVE` rental, and a `REJECTED` request |
| Tenant | `tenant2@rentnest.com` | `Demo@123` | Has an unpaid `APPROVED` request, useful for testing the payment flow |

`ADMIN` isn't self-registrable; new signups via `/auth/register` are always
`TENANT` or `LANDLORD`.

## Features

- **Public**: browse/search/filter listings by category and price, property
  detail pages with image gallery and reviews.
- **Tenant**: request to rent, dashboard with request history, SSLCommerz
  checkout with live status polling, payment history, review submission
  (gated on a completed rental).
- **Landlord**: create/edit/delete listings with image upload, approve/reject/
  mark-completed on incoming requests (optimistic updates).
- **Admin**: ban/unban users, moderate properties and rentals, category CRUD.
- Role-based route protection, consistent toast/inline-form/error-boundary
  error handling, loading skeletons, dark mode, responsive layout.

## Deployment

This app deploys to [Render](https://render.com) as a Node web service,
matching the backend. `proxy.ts`, `next/image` optimization, and Server
Components all need a running Node process (`next start`); static hosting on
Vercel doesn't support that.

1. Push this repo to GitHub.
2. In the Render dashboard: **New +** → **Blueprint**, point it at this repo.
   [`render.yaml`](./render.yaml) defines the service (`npm ci && npm run
   build` / `npm start`).
3. Render prompts once for `NEXT_PUBLIC_API_BASE_URL`. Set it to the
   backend's live URL (`https://rentnest-backend-bpd7.onrender.com`).
4. Free-tier Render services spin down after inactivity, so the first request
   after idle time may take a few seconds to wake up (cold start), the same
   as the backend.

**Live frontend**: [Click Here](https://rentnest-frontend-xdw8.onrender.com)

**Live backend**: [Click Here (API Docs)](https://rentnest-backend-bpd7.onrender.com/api/docs/)
