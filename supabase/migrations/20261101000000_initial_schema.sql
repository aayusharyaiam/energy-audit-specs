-- BIT Patna Energy Audit — initial Supabase schema
-- Apply with the Supabase CLI, then create the first auth user and grant its
-- admin profile manually. Never expose a service-role key in the browser.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role = 'admin'),
  created_at timestamptz not null default now()
);

create table if not exists public.areas (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.meters (
  id uuid primary key default gen_random_uuid(),
  area_id uuid not null references public.areas(id) on delete restrict,
  label text not null,
  unit text not null default 'kWh' check (unit = 'kWh'),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (area_id, label)
);

create table if not exists public.daily_readings (
  id uuid primary key default gen_random_uuid(),
  reading_date date not null,
  area_id uuid not null references public.areas(id) on delete restrict,
  meter_id uuid references public.meters(id) on delete restrict,
  reading_type text not null check (reading_type in ('cumulative', 'daily_consumption')),
  value_kwh numeric(14, 3) not null check (value_kwh >= 0),
  source text not null default 'manual' check (source in ('manual', 'historical_import')),
  verification_status text not null default 'needs_review'
    check (verification_status in ('needs_review', 'verified', 'disputed')),
  notes text check (char_length(notes) <= 500),
  published boolean not null default false,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cumulative_reading_requires_meter
    check (reading_type <> 'cumulative' or meter_id is not null)
);

create unique index if not exists daily_readings_meter_date_type_key
  on public.daily_readings (meter_id, reading_date, reading_type)
  where meter_id is not null;

create unique index if not exists daily_readings_unmetered_area_date_type_key
  on public.daily_readings (area_id, reading_date, reading_type)
  where meter_id is null;

create index if not exists daily_readings_public_timeline_idx
  on public.daily_readings (reading_date desc)
  where published = true;

create table if not exists public.monthly_bills (
  id uuid primary key default gen_random_uuid(),
  month date not null,
  area_id uuid not null references public.areas(id) on delete restrict,
  consumption_kwh numeric(14, 3) not null check (consumption_kwh >= 0),
  amount_inr numeric(14, 2) not null check (amount_inr >= 0),
  source text not null default 'manual' check (source in ('manual', 'historical_import')),
  verification_status text not null default 'needs_review'
    check (verification_status in ('needs_review', 'verified', 'disputed')),
  notes text check (char_length(notes) <= 500),
  published boolean not null default false,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (area_id, month),
  constraint month_is_first_calendar_day check (extract(day from month) = 1)
);

create index if not exists monthly_bills_public_timeline_idx
  on public.monthly_bills (month desc)
  where published = true;

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  table_name text not null,
  row_id uuid not null,
  action text not null check (action in ('insert', 'update', 'delete', 'publish', 'unpublish', 'import')),
  changed_at timestamptz not null default now(),
  before_json jsonb,
  after_json jsonb
);

insert into public.areas (code, name, sort_order)
values
  ('campus_total', 'Campus total', 0),
  ('pump_room', 'Pump room', 10),
  ('faculty_quarters', 'Faculty quarters', 20),
  ('hostels', 'Hostels', 30),
  ('guest_house', 'Guest house', 40),
  ('outdoor_lighting', 'Street and court lighting', 50),
  ('campus_services', 'Campus services', 60),
  ('academic_block', 'Academic block', 70)
on conflict (code) do update
set name = excluded.name,
    sort_order = excluded.sort_order;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists daily_readings_set_updated_at on public.daily_readings;
create trigger daily_readings_set_updated_at
before update on public.daily_readings
for each row execute function public.set_updated_at();

drop trigger if exists monthly_bills_set_updated_at on public.monthly_bills;
create trigger monthly_bills_set_updated_at
before update on public.monthly_bills
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.areas enable row level security;
alter table public.meters enable row level security;
alter table public.daily_readings enable row level security;
alter table public.monthly_bills enable row level security;
alter table public.audit_events enable row level security;

-- Reference data is public. Active meters are visible so published readings
-- can retain meaningful labels.
create policy "areas are publicly readable"
  on public.areas for select
  to anon, authenticated
  using (true);

create policy "admins manage areas"
  on public.areas for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "active meters are publicly readable"
  on public.meters for select
  to anon, authenticated
  using (active or public.is_admin());

create policy "admins manage meters"
  on public.meters for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Anonymous visitors can never see drafts. Authenticated users still need an
-- explicit profiles.role='admin' row to read or mutate unpublished records.
create policy "published readings are publicly readable"
  on public.daily_readings for select
  to anon, authenticated
  using (published or public.is_admin());

create policy "admins manage readings"
  on public.daily_readings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin() and created_by = (select auth.uid()));

create policy "published bills are publicly readable"
  on public.monthly_bills for select
  to anon, authenticated
  using (published or public.is_admin());

create policy "admins manage bills"
  on public.monthly_bills for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin() and created_by = (select auth.uid()));

create policy "admins read profiles"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

create policy "admins manage audit events"
  on public.audit_events for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.areas, public.meters, public.daily_readings, public.monthly_bills
  to anon, authenticated;
grant insert, update, delete on public.areas, public.meters, public.daily_readings,
  public.monthly_bills, public.audit_events to authenticated;
grant select on public.profiles, public.audit_events to authenticated;

-- Bootstrap the first administrator only from a trusted SQL session after the
-- corresponding Supabase Auth user exists:
-- insert into public.profiles (user_id, role)
-- values ('AUTH-USER-UUID-HERE', 'admin');
