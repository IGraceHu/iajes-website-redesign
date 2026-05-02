create extension if not exists pgcrypto;

create table if not exists public.webinars (
  id uuid primary key default gen_random_uuid(),
  legacy_id integer unique,
  title text not null,
  date_text text not null default '',
  subtitle text not null default '',
  thumbnail text not null default '',
  primary_video text not null default '',
  overview jsonb not null default '[]'::jsonb,
  highlights jsonb not null default '[]'::jsonb,
  speakers jsonb not null default '[]'::jsonb,
  extra_recordings jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  links jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists webinars_created_at_idx on public.webinars (created_at desc);

create or replace function public.set_webinars_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_webinars_updated_at on public.webinars;

create trigger set_webinars_updated_at
before update on public.webinars
for each row
execute function public.set_webinars_updated_at();
