# AVNT Website — Setup Guide

## Prerequisites
- Node.js 20+
- PostgreSQL database
- Clerk account
- Railway account (for S3 storage, optional)

---

## 1. Clone & Install

```bash
git clone <repo>
cd avnt-website
npm install
```

---

## 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in all values:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | Full URL of the site |
| `CLERK_SECRET_KEY` | Clerk backend secret |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend key |
| `ADMIN_EMAILS` | Comma-separated admin emails |
| `BUCKET_ENDPOINT` | S3-compatible endpoint |
| `BUCKET_REGION` | Bucket region |
| `BUCKET_ACCESS_KEY_ID` | Bucket access key |
| `BUCKET_SECRET_ACCESS_KEY` | Bucket secret |
| `BUCKET_NAME` | Bucket name |

---

## 3. Clerk Setup

1. Create app at [clerk.com](https://clerk.com)
2. Enable Email/Password authentication
3. Copy publishable key and secret key to `.env.local`

---

## 4. Database Migration

```bash
# Generate Prisma client
npm run prisma:generate

# Create tables
npx prisma migrate dev --name init

# Or in production
npm run prisma:migrate
```

---

## 5. Seed Data

```bash
npm run prisma:seed
```

This will:
- Create admin users from `ADMIN_EMAILS`
- Add sample games, metrics, team members, etc.

---

## 6. Run Locally

```bash
npm run dev
```

- Homepage: http://localhost:3000
- Admin CMS: http://localhost:3000/admin
- Sign in: http://localhost:3000/sign-in

---

## 7. Run Tests

```bash
# Unit + integration tests
npm test

# E2E tests (requires running server)
npm run test:e2e
```

---

## 8. Deploy to Railway

1. Create a Railway project
2. Add PostgreSQL service
3. Add S3/object store service (or use Railway's native volume)
4. Set all environment variables
5. Push to GitHub — Railway auto-deploys via Nixpacks

The `nixpacks.toml` file handles:
- `npm ci` install
- `prisma generate`
- `next build`
- On start: `prisma migrate deploy` + `next start`

---

## Architecture

```
src/
├── app/
│   ├── page.tsx                    # Public homepage
│   ├── layout.tsx                  # Root layout (ClerkProvider)
│   ├── globals.css                 # Global styles
│   ├── sign-in/                    # Clerk sign-in page
│   ├── sign-up/                    # Redirects to sign-in
│   ├── admin/                      # Protected admin CMS
│   │   ├── layout.tsx              # Admin sidebar layout
│   │   ├── dashboard/              # Stats overview
│   │   ├── games/                  # Projects CRUD
│   │   ├── metrics/                # Metrics + Roblox sync
│   │   ├── operating-signals/
│   │   ├── credibility/
│   │   ├── leadership/
│   │   ├── network-links/
│   │   └── site-settings/          # Singleton form
│   └── api/
│       ├── public/                 # Unauthenticated APIs
│       │   ├── metrics/
│       │   ├── projects/
│       │   ├── operating-signals/
│       │   ├── leadership/
│       │   ├── credibility/
│       │   ├── network-links/
│       │   └── assets/[...key]/    # S3 proxy
│       └── admin/                  # Admin-only APIs
│           ├── projects/
│           ├── metrics/
│           ├── operating-signals/
│           ├── credibility/
│           ├── leadership/
│           ├── network-links/
│           ├── site-settings/
│           └── uploads/sign/
├── components/
│   ├── public/                     # Homepage sections
│   └── admin/                      # CrudTable component
├── lib/
│   ├── prisma.ts                   # Singleton Prisma client
│   ├── admin-guard.ts              # Auth guard utility
│   ├── roblox.ts                   # Roblox API integration
│   ├── s3.ts                       # S3 upload utilities
│   ├── schemas.ts                  # Zod validation schemas
│   └── public-data.ts              # Server data fetchers
└── tests/
    ├── schemas.test.ts             # Unit tests
    └── public-data.test.ts         # Integration tests
```

---

## Admin Guard Logic

A user is considered admin if:
1. Their email is in the `ADMIN_EMAILS` env variable, OR
2. Their `User.role` in the database is `ADMIN`

This is checked in:
- `src/app/admin/layout.tsx` for admin pages
- `src/lib/admin-guard.ts` for API routes
