-- Harden admin authorization without recursive RLS policies.
create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;

drop policy if exists "admins manage profiles" on public.profiles;
drop policy if exists "admins manage plans" on public.membership_plans;
drop policy if exists "admins manage trainers" on public.trainers;
drop policy if exists "admins manage classes" on public.classes;
drop policy if exists "admins manage bookings" on public.class_bookings;
drop policy if exists "admins manage memberships" on public.memberships;
drop policy if exists "admins manage payments" on public.payments;
drop policy if exists "admins manage contact messages" on public.contact_messages;
drop policy if exists "admins manage training requests" on public.personal_training_requests;

create policy "admins manage profiles" on public.profiles for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins manage plans" on public.membership_plans for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins manage trainers" on public.trainers for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins manage classes" on public.classes for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins manage bookings" on public.class_bookings for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins manage memberships" on public.memberships for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins manage payments" on public.payments for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins manage contact messages" on public.contact_messages for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins manage training requests" on public.personal_training_requests for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
