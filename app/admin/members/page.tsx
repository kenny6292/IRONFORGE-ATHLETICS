import { createClient } from "../../../lib/supabase/server";
import { redirect } from "next/navigation";
import { updateMemberRole, updateMembershipStatus, updatePaymentStatus } from "../actions";

export default async function AdminMembersPage(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) redirect("/login");
 const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).single();
 if(profile?.role!=="admin") redirect("/member");
 const [{data:members},{data:memberships},{data:payments}]=await Promise.all([
  supabase.from("profiles").select("id,full_name,phone,role,created_at").order("created_at",{ascending:false}).limit(100),
  supabase.from("memberships").select("id,user_id,status,starts_at,ends_at,membership_plans(name,price_ngn)").order("starts_at",{ascending:false}).limit(100),
  supabase.from("payments").select("id,user_id,provider,reference,amount_ngn,status,created_at").order("created_at",{ascending:false}).limit(100)
 ]);
 return <main className="page adminPage"><a className="back" href="/admin">← ADMIN</a><p className="eyebrow">IRONFORGE / MEMBERS</p><h1>MEMBERS <i>& PAYMENTS.</i></h1>
 <section className="adminSection"><h2>MEMBERS</h2>{members?.map(m=><div className="adminRow" key={m.id}><span><strong>{m.full_name||"Unnamed member"}</strong><br/>{m.phone||"No phone"} · {m.role}</span><form action={updateMemberRole}><input type="hidden" name="id" value={m.id}/><select name="role" defaultValue={m.role}><option value="member">member</option><option value="coach">coach</option><option value="admin">admin</option></select><button className="btn" type="submit">UPDATE</button></form></div>)}</section>
 <section className="adminSection"><h2>MEMBERSHIPS</h2>{memberships?.map(m=>{const plan=Array.isArray(m.membership_plans)?m.membership_plans[0]:m.membership_plans; return <div className="adminRow" key={m.id}><span><strong>{plan?.name||"Plan"}</strong> — {m.status}<br/>Ends: {m.ends_at?new Date(m.ends_at).toLocaleDateString():"—"}</span><form action={updateMembershipStatus}><input type="hidden" name="id" value={m.id}/><select name="status" defaultValue={m.status}><option>pending</option><option>active</option><option>paused</option><option>cancelled</option><option>expired</option></select><button className="btn" type="submit">UPDATE</button></form></div>})}</section>
 <section className="adminSection"><h2>PAYMENTS</h2>{payments?.map(p=><div className="adminRow" key={p.id}><span><strong>₦{Number(p.amount_ngn).toLocaleString()}</strong> — {p.provider} — {p.status}<br/>{p.reference}</span><form action={updatePaymentStatus}><input type="hidden" name="id" value={p.id}/><select name="status" defaultValue={p.status}><option>pending</option><option>successful</option><option>failed</option><option>refunded</option></select><button className="btn" type="submit">UPDATE</button></form></div>)}</section>
 </main>
}