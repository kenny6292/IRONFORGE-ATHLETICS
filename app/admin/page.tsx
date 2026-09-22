import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";

const money = (value: number) => `₦${Number(value || 0).toLocaleString()}`;

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role,full_name").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/member");

  const [{ count: members }, { count: activeMemberships }, { count: bookings }, { count: messages }, { count: trainingRequests }, { count: payments }, { data: successfulPayments }, { data: recentBookings }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "member"),
    supabase.from("memberships").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("class_bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("personal_training_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "successful"),
    supabase.from("payments").select("amount_ngn,provider,created_at").eq("status", "successful").order("created_at", { ascending: false }).limit(1000),
    supabase.from("class_bookings").select("id,booked_at,status,profiles(full_name),classes(name)").order("booked_at", { ascending: false }).limit(6)
  ]);

  const revenue = (successfulPayments || []).reduce((sum, p) => sum + Number(p.amount_ngn || 0), 0);
  const providers = (successfulPayments || []).reduce((acc, p) => {
    acc[p.provider] = (acc[p.provider] || 0) + Number(p.amount_ngn || 0);
    return acc;
  }, {} as Record<string, number>);

  return <main className="page adminPage">
    <a className="back" href="/">← HOME</a>
    <p className="eyebrow">IRONFORGE / ADMIN</p>
    <h1>CONTROL <i>CENTER.</i></h1>
    <p className="pageLead">Production management dashboard for {profile.full_name || "administrator"}.</p>

    <nav className="adminNav"><a className="btn primary" href="/admin/management">MANAGE OPERATIONS</a><a className="btn ghost" href="/admin/members">MEMBERS & PAYMENTS</a><a className="btn ghost" href="/member">MEMBER VIEW</a></nav>

    <section className="pageGrid">
      {[
        ["MEMBERS", members], ["ACTIVE MEMBERSHIPS", activeMemberships], ["CONFIRMED BOOKINGS", bookings],
        ["NEW ENQUIRIES", messages], ["TRAINING REQUESTS", trainingRequests], ["SUCCESSFUL PAYMENTS", payments]
      ].map(([label, count]) => <div className="card" key={String(label)}><span className="num">{label}</span><h3>{count ?? 0}</h3><p>Live database count</p></div>)}
    </section>

    <section className="adminSection">
      <h2>REVENUE <i>OVERVIEW.</i></h2>
      <div className="pageGrid">
        <div className="card"><span className="num">SUCCESSFUL REVENUE</span><h3>{money(revenue)}</h3><p>Based on successful payments recorded in the database.</p></div>
        <div className="card"><span className="num">PAYSTACK</span><h3>{money(providers.paystack || 0)}</h3><p>Successful Paystack transactions.</p></div>
        <div className="card"><span className="num">FLUTTERWAVE</span><h3>{money(providers.flutterwave || 0)}</h3><p>Successful Flutterwave transactions.</p></div>
      </div>
    </section>

    <section className="adminSection">
      <h2>RECENT <i>BOOKINGS.</i></h2>
      <div className="adminRows">{recentBookings?.length ? recentBookings.map(b => {
        const member = Array.isArray(b.profiles) ? b.profiles[0] : b.profiles;
        const cls = Array.isArray(b.classes) ? b.classes[0] : b.classes;
        return <div className="adminRow" key={b.id}><span><strong>{cls?.name || "Class"}</strong> — {member?.full_name || "Member"}<br/>{new Date(b.booked_at).toLocaleString()}</span><span className={`statusBadge ${b.status}`}>{b.status}</span></div>;
      }) : <p className="emptyState">No bookings recorded yet.</p>}</div>
    </section>
  </main>;
}