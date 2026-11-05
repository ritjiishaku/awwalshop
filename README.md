# AWWALSHOP

A simple product catalogue built with Next.js 16. Customers can browse and
filter published products, view full product details and contact the business
to order through WhatsApp. The protected admin area manages products,
categories and the business details used for customer inquiries.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions, `proxy.ts`)
- **TypeScript** + **Tailwind CSS v4**
- **PostgreSQL (Supabase)** via **Prisma 6**
- **NextAuth v5** (credentials + JWT sessions)
- **Cloudinary** (optional media uploads)
- **Zod** + **React Hook Form**

## Prerequisites

- Node.js **20.9+** (Node 22/24 recommended)
- A Supabase project (or Docker Desktop if you prefer a local database)

## Local setup

```bash
# 1. Install dependencies
npm install

# 2. Create your local environment file
copy .env.example .env        # Windows
# cp .env.example .env        # macOS / Linux

# 3. Add your Supabase connection strings to .env (see Environment below)

# 4. Create the schema and load the demo catalogue
npm run db:push
npm run db:seed

# 5. Start the development server
npm run dev
```

Open:

- Storefront — <http://localhost:3000>
- Catalogue admin — <http://localhost:3000/admin/login>

Admin sign-in asks for a password only. The account is selected using
`ADMIN_EMAIL`, and its password is set with `ADMIN_PASSWORD` in your `.env`
(`ADMIN_EMAIL` defaults to `admin@awwalshop.com`). Set a strong, unique
`ADMIN_PASSWORD` before seeding or deploying anywhere public.

### Environment

`.env` is ignored by Git. Start from `.env.example` and keep it in sync when
you add configuration. The app uses Supabase Postgres: the transaction pooler
for queries and the session pooler for migrations.

```env
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
DIRECT_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require"
```

Get both from **Supabase Dashboard → Project Settings → Database → Connection
string → URI**. If your network blocks outbound ports `5432`/`6543`, use a VPN
or mobile hotspot. For offline development, `docker-compose.yml` still provides
a local PostgreSQL instance on port `5434` (`npm run db:up`); point both URLs at
`localhost:5434` in that case.

Cloudinary is optional locally. Image uploads return a clear configuration
error until `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and
`CLOUDINARY_API_SECRET` are real values. External image and video URLs work
without Cloudinary.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate Prisma Client and build for production |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emitting |
| `npm run db:up` | Start the PostgreSQL container |
| `npm run db:down` | Stop the PostgreSQL container |
| `npm run db:push` | Push the Prisma schema to the database |
| `npm run db:seed` | Seed/update the demo catalogue and admin user |
| `npm run db:reset` | Drop, recreate and reseed the database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:migrate` | Create a Prisma migration (development) |

## Project structure

```text
app/
  (storefront)/       Catalogue, product details and legacy redirects to the catalogue
  admin/              Protected admin for products, categories, collections, media and settings
  api/                Auth and media upload route handlers
  opengraph-image.tsx Default social share image
components/
  admin/              Admin forms, tables and layout
  brand/              Logo assets
  storefront/         Catalogue header, product cards, gallery and filters
lib/
  actions/            Authenticated Server Actions
  auth.ts             NextAuth configuration
  db.ts               Prisma singleton
  queries.ts          Admin queries
  storefront.ts       Public catalogue queries
prisma/
  schema.prisma       Database models
  seed.ts             Idempotent demo data
proxy.ts              Admin route protection (Next.js 16 proxy convention)
```

## Production notes

- Run `prisma migrate deploy` (after creating migrations) or `npm run db:push`
  against the production database before the first build.
- Set `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`,
  `NEXT_PUBLIC_SITE_URL` and the Cloudinary credentials in the hosting
  environment. Use the Supabase pooled URLs shown above.
- The build does **not** modify the database; schema changes are explicit via
  the `db:*` scripts.
- `NEXT_PUBLIC_SITE_URL` must be the final public origin so canonical URLs,
  sitemap entries and Open Graph images resolve correctly.

## Troubleshooting

- **`Can't reach database server` (Supabase)** — your network may block outbound
  ports `5432`/`6543`. Try a VPN or mobile hotspot. For offline work, switch to
  the Docker URLs and run `npm run db:up`.
- **`Can't reach database server` (Docker)** — make sure Docker Desktop is
  running and `npm run db:up` reports the container as healthy. The host port
  is `5434`.
- **`Port 5434 is already allocated`** — another PostgreSQL container is using
  it. Stop it with `docker ps` / `docker stop <name>`, then run `npm run db:up`.
- **`Prisma Client is not generated`** — run `npm run db:generate`, or simply
  reinstall dependencies (`npm install` runs it automatically).
