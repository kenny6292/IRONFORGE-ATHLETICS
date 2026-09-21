-- Capacity-safe booking RPC. Uses a row lock on the class before counting confirmed bookings.
create or replace function public.book_class(p_class_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_capacity integer;
  v_count integer;
begin
  if v_user is null then
    raise exception 'Authentication required';
  end if;

  select capacity into v_capacity
  from public.classes
  where id = p_class_id and active = true
  for update;

  if v_capacity is null then
    raise exception 'Class not found';
  end if;

  if exists (
    select 1 from public.class_bookings
    where class_id = p_class_id and user_id = v_user and status = 'confirmed'
  ) then
    return jsonb_build_object('ok', true, 'message', 'Already booked');
  end if;

  select count(*) into v_count
  from public.class_bookings
  where class_id = p_class_id and status = 'confirmed';

  if v_count >= v_capacity then
    return jsonb_build_object('ok', false, 'message', 'Class is full');
  end if;

  insert into public.class_bookings(class_id,user_id,status)
  values(p_class_id,v_user,'confirmed')
  on conflict (class_id,user_id) do update set status='confirmed', booked_at=now();

  return jsonb_build_object('ok', true, 'message', 'Class reserved successfully');
end;
$$;

revoke all on function public.book_class(uuid) from public;
grant execute on function public.book_class(uuid) to authenticated;