
# SaaS Notes (Multi-tenant) - Complete Project

## What this contains
- Next.js frontend + API routes (host together on Vercel)
- Prisma ORM with shared-schema multi-tenancy (tenantId + slug)
- JWT auth (admin/member)
- Subscription gating: Free = 3 notes, Pro = unlimited
- Pre-seeded tenants/users (seed creates them)
- CORS enabled on API routes
- Health endpoint exposed at `/health` (rewritten to `/api/health`)

## Local setup (step-by-step)

1. Unzip and `cd` into the project:
   ```bash
   unzip saas-notes-complete.zip
   cd saas-notes-complete
   ```

2. Copy `.env.example` to `.env` and (optionally) change `JWT_SECRET`:
   ```bash
   cp .env.example .env
   ```

3. Install:
   ```bash
   npm install
   ```

4. Generate Prisma client & run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. Seed the database:
   ```bash
   npx prisma db seed
   ```

6. Start dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Test accounts (password = password)
- admin@acme.test (admin)
- user@acme.test (member)
- admin@globex.test (admin)
- user@globex.test (member)

## Deploying to Vercel (summary)
- Create a Postgres DB (Supabase / Neon) and set `DATABASE_URL` in Vercel environment variables.
- Set `JWT_SECRET` in Vercel env.
- Set the Vercel build command to:
  ```
  npx prisma generate && npx prisma migrate deploy && npx prisma db seed && next build
  ```
- Set output directory to default (Vercel will detect Next.js).
- After deployment, verify:
  - GET /health returns `{ "status": "ok" }`
  - Frontend accessible, login works, notes CRUD works.

## Notes
- Seed script uses `upsert` so it is safe to run multiple times.
- The project exposes `/api` routes and rewrites `/health` to `/api/health` using `next.config.js` (and `vercel.json` for deployment).
