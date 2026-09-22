"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData): Promise<void> {
 const email=String(formData.get("email")||"").trim();
 const password=String(formData.get("password")||"");
 const supabase=await createClient();
 const {error}=await supabase.auth.signInWithPassword({email,password});
 if(error) redirect("/login?error=invalid_credentials");
 redirect("/member");
}

export async function signup(formData: FormData): Promise<void> {
 const email=String(formData.get("email")||"").trim();
 const password=String(formData.get("password")||"");
 const full_name=String(formData.get("full_name")||"").trim();
 const supabase=await createClient();
 const {error}=await supabase.auth.signUp({email,password,options:{data:{full_name}}});
 if(error) redirect("/signup?error=signup_failed");
 redirect("/login?message=check_email");
}