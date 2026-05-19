-- UrProfile Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  username text unique,
  role text not null default 'individual' check (role in ('individual', 'institution', 'admin')),
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro', 'enterprise')),
  stripe_customer_id text unique,
  subscription_status text not null default 'inactive' check (subscription_status in ('active', 'inactive', 'trialing', 'past_due', 'canceled')),
  created_at timestamptz not null default now()
);

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  headline text,
  bio text,
  location text,
  film_url text,
  film_thumbnail_url text,
  landing_page_slug text unique,
  is_published boolean not null default false,
  published_at timestamptz,
  cta_label text,
  cta_url text,
  links jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- QR codes table
create table if not exists public.qr_codes (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  redirect_url text not null,
  short_code text not null unique,
  design_config jsonb,
  created_at timestamptz not null default now()
);

-- Scans table
create table if not exists public.scans (
  id uuid primary key default uuid_generate_v4(),
  qr_code_id uuid references public.qr_codes(id) on delete set null,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  scanned_at timestamptz not null default now(),
  ip_address text,
  country text,
  city text,
  device_type text,
  referrer text,
  watch_duration_seconds integer
);

-- Interview sessions table
create table if not exists public.interview_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  messages jsonb not null default '[]'::jsonb,
  story_brief text,
  script_framework text,
  shot_list text,
  status text not null default 'in_progress' check (status in ('in_progress', 'complete')),
  created_at timestamptz not null default now()
);

-- Contracts table
create table if not exists public.contracts (
  id uuid primary key default uuid_generate_v4(),
  institution_name text not null,
  contact_name text not null,
  contact_email text not null,
  tier text not null default 'enterprise' check (tier in ('free', 'pro', 'enterprise')),
  value numeric,
  status text not null default 'prospect' check (status in ('prospect', 'active', 'complete')),
  cohort_size integer,
  profiles_produced integer default 0,
  start_date date,
  end_date date,
  created_at timestamptz not null default now()
);

-- Updated_at trigger for profiles
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create user record on auth signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.qr_codes enable row level security;
alter table public.scans enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.contracts enable row level security;

-- Users policies
create policy "Users can read own record" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own record" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert own record" on public.users
  for insert with check (auth.uid() = id);

create policy "Admins can read all users" on public.users
  for select using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- Profiles policies
create policy "Users can manage own profile" on public.profiles
  for all using (auth.uid() = user_id);

create policy "Anyone can read published profiles" on public.profiles
  for select using (is_published = true);

create policy "Admins can read all profiles" on public.profiles
  for select using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- QR codes policies
create policy "Users can manage own QR codes" on public.qr_codes
  for all using (auth.uid() = user_id);

-- Scans policies (insert via service role / edge function)
create policy "Users can read own scans" on public.scans
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = scans.profile_id and p.user_id = auth.uid()
    )
  );

create policy "Service role can insert scans" on public.scans
  for insert with check (true);

-- Interview sessions policies
create policy "Users can manage own interview sessions" on public.interview_sessions
  for all using (auth.uid() = user_id);

-- Contracts policies (admin only)
create policy "Admins can manage contracts" on public.contracts
  for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- Indexes for performance
create index if not exists scans_profile_id_idx on public.scans(profile_id);
create index if not exists scans_scanned_at_idx on public.scans(scanned_at);
create index if not exists profiles_slug_idx on public.profiles(landing_page_slug);
create index if not exists qr_codes_short_code_idx on public.qr_codes(short_code);
create index if not exists users_username_idx on public.users(username);
