-- ============================================================
-- ELEVARE PORTAL — Complete Supabase Database Setup
-- Paste this entire file into your Supabase SQL Editor and Run
-- Safe to run multiple times (uses IF NOT EXISTS / OR REPLACE)
-- ============================================================

-- ── 1. PROFILES ──────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  role text not null default 'client',  -- 'client' or 'admin'
  program text,
  cohort text,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role, program, cohort)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    new.raw_user_meta_data->>'program',
    new.raw_user_meta_data->>'cohort_code'
  )
  on conflict (id) do update set
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    program   = coalesce(excluded.program,   public.profiles.program),
    cohort    = coalesce(excluded.cohort,    public.profiles.cohort);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. SESSIONS ───────────────────────────────────────────────
create table if not exists public.sessions (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  session_date date,
  session_number int,
  total_sessions int default 12,
  completed boolean default false,
  notes text,
  created_at timestamptz default now()
);

-- ── 3. ACTION ITEMS ───────────────────────────────────────────
create table if not exists public.action_items (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  due_date date,
  completed boolean default false,
  created_at timestamptz default now()
);

-- ── 4. JOURNAL ENTRIES ────────────────────────────────────────
create table if not exists public.journal_entries (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  content text not null,
  created_at timestamptz default now()
);

-- ── 5. RESOURCES (legacy) ─────────────────────────────────────
create table if not exists public.resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  url text,
  file_type text default 'link',
  client_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- ── 6. SIGNAL ENTRIES (4 Signals framework) ───────────────────
-- One row per client per signal type. Unique on (client_id, signal_type).
create table if not exists public.signal_entries (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  signal_type text not null, -- 'knowledge' | 'experience' | 'capacity' | 'risk'
  goal text,
  current_state text,
  next_step text,
  is_priority boolean default false,
  updated_at timestamptz default now(),
  unique(client_id, signal_type)
);

-- ── 7. KNOWLEDGE TRANSFER ─────────────────────────────────────
-- One row per client (who they are developing).
create table if not exists public.knowledge_transfer (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  person_name text,
  person_role text,
  knowledge_being_transferred text,
  goal text,
  next_step text,
  updated_at timestamptz default now(),
  unique(client_id)
);

-- ── 8. CLIENT FILES ───────────────────────────────────────────
-- Admin pastes shareable links (Google Drive, Dropbox, etc.)
create table if not exists public.client_files (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  url text not null,
  description text,
  file_type text default 'link',
  created_at timestamptz default now()
);

-- ── 9. COACH NOTES ────────────────────────────────────────────
create table if not exists public.client_notes (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_by text,
  created_at timestamptz default now()
);

-- ── 10. COHORT CODES ──────────────────────────────────────────
-- Admin creates codes; clients use them to self-register via the portal.
create table if not exists public.cohort_codes (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  program text,
  active boolean default true,
  created_at timestamptz default now()
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────

alter table public.profiles       enable row level security;
alter table public.sessions       enable row level security;
alter table public.action_items   enable row level security;
alter table public.journal_entries enable row level security;
alter table public.resources      enable row level security;
alter table public.signal_entries enable row level security;
alter table public.knowledge_transfer enable row level security;
alter table public.client_files   enable row level security;
alter table public.client_notes   enable row level security;
alter table public.cohort_codes   enable row level security;

-- Helper: is the current user an admin? (security definer avoids RLS recursion)
create or replace function public.is_admin()
returns boolean as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  )
$$ language sql security definer stable;

-- ── PROFILES ──
drop policy if exists "Own profile"            on public.profiles;
drop policy if exists "Update own profile"     on public.profiles;
drop policy if exists "Admin insert profiles"  on public.profiles;

create policy "Own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "Update own profile" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

create policy "Admin insert profiles" on public.profiles
  for insert with check (public.is_admin() or auth.uid() = id);

-- ── SESSIONS ──
drop policy if exists "Client view sessions"  on public.sessions;
drop policy if exists "Admin manage sessions" on public.sessions;

create policy "Client view sessions" on public.sessions
  for select using (auth.uid() = client_id or public.is_admin());

create policy "Admin manage sessions" on public.sessions
  for all using (public.is_admin());

-- ── ACTION ITEMS ──
drop policy if exists "Client view tasks"   on public.action_items;
drop policy if exists "Client update tasks" on public.action_items;
drop policy if exists "Admin manage tasks"  on public.action_items;

create policy "Client view tasks" on public.action_items
  for select using (auth.uid() = client_id or public.is_admin());

create policy "Client update tasks" on public.action_items
  for update using (auth.uid() = client_id);

create policy "Admin manage tasks" on public.action_items
  for all using (public.is_admin());

-- ── JOURNAL ──
drop policy if exists "Client manage journal" on public.journal_entries;

create policy "Client manage journal" on public.journal_entries
  for all using (auth.uid() = client_id);

-- ── RESOURCES ──
drop policy if exists "Client view resources" on public.resources;
drop policy if exists "Admin manage resources" on public.resources;

create policy "Client view resources" on public.resources
  for select using (client_id = auth.uid() or client_id is null or public.is_admin());

create policy "Admin manage resources" on public.resources
  for all using (public.is_admin());

-- ── SIGNAL ENTRIES ──
drop policy if exists "Client manage signals" on public.signal_entries;

create policy "Client manage signals" on public.signal_entries
  for all using (auth.uid() = client_id or public.is_admin());

-- ── KNOWLEDGE TRANSFER ──
drop policy if exists "Client manage transfer" on public.knowledge_transfer;

create policy "Client manage transfer" on public.knowledge_transfer
  for all using (auth.uid() = client_id or public.is_admin());

-- ── CLIENT FILES ──
drop policy if exists "Client view files"   on public.client_files;
drop policy if exists "Admin manage files"  on public.client_files;

create policy "Client view files" on public.client_files
  for select using (auth.uid() = client_id or public.is_admin());

create policy "Admin manage files" on public.client_files
  for all using (public.is_admin());

-- ── COACH NOTES ──
drop policy if exists "Admin manage notes" on public.client_notes;
drop policy if exists "Client view notes"  on public.client_notes;

create policy "Admin manage notes" on public.client_notes
  for all using (public.is_admin());

create policy "Client view notes" on public.client_notes
  for select using (auth.uid() = client_id);

-- ── COHORT CODES ──
drop policy if exists "Anyone can read active codes" on public.cohort_codes;
drop policy if exists "Admin manage codes"           on public.cohort_codes;

-- Unauthenticated visitors can read active codes (needed for self-signup validation)
create policy "Anyone can read active codes" on public.cohort_codes
  for select using (active = true or public.is_admin());

create policy "Admin manage codes" on public.cohort_codes
  for all using (public.is_admin());

-- ── DONE ─────────────────────────────────────────────────────
-- After running this:
-- 1. Go to Supabase Auth > Users and create your admin account manually,
--    OR sign up via the portal and then run:
--
--    update public.profiles set role = 'admin' where email = 'your@email.com';
--
-- 2. To create cohort codes for self-signup, log into the admin panel
--    and use the Cohort Codes section.
