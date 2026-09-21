"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAdmin(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) throw new Error("Authentication required");
 const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).single();
 if(profile?.role!=="admin") throw new Error("Admin access required");
 return supabase;
}

export async function savePlan(formData:FormData){
 const supabase=await requireAdmin();
 const id=String(formData.get("id")||"");
 const payload={name:String(formData.get("name")||"").trim(),price_ngn:Number(formData.get("price_ngn")||0),billing_period:String(formData.get("billing_period")||"monthly"),description:String(formData.get("description")||"").trim(),active:formData.get("active")==="on"};
 if(!payload.name||payload.price_ngn<=0) throw new Error("Plan name and positive price are required.");
 const result=id?await supabase.from("membership_plans").update(payload).eq("id",id):await supabase.from("membership_plans").insert(payload);
 if(result.error) throw new Error(result.error.message);
 revalidatePath("/admin"); revalidatePath("/membership");
}

export async function deletePlan(formData:FormData){
 const supabase=await requireAdmin(); const id=String(formData.get("id"));
 const {error}=await supabase.from("membership_plans").update({active:false}).eq("id",id);
 if(error) throw new Error(error.message);
 revalidatePath("/admin"); revalidatePath("/membership");
}

export async function saveTrainer(formData:FormData){
 const supabase=await requireAdmin(); const id=String(formData.get("id")||"");
 const payload={name:String(formData.get("name")||"").trim(),specialty:String(formData.get("specialty")||"").trim(),bio:String(formData.get("bio")||"").trim(),image_url:String(formData.get("image_url")||"").trim()||null,active:formData.get("active")==="on"};
 if(!payload.name||!payload.specialty) throw new Error("Trainer name and specialty are required.");
 const result=id?await supabase.from("trainers").update(payload).eq("id",id):await supabase.from("trainers").insert(payload);
 if(result.error) throw new Error(result.error.message);
 revalidatePath("/admin"); revalidatePath("/trainers");
}

export async function deleteTrainer(formData:FormData){
 const supabase=await requireAdmin(); const {error}=await supabase.from("trainers").update({active:false}).eq("id",String(formData.get("id")));
 if(error) throw new Error(error.message); revalidatePath("/admin"); revalidatePath("/trainers");
}

export async function saveClass(formData:FormData){
 const supabase=await requireAdmin(); const id=String(formData.get("id")||"");
 const payload={name:String(formData.get("name")||"").trim(),description:String(formData.get("description")||"").trim(),day_of_week:Number(formData.get("day_of_week")||0),start_time:String(formData.get("start_time")||"09:00"),duration_minutes:Number(formData.get("duration_minutes")||60),capacity:Number(formData.get("capacity")||1),trainer_id:String(formData.get("trainer_id")||"")||null,active:formData.get("active")==="on"};
 if(!payload.name||payload.capacity<1) throw new Error("Class name and valid capacity are required.");
 const result=id?await supabase.from("classes").update(payload).eq("id",id):await supabase.from("classes").insert(payload);
 if(result.error) throw new Error(result.error.message);
 revalidatePath("/admin"); revalidatePath("/classes");
}

export async function deleteClass(formData:FormData){
 const supabase=await requireAdmin(); const {error}=await supabase.from("classes").update({active:false}).eq("id",String(formData.get("id")));
 if(error) throw new Error(error.message); revalidatePath("/admin"); revalidatePath("/classes");
}

export async function updateBooking(formData:FormData){
 const supabase=await requireAdmin(); const status=String(formData.get("status"));
 if(!["confirmed","cancelled"].includes(status)) throw new Error("Invalid booking status.");
 const {error}=await supabase.from("class_bookings").update({status}).eq("id",String(formData.get("id")));
 if(error) throw new Error(error.message); revalidatePath("/admin");
}

export async function updateMessage(formData:FormData){
 const supabase=await requireAdmin(); const status=String(formData.get("status"));
 if(!["new","read","resolved"].includes(status)) throw new Error("Invalid message status.");
 const {error}=await supabase.from("contact_messages").update({status}).eq("id",String(formData.get("id")));
 if(error) throw new Error(error.message); revalidatePath("/admin");
}

export async function updateTrainingRequest(formData:FormData){
 const supabase=await requireAdmin(); const status=String(formData.get("status"));
 if(!["new","contacted","scheduled","closed"].includes(status)) throw new Error("Invalid request status.");
 const {error}=await supabase.from("personal_training_requests").update({status}).eq("id",String(formData.get("id")));
 if(error) throw new Error(error.message); revalidatePath("/admin");
}