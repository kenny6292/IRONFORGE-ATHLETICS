import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MemberPage(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) redirect("/login");
 const {data:profile}=await supabase.from("profiles").select("full_name,role").eq("id",user.id).maybeSingle();
 const {data:memberships}=await supabase.from("memberships").select("status,starts_at,ends_at,membership_plans(name,price_ngn)").eq("user_id",user.id).order("created_at",{ascending:false});
 const {data:bookings}=await supabase.from("class_bookings").select("booked_at,status,classes(name,start_time,day_of_week)").eq("user_id",user.id).order("booked_at",{ascending:false}).limit(10);
 return <main className="page"><a className="back" href="/">← HOME</a><p className="eyebrow">IRONFORGE / MEMBER AREA</p><h1>WELCOME <i>{profile?.full_name?.split(" ")[0]||"MEMBER"}.</i></h1><p className="pageLead">{user.email}</p><section className="pageGrid"><div className="card"><span className="num">MEMBERSHIP</span><h3>{memberships?.[0]?.membership_plans?.[0]?.name||"NO ACTIVE PLAN"}</h3><p>Status: {memberships?.[0]?.status||"Not enrolled"}</p></div><div className="card"><span className="num">UPCOMING / RECENT</span><h3>{bookings?.length||0} BOOKINGS</h3><p>Your class reservations appear here once connected to the live schedule.</p></div></section></main>
}