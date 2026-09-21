import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request:Request){
 const url=new URL(request.url);
 const reference=url.searchParams.get("tx_ref")||url.searchParams.get("transaction_id");
 if(!reference) return NextResponse.redirect(new URL("/membership?payment=missing",url.origin));
 if(!process.env.FLUTTERWAVE_SECRET_KEY) return NextResponse.redirect(new URL("/membership?payment=unconfigured",url.origin));
 const transactionId=url.searchParams.get("transaction_id");
 if(!transactionId) return NextResponse.redirect(new URL("/membership?payment=failed",url.origin));
 const response=await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`,{headers:{Authorization:`Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`}});
 const result=await response.json();
 const supabase=await createClient();
 const verified=result.status==="success"&&result.data?.status==="successful"&&result.data?.tx_ref===reference&&result.data?.currency==="NGN";
 if(verified){
  const {error}=await supabase.from("payments").update({status:"successful",metadata:result.data}).eq("reference",reference);
  if(error) return NextResponse.redirect(new URL("/membership?payment=record_error",url.origin));
  const {error:activationError}=await supabase.rpc("activate_membership_for_payment",{p_reference:reference});
  if(activationError) return NextResponse.redirect(new URL("/membership?payment=activation_error",url.origin));
  return NextResponse.redirect(new URL(`/membership?payment=success&reference=${encodeURIComponent(reference)}`,url.origin));
 }
 await supabase.from("payments").update({status:"failed",metadata:result.data||{}}).eq("reference",reference);
 return NextResponse.redirect(new URL("/membership?payment=failed",url.origin));
}