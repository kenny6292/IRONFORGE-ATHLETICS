import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const dayNames=["SUN","MON","TUE","WED","THU","FRI","SAT"];

export default async function Classes(){
 const supabase=await createClient();
 const {data:classes,error}=await supabase.from("classes").select("id,name,description,day_of_week,start_time,duration_minutes,capacity,trainer_id,trainers(name)").eq("active",true).order("day_of_week").order("start_time");
 if(error) return <main className="page"><a className="back" href="/">← HOME</a><p className="eyebrow">IRONFORGE / SCHEDULE</p><h1>SCHEDULE <i>UNAVAILABLE.</i></h1><p className="pageLead">The live class schedule is not configured yet.</p></main>;
 return <main className="page"><a className="back" href="/">← HOME</a><p className="eyebrow">IRONFORGE / SCHEDULE</p><h1>CLASS <i>LINEUP.</i></h1><p className="pageLead">Live classes from the IronForge database. Sign in to reserve your place.</p><div className="classList">{classes?.map(c=><div className="classRow" key={c.id}><span className="classNum">{dayNames[c.day_of_week]||"DAY"}</span><div><h3>{c.name}</h3><p>{c.start_time} · {c.duration_minutes} min · {c.trainers?.name||"IRONFORGE COACH"}</p><small>{c.description||"Performance-focused training session."} · Capacity {c.capacity}</small></div><a className="btn primary" href="/login?next=/classes">BOOK</a></div>)}</div></main>
}