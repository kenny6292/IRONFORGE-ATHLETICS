import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request:Request){
 const url=new URL(request.url), reference=url.searchParams.get("reference");
 if(!reference) return NextResponse.redirect(new URL("/membership?payment=missing",url.origin));
 if(!process.env.PAYSTACK_SECRET_KEY) return NextResponse.redirect(new URL("/membership?payment=unconfigured",url.origin));
 const response=await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,{headers:{Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`}});
 const result=await response.json();
 const supabase=await createClient();
 if(response.ok&&result.status&&result.data?.status==="success"){
  await supabase.from("payments").update({status:"successful",metadata:result.data}).eq("reference",reference);
  return NextResponse.redirect(new URL(`/membership?payment=success&reference=${encodeURIComponent(reference)}`,url.origin));
 }
 await supabase.from("payments").update({status:"failed",metadata:result.data||{}}).eq("reference",reference);
 return NextResponse.redirect(new URL("/membership?payment=failed",url.origin));
}