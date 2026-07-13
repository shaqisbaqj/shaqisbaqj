# Ledger

One financial brain for the household. Dark, brutalist-clean, chat-first.

This is thread one of a larger "life OS" — finances first, then calendar and
priorities across the rest of your roles. See the design brief in the repo
history for the full vision; this README covers what's built and how to run
it.

## Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind, deployed on Vercel
- **Auth**: Clerk, with Supabase configured as a third-party auth consumer
  (no separate Supabase session — RLS policies read the Clerk JWT directly)
- **Database**: Supabase (Postgres + Row-Level Security)
- **Bank data**: Plaid (Link, Transactions)
- **AI**: Claude via the Anthropic API, with a household's live financial
  data assembled into the system prompt on every request

## What's implemented

- **Onboarding as a conversation** (`/onboarding`) — Claude interviews a new
  household about income, bills, debt, goals, and anxieties, then writes a
  structured profile to `financial_profiles`.
- **Shared Household Mode** — a household is a `households` row plus one
  `household_members` row per person. `/household` generates a `/join/<id>`
  invite link; opening it (after sign-up) adds the second person to the same
  household. Same data, same chat, from either account.
- **The Chat** (`/chat`) — full-width, streaming, grounded in a live snapshot
  of net worth, accounts, debts, goals, and upcoming bills (`lib/financial-context.ts`).
- **Live account sync** — Plaid Link (`components/plaid/plaid-link-button.tsx`)
  → token exchange → `accounts`/`transactions` sync (`lib/plaid/sync.ts`).
- **Goal tracking** (`/goals`) — plain-English entry ("Save $5k before July")
  parsed by Claude into `{name, target_amount, target_date}`; pace math in
  `lib/goal-pace.ts` flags on/off-pace against a straight-line expectation.
- **Debt War Room** (`/debt`) — every debt in one place, avalanche vs.
  snowball payoff simulation (`lib/debt-strategy.ts`), with a strategy
  recommendation and payoff timeline.
- **Cash Flow Calendar** (`/cashflow`) — bills vs. paychecks on a month grid,
  recurrence-expanded (`lib/cashflow-calendar.ts`), with a projected running
  balance that flags tight days before they happen.
- **Design system** — near-black background, warm white text, one emerald
  accent (`tailwind.config.ts`), a persistent left rail (net worth / cash
  flow / debt) + full-width center chat + right rail (goals / bills) on
  desktop, collapsing to full-screen chat with slide-over panels on mobile
  (`components/app-shell/`).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the keys below
npm run dev
```

### 1. Clerk

Create an application at [clerk.com](https://clerk.com). Copy the
publishable/secret keys into `.env.local`. In the Clerk dashboard, enable
**Supabase** as a third-party integration (Configure → Integrations →
Supabase) — this is what lets Supabase RLS trust Clerk's session token
directly, no Supabase Auth account needed.

### 2. Supabase

Create a project, then in the dashboard under **Authentication → Sign In /
Providers**, add Clerk as a third-party auth provider (paste the Clerk
domain it gives you). Run the migration:

```bash
npx supabase link --project-ref <your-ref>
npx supabase db push   # applies supabase/migrations/0001_init.sql
```

Copy the project URL, anon key, and service role key into `.env.local`.
Optionally load `supabase/seed.sql` (after swapping in real Clerk user ids)
to preview the UI with realistic data.

### 3. Plaid

Create an app at [plaid.com](https://plaid.com), grab sandbox keys, set
`PLAID_ENV=sandbox`. In Plaid's sandbox, any test credentials (e.g.
`user_good` / `pass_good`) work in Link.

### 4. Anthropic

Set `ANTHROPIC_API_KEY`. `ANTHROPIC_MODEL` defaults to `claude-sonnet-5`.

## Architecture notes

- **Every table is RLS-scoped to household membership** via
  `my_household_ids()` (`supabase/migrations/0001_init.sql`). The one
  exception is `plaid_items`, which holds a raw access token and has no
  client-facing policies at all — it's touched exclusively by
  `lib/supabase/admin.ts` (service role) from `app/api/plaid/*` route
  handlers.
- **`getOrCreateHouseholdId()`** (`lib/household.ts`) is what turns "sign up"
  into "have a household" with no separate setup step — first authenticated
  request creates one.
- **Household invites are the household UUID itself** — shared via
  `/join/<id>`. There's no separate invite-token table; the UUID's
  unguessability is the access control, same pattern many small apps use for
  share links.
- All `(app)` routes and `/onboarding` are `force-dynamic` — this is a
  per-user financial dashboard, nothing here should be statically prerendered
  or cached across users.
