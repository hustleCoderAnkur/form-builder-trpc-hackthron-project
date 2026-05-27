# formFactory — tRPC Monorepo

Production-style form builder SaaS (Turborepo + Next.js + Express + tRPC + Drizzle).

## Quick start

```bash
pnpm install
docker compose up -d          # PostgreSQL
cp .env.example .env          # set DATABASE_URL, JWT_SECRET
pnpm db:migrate
pnpm db:seed                  # demo data
pnpm dev                      # web :3000, api :8000
```

## Demo credentials (after seed)

| | |
|---|---|
| Email | `demo@formFactory.dev` |
| Password | `demo1234` |
| Public form | https://form-builder-trpc-hackthron-project.vercel.app/f/cyberpunk-fan-survey-demo |

## Apps

| App | URL |
|-----|-----|
| Web | https://form-builder-trpc-hackthron-project.vercel.app/ |
| API health | https://form-builder-trpc-hackthron-project-1.onrender.com/health |
| Scalar API docs | https://form-builder-trpc-hackthron-project.vercel.app/docs |
| REST API |https://form-builder-trpc-hackthron-project-1.onrender.com/api/v1 |

## Architecture

- `apps/web` — Next.js UI (tRPC client → `/trpc` proxy)
- `apps/api` — Express + tRPC + REST + Scalar
- `packages/trpc` — routers + Zod validation
- `packages/services` — business logic
- `packages/database` — Drizzle schema + migrations + seed

## Env

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dev
JWT_SECRET=change-me
WEB_URL=https://form-builder-trpc-hackthron-project.vercel.app/
API_URL=https://form-builder-trpc-hackthron-project-1.onrender.com
# Optional: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
```
