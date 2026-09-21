import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage(){
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user)redirect("/login");
 const {data:profile}=await supabase.from("profiles").select("role,full_name").eq("id",user.id).single(); if(profile?.role!=="admin")redirect("/member");
 const [{count:members},{count:activeMemberships},{count:bookings},{count:messages},{count:trainingRequests},{count:payments}]=await Promise.all([
  supabase.from("profiles").select("*",{count:"exact",head:true}),supabase.from("memberships").select("*",{count:"exact",head:true}).eq("status","active"),
  supabase.from("class_bookings").select("*",{count:"exact",head:true}).eq("status","confirmed"),supabase.from("contact_messages").select("*",{count:"exact",head:true}).eq("status","new"),
  supabase.from("personal_training_requests").select("*",{count:"exact",head:true}).eq("status","new"),supabase.from("payments").select("*",{count:"exact",head:true}).eq("status","successful")
 ]);
 return <main className="page adminPage"><a className="back" href="/">← HOME</a><p className="eyebrow">IRONFORGE / ADMIN</p><h1>CONTROL <i>CENTER.</i></h1><p className="pageLead">Production management dashboard for {profile.full_name||"administrator"}.</p>
 <nav className="adminNav"><a className="btn" href="/admin/management">MANAGE PROGRAMS</a><a className="btn" href="/admin/members">MEMBERS & PAYMENTS</a></nav>
 <section className="pageGrid">{[["MEMBERS",members],["ACTIVE MEMBERSHIPS",activeMemberships],["CONFIRMED BOOKINGS",bookings],["NEW ENQUIRIES",messages],["TRAINING REQUESTS",trainingRequests],["SUCCESSFUL PAYMENTS",payments]].map(([label,count])=><div className="card" key={String(label)}><span className="num">{label}</span><h3>{count??0}</h3><p>Live database count</p></div>)}</section></main>
}