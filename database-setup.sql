-- ============================================================
-- URGESTOP DATABASE SETUP
-- Run this in: Supabase → SQL Editor → New Query → Run
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── PROFILES (one per user) ──────────────────────────────────
create table if not exists profiles (
  id                         uuid primary key references auth.users(id) on delete cascade,
  sobriety_start_date        date,
  substance_focus            text not null default 'unspecified',
  estimated_daily_spend_usd  numeric(8,2) default 0,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

-- ── URGE LOGS (journal entries) ──────────────────────────────
create table if not exists urge_logs (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null references profiles(id) on delete cascade,
  logged_at          timestamptz not null default now(),
  intensity_raw      smallint not null default 5 check (intensity_raw between 1 and 10),
  trigger_tags       text[] not null default '{}',
  context_location   text,
  narrative          text,
  coping_used        text,
  coping_successful  boolean,
  deleted_at         timestamptz
);

-- ── PLEDGE COMPLETIONS ───────────────────────────────────────
create table if not exists pledge_completions (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references profiles(id) on delete cascade,
  completed_date  date not null default current_date,
  period          text not null check (period in ('morning','evening')),
  pledge_ids      text[] not null default '{}',
  mood_score      smallint check (mood_score between 1 and 5),
  created_at      timestamptz not null default now(),
  unique (user_id, completed_date, period)
);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
alter table profiles           enable row level security;
alter table urge_logs          enable row level security;
alter table pledge_completions enable row level security;

-- Drop existing policies if re-running
drop policy if exists "own_profile"            on profiles;
drop policy if exists "own_urge_logs"          on urge_logs;
drop policy if exists "own_pledge_completions" on pledge_completions;

create policy "own_profile"            on profiles           for all using (id = auth.uid());
create policy "own_urge_logs"          on urge_logs          for all using (user_id = auth.uid());
create policy "own_pledge_completions" on pledge_completions for all using (user_id = auth.uid());

-- ── AUTO-CREATE PROFILE ON SIGNUP ───────────────────────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── INDEXES ──────────────────────────────────────────────────
create index if not exists idx_urge_logs_user_time
  on urge_logs (user_id, logged_at desc)
  where deleted_at is null;

create index if not exists idx_pledge_completions_user_date
  on pledge_completions (user_id, completed_date desc);
