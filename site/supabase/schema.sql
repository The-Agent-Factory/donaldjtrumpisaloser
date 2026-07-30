-- Founding membership schema for donaldjtrumpisaloser.com
-- Run in the Supabase SQL editor.

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  stripe_customer_id text unique,
  tier text not null check (tier in ('monthly', 'annual', 'founding')),
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due')),
  is_founding boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.founding_counter (
  id int primary key default 1,
  claimed int not null default 0,
  cap int not null default 250,
  opens_at timestamptz not null default now(),
  closes_at timestamptz not null,
  constraint single_row check (id = 1)
);

insert into public.founding_counter (id, claimed, cap, closes_at)
values (1, 0, 250, now() + interval '30 days')
on conflict (id) do nothing;

create or replace function public.claim_founding_slot()
returns boolean
language plpgsql
as $$
declare
  ok boolean;
begin
  update public.founding_counter
    set claimed = claimed + 1
    where id = 1
      and claimed < cap
      and now() < closes_at
    returning true into ok;
  return coalesce(ok, false);
end;
$$;

alter table public.members enable row level security;
alter table public.founding_counter enable row level security;

create policy "counter is public read"
  on public.founding_counter for select
  using (true);
