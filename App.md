# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Hosts the **DM Studio** app — an Instagram DM automation tool that lets creators automate replies to commenters.

## Artifacts

- **`artifacts/dm-studio`** — React + Vite frontend (served at `/`). Original Vercel project ported from `.migration-backup/`.
- **`artifacts/api-server`** — Express API server (served at `/api`). Handles Instagram OAuth, post fetching, image proxy, admin login, settings, and webhook.

## Authentication

- User auth: Supabase (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` secrets required)
- Demo login: `parthosamadder00@gmail.com` / `0000` (bypasses Supabase, works without secrets set)
- Admin panel: JWT-based login via `/api/login` (`DASHBOARD_PASSWORD`, `JWT_SECRET` env vars)

## Key Environment Variables / Secrets Needed

- `VITE_SUPABASE_URL` — Supabase project URL (for real auth)
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key
- `INSTAGRAM_APP_ID`, `INSTAGRAM_APP_SECRET` — Instagram OAuth app credentials
- `ACCESS_TOKEN` — Instagram long-lived access token (set by OAuth flow via cookie)
- `INSTAGRAM_ACCOUNT_ID` — Instagram account ID for sending DMs
- `WEBHOOK_VERIFY_TOKEN` — Webhook verification token
- `DASHBOARD_PASSWORD`, `JWT_SECRET` — Admin panel credentials
- `APP_URL` — Public app URL (used for OAuth redirect)

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
