import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cancelMemberBooking, updateMemberProfile } from "./actions";

const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const money = (value: number | null | undefined) => `₦${Number(value || 0).toLocaleString()}`;

export default async function MemberPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/member");

  const [{ data: profile }, { data: memberships }, { data: bookings }, { data: payments }] = await Promise.all([
    supabase.from("profiles").select("full_name,phone,role").eq("id", user.id).maybeSingle(),
    supabase.from("memberships").select("id,status,starts_at,ends_at,membership_plans(name,price_ngn,billing_period)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("class_bookings").select("id,booked_at,status,classes(name,start_time,day_of_week,duration_minutes,trainers(name))").eq("user_id", user.id).order("booked_at", { ascending: false }).limit(12),
    supabase.from("payments").select("id,provider,reference,amount_ngn,status,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(8)
  ]);

  const active = memberships?.find(m => m.status === "active") || memberships?.[0];
  const activePlan = Array.isArray(active?.membership_plans) ? active.membership_plans[0] : active?.membership_plans;
  const confirmedBookings = bookings?.filter(b => b.status === "confirmed") || [];
  const successfulPayments = payments?.filter(p => p.status === "successful") || [];
  const endsAt = active?.ends_at ? new Date(active.ends_at) : null;
  const daysLeft = endsAt ? Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / 86400000)) : null;

  return <main className="page memberPage">
    <a className="back" href="/">← HOME</a>
    <div className="memberHeader"><div>
      <p className="eyebrow">IRONFORGE / MEMBER AREA</p>
      <h1>WELCOME <i>{profile?.full_name?.split(" ")[0] || "MEMBER"}.</i></h1>
      <p className="pageLead">{user.email} · {profile?.role || "member"}</p>
    </div><div className="memberActions"><a className="btn primary" href="/membership">RENEW MEMBERSHIP</a><a className="btn ghost" href="/classes">BOOK A CLASS</a></div></div>

    <section className="memberStats">
      <div className="memberStat"><span>MEMBERSHIP</span><strong>{activePlan?.name || "NO PLAN"}</strong><small>{active?.status || "Not enrolled"}</small></div>
      <div className="memberStat"><span>REMAINING</span><strong>{daysLeft === null ? "—" : daysLeft}</strong><small>{daysLeft === 1 ? "day" : "days"} on current membership</small></div>
      <div className="memberStat"><span>CONFIRMED CLASSES</span><strong>{confirmedBookings.length}</strong><small>Current reservations</small></div>
      <div className="memberStat"><span>PAYMENTS</span><strong>{successfulPayments.length}</strong><small>Successful transactions</small></div>
    </section>

    <div className="memberGrid">
      <section className="memberPanel"><div className="sectionHead"><div><p className="eyebrow">CURRENT PLAN</p><h2>MEMBERSHIP <i>STATUS.</i></h2></div></div>
        {active ? <div className="memberPlan"><div><span className="num">PLAN</span><h3>{activePlan?.name || "Membership"}</h3><p>{activePlan?.billing_period || "monthly"} · {money(activePlan?.price_ngn)}</p></div><div><span className="num">STATUS</span><h3>{active.status.toUpperCase()}</h3><p>Started {active.starts_at ? new Date(active.starts_at).toLocaleDateString() : "—"} · Expires {endsAt ? endsAt.toLocaleDateString() : "—"}</p></div></div> : <p className="emptyState">No membership found. Choose a plan to start training.</p>}
      </section>
      <section className="memberPanel"><div className="sectionHead"><div><p className="eyebrow">PROFILE</p><h2>YOUR <i>DETAILS.</i></h2></div></div>
        <form action={updateMemberProfile} className="memberForm"><label>FULL NAME<input name="full_name" defaultValue={profile?.full_name || ""} required minLength={2} maxLength={120}/></label><label>PHONE<input name="phone" defaultValue={profile?.phone || ""} maxLength={40} placeholder="+234..."/></label><button className="btn primary" type="submit">SAVE PROFILE</button></form>
      </section>
    </div>

    <section className="memberPanel"><div className="sectionHead"><div><p className="eyebrow">TRAINING</p><h2>MY <i>CLASSES.</i></h2></div><a className="textLink" href="/classes">VIEW SCHEDULE →</a></div><div className="memberList">
      {bookings?.length ? bookings.map(b => { const cls = Array.isArray(b.classes) ? b.classes[0] : b.classes; const trainer = cls && Array.isArray(cls.trainers) ? cls.trainers[0] : cls?.trainers; return <div className="memberRow" key={b.id}><div><strong>{cls?.name || "Class"}</strong><span>{cls?.day_of_week !== undefined ? dayNames[Number(cls.day_of_week)] : "Scheduled"} · {cls?.start_time?.slice(0,5) || "—"} · {trainer?.name || "IRONFORGE"}</span></div><span className={`statusBadge ${b.status}`}>{b.status}</span>{b.status === "confirmed" ? <form action={cancelMemberBooking}><input type="hidden" name="id" value={b.id}/><button className="btn btnGhost smallBtn" type="submit">CANCEL</button></form> : <span/>}</div>; }) : <p className="emptyState">You have no class bookings yet.</p>}
    </div></section>

    <section className="memberPanel"><div className="sectionHead"><div><p className="eyebrow">TRANSACTIONS</p><h2>PAYMENT <i>HISTORY.</i></h2></div></div><div className="memberList">
      {payments?.length ? payments.map(p => <div className="memberRow" key={p.id}><div><strong>{money(p.amount_ngn)}</strong><span>{p.provider.toUpperCase()} · {new Date(p.created_at).toLocaleDateString()}</span></div><span className={`statusBadge ${p.status}`}>{p.status}</span><span className="reference">{p.reference}</span></div>) : <p className="emptyState">No payment transactions yet.</p>}
    </div></section>

    <section className="memberFooterLinks"><a className="btn ghost" href="/personal-training">PERSONAL TRAINING</a><a className="btn ghost" href="/trainers">MEET THE TRAINERS</a>{profile?.role === "admin" && <a className="btn primary" href="/admin">OPEN ADMIN</a>}</section>
  </main>;
}
