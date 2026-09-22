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

export async function addWorkoutLog(formData: FormData) {
  const { supabase, user } = await getUser();
  const exercise = String(formData.get("exercise") || "").trim();
  const setsRaw = String(formData.get("sets") || "").trim();
  const repsRaw = String(formData.get("reps") || "").trim();
  const weightRaw = String(formData.get("weight_kg") || "").trim();
  const durationRaw = String(formData.get("duration_seconds") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  if (exercise.length < 2 || exercise.length > 120) throw new Error("Enter a valid exercise name.");
  const payload = {
    user_id: user.id,
    exercise,
    sets: setsRaw ? Number(setsRaw) : null,
    reps: repsRaw ? Number(repsRaw) : null,
    weight_kg: weightRaw ? Number(weightRaw) : null,
    duration_seconds: durationRaw ? Number(durationRaw) : null,
    notes: notes || null,
  };
  if ((payload.sets !== null && (!Number.isInteger(payload.sets) || payload.sets < 1 || payload.sets > 100)) ||
      (payload.reps !== null && (!Number.isInteger(payload.reps) || payload.reps < 1 || payload.reps > 1000)) ||
      (payload.weight_kg !== null && (!Number.isFinite(payload.weight_kg) || payload.weight_kg < 0)) ||
      (payload.duration_seconds !== null && (!Number.isInteger(payload.duration_seconds) || payload.duration_seconds < 1 || payload.duration_seconds > 86400))) {
    throw new Error("Enter valid workout values.");
  }
  const { error } = await supabase.from("workout_logs").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/member");
}

export async function deleteWorkoutLog(formData: FormData) {
  const { supabase, user } = await getUser();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Workout ID is required.");
  const { error } = await supabase.from("workout_logs").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/member");
}
