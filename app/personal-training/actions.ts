"use server";
import { createClient } from "@/lib/supabase/server";

export async function submitTrainingRequest(formData:FormData){
 const name=String(formData.get("name")||"").trim(), email=String(formData.get("email")||"").trim(), phone=String(formData.get("phone")||"").trim(), goals=String(formData.get("goals")||"").trim(), preferred_time=String(formData.get("preferred_time")||"").trim();
 if(name.length<2||!email.includes("@")||goals.length<5) return {ok:false,error:"Please provide valid details and training goals."};
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 const {error}=await supabase.from("personal_training_requests").insert({user_id:user?.id??null,name,email,phone,goals,preferred_time});
 if(error) return {ok:false,error:"Unable to submit your training request right now."};
 return {ok:true};
}