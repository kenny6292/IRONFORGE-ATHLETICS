-- Member attendance tracking
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  class_id uuid references public.classes(id) on delete set null,
  checked_in_at timestamptz not null default now(),
  checked_in_by uuid references public.profiles(id) on delete set null,
  method text not null default 'admin' check (method in ('admin','qr','manual')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists attendance_user_idx on public.attendance(user_id, checked_in_at desc);
create index if not exists attendance_class_idx on public.attendance(class_id, checked_in_at desc);

alter table public.attendance enable row level security;

drop policy if exists "Users can view own attendance" on public.attendance;
create policy "Users can view own attendance"
on public.attendance for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Admins can manage attendance" on public.attendance;
create policy "Admins can manage attendance"
on public.attendance for all to authenticated
using (public.is_admin())
with check (public.is_admin());
