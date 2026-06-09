# Vercel Production Deployment Checklist

## 1. Prerequisites

- [ ] Supabase project created with migrations applied (`001` → `003`)
- [ ] OpenAI API key with billing enabled
- [ ] Vercel account connected to GitHub/GitLab
- [ ] Custom domain ready (optional)

## 2. Vercel Project Setup

- [ ] Import repository into Vercel
- [ ] Framework preset: **Next.js**
- [ ] Root directory: `ai-affiliate-generator` (if monorepo)
- [ ] Node.js version: **20.x**
- [ ] Build command: `npm run build`
- [ ] Output: default (Next.js App Router)

## 3. Environment Variables

Set in **Vercel → Project → Settings → Environment Variables**.

### Required (Production)

| Variable | Scope | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production only | **Secret** — server only |
| `OPENAI_API_KEY` | Production only | **Secret** — server only |
| `NEXT_PUBLIC_APP_URL` | Production | `https://your-domain.com` (no trailing slash) |

### Recommended

| Variable | Default | Purpose |
|----------|---------|---------|
| `OPENAI_MODEL` | `gpt-4o-mini` | Default AI model |
| `OPENAI_MAX_RETRIES` | `3` | API retry count |
| `OPENAI_TIMEOUT_MS` | `60000` | Request timeout |
| `GENERATION_CREDIT_COST` | `1` | Credits per generation |
| `SIGNUP_BONUS_CREDITS` | `5` | New user bonus |
| `ABUSE_GENERATION_RATE_LIMIT_RPM` | `10` | Per-user generation cap |
| `ABUSE_GENERATION_COOLDOWN_MS` | `5000` | Min gap between generations |

### Auto-set by Vercel (do not override)

- `VERCEL_ENV` — `production` | `preview` | `development`
- `VERCEL_URL` — deployment hostname
- `VERCEL_GIT_COMMIT_SHA` — commit hash

Copy full list from `.env.local.example`.

## 4. Supabase Auth Redirect URLs

In **Supabase → Authentication → URL Configuration**:

- [ ] Site URL: `https://your-domain.com`
- [ ] Redirect URLs:
  - `https://your-domain.com/auth/callback`
  - `https://*.vercel.app/auth/callback` (preview deployments)

## 5. Database Migrations

```bash
supabase db push
# or apply manually in Supabase SQL editor:
# supabase/migrations/001_initial_schema.sql
# supabase/migrations/002_credit_system.sql
# supabase/migrations/003_history_search_index.sql
```

- [ ] `profiles` table + RLS policies
- [ ] `generations` table + RLS policies
- [ ] Credit RPCs: `create_generation_with_credit`, `refund_generation_credit`

## 6. Pre-deploy Verification (Local)

```bash
cp .env.local.example .env.local
# Fill in real values
npm run lint
npm run build
npm start
```

- [ ] Login / magic link works
- [ ] Generation deducts 1 credit
- [ ] `/api/health` returns `{ "status": "ok" }`
- [ ] `/sitemap.xml` and `/robots.txt` load
- [ ] `NEXT_PUBLIC_APP_URL` matches local or staging URL

## 7. Deploy

```bash
git push origin main
# or: vercel --prod
```

- [ ] Build succeeds on Vercel
- [ ] No missing env warnings in build logs
- [ ] Production URL loads landing page

## 8. Post-deploy Smoke Tests

| Endpoint / Page | Expected |
|-----------------|----------|
| `GET /` | Landing page 200 |
| `GET /api/health` | `{ status: "ok" }` — 200 |
| `GET /login` | Login form 200 |
| `GET /dashboard` | Redirect to login if unauthenticated |
| `POST /api/generations` | 401 without auth |
| `GET /sitemap.xml` | Valid sitemap |
| `GET /robots.txt` | Disallows `/api`, `/dashboard` |

## 9. Monitoring & Logging

### Built-in

- [ ] **Vercel Runtime Logs** — structured JSON in production (`src/lib/logging`)
- [ ] **Vercel Analytics** — enabled via `@vercel/analytics`
- [ ] **Speed Insights** — enabled via `@vercel/speed-insights`
- [ ] **Health endpoint** — `GET /api/health` (use for uptime monitors)
- [ ] **Instrumentation** — `src/instrumentation.ts` logs startup + request errors

### Recommended Vercel Dashboard

- [ ] Enable **Web Analytics** in project settings
- [ ] Enable **Speed Insights** in project settings
- [ ] Configure **Log Drain** (Datadog / Axiom / Better Stack) for production
- [ ] Set up **Uptime monitor** on `/api/health` (e.g. Better Uptime, Checkly)

### Error boundaries

- [ ] `src/app/error.tsx` — route-level recovery
- [ ] `src/app/global-error.tsx` — root fallback
- [ ] `src/app/(dashboard)/error.tsx` — dashboard isolation

## 10. Security Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` — Production scope only, never `NEXT_PUBLIC_`
- [ ] `OPENAI_API_KEY` — Production scope only
- [ ] Supabase RLS enabled on all tables
- [ ] Abuse prevention active (rate limit + spam + credit guard)
- [ ] Security headers via `vercel.json`

## 11. Performance & Build

Configured in `next.config.ts`:

- [ ] `optimizePackageImports` for `lucide-react`, `@base-ui/react`
- [ ] `removeConsole` in production (keeps `error`, `warn`)
- [ ] Image formats: AVIF + WebP
- [ ] Region: `sin1` (Singapore) in `vercel.json` — change if needed

## 12. Custom Domain

- [ ] Add domain in Vercel → Domains
- [ ] Update `NEXT_PUBLIC_APP_URL` to custom domain
- [ ] Update Supabase Site URL + redirect URLs
- [ ] Redeploy after env change

## 13. Rollback Plan

- [ ] Vercel → Deployments → Promote previous deployment
- [ ] Verify `/api/health` after rollback
- [ ] Check Supabase logs for failed RPC calls

## 14. Known Production Limitations

| Item | Mitigation |
|------|------------|
| In-memory rate limits | Upgrade to Redis/Upstash for multi-instance |
| In-memory spam detection | Same — use Redis for cross-instance dedup |
| OpenAI costs | Monitor usage in OpenAI dashboard |
| Credit race conditions | Handled by PostgreSQL `FOR UPDATE` RPC |

## Quick Commands

```bash
# Deploy production
vercel --prod

# Check health
curl https://your-domain.com/api/health

# View production logs
vercel logs --prod
```
