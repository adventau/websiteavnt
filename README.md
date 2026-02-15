# AVNT Website

Production-ready AVNT platform built with Next.js App Router, Tailwind CSS, PostgreSQL + Prisma, Clerk auth, and Railway bucket uploads.

## Tech Stack
- Next.js (App Router)
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Clerk authentication
- Railway (web + Postgres + bucket)

## Local Setup
1. Copy env file:
```bash
cp .env.example .env
```
2. Install dependencies:
```bash
npm install
```
3. Generate Prisma client and migrate:
```bash
npm run prisma:generate
npm run prisma:migrate
```
4. Seed content:
```bash
npm run prisma:seed
```
5. Start dev server:
```bash
npm run dev
```

## Required Environment Variables
- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `ADMIN_EMAILS`
- `BUCKET_ENDPOINT`
- `BUCKET_REGION`
- `BUCKET_ACCESS_KEY_ID`
- `BUCKET_SECRET_ACCESS_KEY`
- `BUCKET_NAME`

## Deployment on Railway
1. Create Railway project.
2. Provision PostgreSQL service and copy connection string to `DATABASE_URL`.
3. Provision Storage Bucket and set bucket-related env vars.
4. Add Clerk env keys.
5. Deploy from repo.
6. Run migration + seed once:
```bash
npm run prisma:migrate
npm run prisma:seed
```

## API Endpoints
### Public
- `GET /api/public/metrics`
- `GET /api/public/projects`
- `GET /api/public/operating-signals`
- `GET /api/public/leadership`
- `GET /api/public/credibility`
- `GET /api/public/network-links`

### Admin
- CRUD routes under `/api/admin/*` for: projects, metrics, operating-signals, credibility, leadership, network-links
- Reorder routes under `/api/admin/*/reorder`
- Upload signing: `POST /api/admin/uploads/sign`

## Tests
- Unit + integration: `npm test`
- E2E: `npm run test:e2e`
