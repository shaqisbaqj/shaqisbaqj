-- Ledger schema
--
-- Auth model: Clerk is wired up as a Supabase third-party auth provider
-- (Supabase Dashboard -> Authentication -> Sign In / Providers -> Clerk).
-- With that in place, requests carrying a Clerk session JWT are recognized
-- natively by PostgREST/Supabase, and `auth.jwt()->>'sub'` resolves to the
-- Clerk user id. All RLS below is written against that claim — no mirrored
-- users table is needed. See lib/supabase/server.ts for how the client
-- attaches the Clerk token.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Households: the shared unit everything else hangs off of. "Shared
-- household mode" just means two Clerk users both hold a row in
-- household_members for the same household.
-- ---------------------------------------------------------------------------
create table households (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Household',
  created_at timestamptz not null default now()
);

create table household_members (
  household_id uuid not null references households (id) on delete cascade,
  user_id text not null, -- Clerk user id (auth.jwt()->>'sub')
  display_name text,
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create index household_members_user_id_idx on household_members (user_id);

-- Helper: households the calling user belongs to. `security definer` lets it
-- read household_members once and be reused across every policy below
-- without each policy re-querying under the caller's (often more
-- restrictive) row visibility.
create or replace function my_household_ids()
returns setof uuid
language sql
security definer
stable
set search_path = public
as $$
  select household_id from household_members
  where user_id = (select auth.jwt()->>'sub');
$$;

-- ---------------------------------------------------------------------------
-- Financial profile: built from the onboarding conversation. One row per
-- household; `answers` holds the free-form dialogue extraction, the typed
-- columns hold the fields the rest of the app queries directly.
-- ---------------------------------------------------------------------------
create table financial_profiles (
  household_id uuid primary key references households (id) on delete cascade,
  onboarding_complete boolean not null default false,
  income_monthly numeric(12, 2),
  pay_schedule text, -- 'weekly' | 'biweekly' | 'semimonthly' | 'monthly' | 'irregular'
  risk_notes text, -- anxieties, in the member's own words
  goals_summary text,
  answers jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Plaid linkage
-- ---------------------------------------------------------------------------
create table plaid_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households (id) on delete cascade,
  linked_by text not null, -- Clerk user id who ran Plaid Link
  plaid_item_id text not null unique,
  plaid_access_token text not null, -- store via Supabase Vault / encrypt at rest in production
  institution_id text,
  institution_name text,
  status text not null default 'active' check (status in ('active', 'error', 'revoked')),
  created_at timestamptz not null default now()
);

create table accounts (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households (id) on delete cascade,
  plaid_item_id uuid references plaid_items (id) on delete cascade,
  plaid_account_id text unique,
  name text not null,
  official_name text,
  type text not null, -- depository | credit | loan | investment
  subtype text,
  mask text,
  is_debt boolean not null default false,
  current_balance numeric(12, 2),
  available_balance numeric(12, 2),
  apr numeric(5, 2),
  iso_currency_code text default 'USD',
  updated_at timestamptz not null default now()
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households (id) on delete cascade,
  account_id uuid not null references accounts (id) on delete cascade,
  plaid_transaction_id text unique,
  amount numeric(12, 2) not null, -- Plaid convention: positive = money out
  date date not null,
  name text not null,
  merchant_name text,
  category text,
  pending boolean not null default false,
  created_at timestamptz not null default now()
);

create index transactions_household_date_idx on transactions (household_id, date desc);

