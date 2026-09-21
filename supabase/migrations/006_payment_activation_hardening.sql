-- Make payment-to-membership activation safe for privileged server callbacks.
create or replace function public.activate_membership_for_payment(p_reference text)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
 v_payment public.payments%rowtype;
 v_plan_id uuid;
 v_membership_id uuid;
begin
 select * into v_payment from public.payments where reference=p_reference and status='successful' for update;
 if v_payment.id is null then raise exception 'Verified payment not found'; end if;
 if v_payment.membership_id is not null then
   return jsonb_build_object('ok',true,'membership_id',v_payment.membership_id,'already_activated',true);
 end if;
 if v_payment.user_id is null then raise exception 'Payment has no member'; end if;
 v_plan_id := nullif(v_payment.metadata->>'plan_id','')::uuid;
 if v_plan_id is null then raise exception 'Payment has no membership plan'; end if;
 update public.memberships set status='expired',ends_at=now()
 where user_id=v_payment.user_id and status='active' and ends_at is not null and ends_at<=now();
 select id into v_membership_id from public.memberships
 where user_id=v_payment.user_id and plan_id=v_plan_id and status='pending'
 order by created_at desc limit 1;
 if v_membership_id is null then
   insert into public.memberships(user_id,plan_id,status,starts_at,ends_at)
   values(v_payment.user_id,v_plan_id,'active',now(),now()+interval '1 month')
   returning id into v_membership_id;
 else
   update public.memberships set status='active',starts_at=now(),ends_at=now()+interval '1 month'
   where id=v_membership_id;
 end if;
 update public.payments set membership_id=v_membership_id where id=v_payment.id;
 return jsonb_build_object('ok',true,'membership_id',v_membership_id,'already_activated',false);
end;
$$;