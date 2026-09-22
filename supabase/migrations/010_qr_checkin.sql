-- Secure member QR check-in station
create table if not exists public.checkin_stations (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'IRONFORGE Main Entrance',
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.checkin_stations enable row level security;

drop policy if exists "Admins can manage check-in stations" on public.checkin_stations;
create policy "Admins can manage check-in stations"
on public.checkin_stations for all to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.checkin_stations (name)
select 'IRONFORGE Main Entrance'
where not exists (select 1 from public.checkin_stations);

drop policy if exists "Members can read active check-in stations" on public.checkin_stations;
create policy "Members can read active check-in stations"
on public.checkin_stations for select to authenticated
using (active = true);

-- QR check-ins are recorded by the authenticated member only.