-- ---------------------------------------------------------------------------
-- Goals: "Save $5k before July" -> target_amount / target_date, tracked
-- against current_amount as transactions/manual updates roll in.
-- ---------------------------------------------------------------------------
create table goals (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households (id) on delete cascade,
  name text not null,
  target_amount numeric(12, 2) not null,
  current_amount numeric(12, 2) not null default 0,
  target_date date,
  created_by text not null,
  status text not null default 'active' check (status in ('active', 'achieved', 'abandoned')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Debt War Room: debts can be linked to a synced account or entered by hand.
-- ---------------------------------------------------------------------------
create table debts (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households (id) on delete cascade,
  account_id uuid references accounts (id) on delete set null,
  name text not null,
  balance numeric(12, 2) not null,
  apr numeric(5, 2) not null default 0,
  minimum_payment numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Cash Flow Calendar: bills and paychecks laid out by date. `amount` is
-- signed — negative for a bill, positive for income — so the calendar and
-- running-balance math share one query.
-- ---------------------------------------------------------------------------
create table cash_flow_events (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households (id) on delete cascade,
  name text not null,
  amount numeric(12, 2) not null,
  event_date date not null,
  recurrence text not null default 'once' check (recurrence in ('once', 'weekly', 'biweekly', 'semimonthly', 'monthly')),
  category text,
  source text not null default 'manual' check (source in ('manual', 'plaid')),
  account_id uuid references accounts (id) on delete set null,
  created_at timestamptz not null default now()
);

create index cash_flow_events_household_date_idx on cash_flow_events (household_id, event_date);

-- ---------------------------------------------------------------------------
-- Chat: the whole household shares one thread and one financial brain.
-- ---------------------------------------------------------------------------
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households (id) on delete cascade,
  user_id text, -- null for assistant messages
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index chat_messages_household_created_idx on chat_messages (household_id, created_at);

-- ---------------------------------------------------------------------------
-- RLS: every table is scoped to "is the caller a member of this household".
-- ---------------------------------------------------------------------------
alter table households enable row level security;
alter table household_members enable row level security;
alter table financial_profiles enable row level security;
alter table plaid_items enable row level security;
alter table accounts enable row level security;
alter table transactions enable row level security;
alter table goals enable row level security;
alter table debts enable row level security;
alter table cash_flow_events enable row level security;
alter table chat_messages enable row level security;

create policy "member can read own household" on households
  for select using (id in (select my_household_ids()));

create policy "member can update own household" on households
  for update using (id in (select my_household_ids()));

create policy "member can read household roster" on household_members
  for select using (household_id in (select my_household_ids()));

-- No FK check ties this to "actually invited" — the household_id (a UUID)
-- doubles as the invite secret, shared via the /join/<household_id> link
-- from the Household page. Anyone who can insert here can only ever add
-- *themselves*, and only to a household whose id they were handed.
create policy "member can add themself to a household they were invited to" on household_members
  for insert with check (user_id = (select auth.jwt()->>'sub'));

create policy "member can leave a household" on household_members
  for delete using (user_id = (select auth.jwt()->>'sub'));

create policy "member can read household financial profile" on financial_profiles
  for select using (household_id in (select my_household_ids()));

create policy "member can write household financial profile" on financial_profiles
  for insert with check (household_id in (select my_household_ids()));

create policy "member can update household financial profile" on financial_profiles
  for update using (household_id in (select my_household_ids()));

-- plaid_items holds a raw access token, so it gets no client-facing
-- policies at all: only the service-role client (used exclusively by
-- app/api/plaid/* route handlers, never sent to the browser) can touch it.
-- RLS with zero policies denies all access under the anon/authenticated
-- roles, which is what we want here.

create policy "member can read household accounts" on accounts
  for select using (household_id in (select my_household_ids()));

create policy "member can write household accounts" on accounts
  for insert with check (household_id in (select my_household_ids()));

create policy "member can update household accounts" on accounts
  for update using (household_id in (select my_household_ids()));

create policy "member can read household transactions" on transactions
  for select using (household_id in (select my_household_ids()));

create policy "member can write household transactions" on transactions
  for insert with check (household_id in (select my_household_ids()));

create policy "member can read household goals" on goals
  for select using (household_id in (select my_household_ids()));

create policy "member can manage household goals" on goals
  for all using (household_id in (select my_household_ids()))
  with check (household_id in (select my_household_ids()));

create policy "member can read household debts" on debts
  for select using (household_id in (select my_household_ids()));

create policy "member can manage household debts" on debts
  for all using (household_id in (select my_household_ids()))
  with check (household_id in (select my_household_ids()));

create policy "member can read household cash flow events" on cash_flow_events
  for select using (household_id in (select my_household_ids()));

create policy "member can manage household cash flow events" on cash_flow_events
  for all using (household_id in (select my_household_ids()))
  with check (household_id in (select my_household_ids()));

create policy "member can read household chat" on chat_messages
  for select using (household_id in (select my_household_ids()));

create policy "member can post to household chat" on chat_messages
  for insert with check (household_id in (select my_household_ids()));
