-- Member workout tracking
create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercise text not null check (char_length(trim(exercise)) between 2 and 120),
  sets integer check (sets is null or sets between 1 and 100),
  reps integer check (reps is null or reps between 1 and 1000),
  weight_kg numeric(8,2) check (weight_kg is null or weight_kg >= 0),
  duration_seconds integer check (duration_seconds is null or duration_seconds between 1 and 86400),
  notes text,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists workout_logs_user_idx on public.workout_logs(user_id, completed_at desc);
alter table public.workout_logs enable row level security;

drop policy if exists "Users can view own workouts" on public.workout_logs;
create policy "Users can view own workouts"
on public.workout_logs for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create own workouts" on public.workout_logs;
create policy "Users can create own workouts"
on public.workout_logs for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own workouts" on public.workout_logs;
create policy "Users can delete own workouts"
on public.workout_logs for delete to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Admins can manage workouts" on public.workout_logs;
create policy "Admins can manage workouts"
on public.workout_logs for all to authenticated
using (public.is_admin())
with check (public.is_admin());
