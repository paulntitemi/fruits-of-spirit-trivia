-- Fruits of the Spirit — group play schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).

-- ── Tables ─────────────────────────────────────────────────────────────
create table if not exists public.rooms (
  code          text primary key,          -- short 4-char join code
  round         text not null,             -- RoundId the host chose
  question_ids  jsonb not null,            -- frozen, ordered shared question set
  status        text not null default 'lobby', -- lobby | playing | ended
  created_at    timestamptz not null default now()
);

create table if not exists public.groups (
  id          uuid primary key default gen_random_uuid(),
  room_code   text not null references public.rooms(code) on delete cascade,
  name        text not null,
  score       int  not null default 0,
  answered    int  not null default 0,     -- how many questions completed
  finished    bool not null default false,
  updated_at  timestamptz not null default now()
);

create index if not exists groups_room_idx on public.groups (room_code);

-- ── Row Level Security ─────────────────────────────────────────────────
-- This is a casual, unauthenticated party game: anyone with the anon key may
-- create/join rooms and update scores. No sensitive data lives here.
alter table public.rooms  enable row level security;
alter table public.groups enable row level security;

drop policy if exists rooms_all  on public.rooms;
drop policy if exists groups_all on public.groups;

create policy rooms_all  on public.rooms  for all using (true) with check (true);
create policy groups_all on public.groups for all using (true) with check (true);

-- ── Realtime ───────────────────────────────────────────────────────────
-- Push live group score changes to every subscribed device / leaderboard.
alter publication supabase_realtime add table public.groups;
alter publication supabase_realtime add table public.rooms;
