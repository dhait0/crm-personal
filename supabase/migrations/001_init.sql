create extension if not exists pgcrypto;

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  project_description text not null,
  proposal_summary text not null,
  proposal_sent date not null,
  responded boolean not null default false,
  interview boolean not null default false,
  won boolean not null default false,
  status text not null default 'propuesta' check (status in ('propuesta', 'respondio', 'entrevista', 'ganada', 'perdida')),
  loss_reason text,
  source text not null default 'manual',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists opportunities_set_updated_at on public.opportunities;

create trigger opportunities_set_updated_at
before update on public.opportunities
for each row
execute function public.set_updated_at();
