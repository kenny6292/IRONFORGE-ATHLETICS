"use server";
import { createClient } from "@/lib/supabase/server";

export async function submitContact(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();
  if (name.length < 2 || !email.includes("@") || message.length < 1) return { ok:false, error:"Please provide valid contact details and a message." };
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({name,email,phone,subject,message});
  if (error) return { ok:false, error:"Unable to submit your enquiry right now." };
  return { ok:true };
}