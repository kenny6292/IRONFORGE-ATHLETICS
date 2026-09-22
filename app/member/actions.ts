"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required");
  return { supabase, user };
}
export async function logout() {
  const { supabase } = await getUser();
  await supabase.auth.signOut();
  redirect("/login");
}
export async function updateMemberProfile(formData: FormData) {
  const { supabase, user } = await getUser();
  const full_name = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  if (full_name.length < 2 || full_name.length > 120) throw new Error("Enter a valid full name.");
  if (phone.length > 40) throw new Error("Phone number is too long.");
  const { error } = await supabase.from("profiles").update({ full_name, phone }).eq("id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/member");
}
export async function cancelMemberBooking(formData: FormData) {
  const { supabase, user } = await getUser();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Booking ID is required.");
  const { error } = await supabase.from("class_bookings").update({ status: "cancelled" }).eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/member");
  revalidatePath("/classes");
}
