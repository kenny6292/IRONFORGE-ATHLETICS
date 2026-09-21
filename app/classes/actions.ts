"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function bookClass(classId:string){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) redirect("/login?next=/classes");
 const {data:existing}=await supabase.from("class_bookings").select("id,status").eq("class_id",classId).eq("user_id",user.id).maybeSingle();
 if(existing?.status==="confirmed") return {ok:true,message:"You are already booked for this class."};
 const {error}=await supabase.from("class_bookings").upsert({class_id:classId,user_id:user.id,status:"confirmed"},{onConflict:"class_id,user_id"});
 if(error) return {ok:false,error:"Unable to reserve this class. Please try again."};
 return {ok:true,message:"Class reserved successfully."};
}
export async function cancelClass(classId:string){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) redirect("/login?next=/classes");
 const {error}=await supabase.from("class_bookings").update({status:"cancelled"}).eq("class_id",classId).eq("user_id",user.id);
 if(error) return {ok:false,error:"Unable to cancel this booking."};
 return {ok:true,message:"Booking cancelled."};
}