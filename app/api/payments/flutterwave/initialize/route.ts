import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request:Request){
 try{
  const {planId,planName}=await request.json();
  if(!planId&&!planName) return NextResponse.json({error:"planId or planName is required"},{status:400});
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"Authentication required"},{status:401});
  if(!process.env.FLUTTERWAVE_SECRET_KEY) return NextResponse.json({error:"Flutterwave is not configured."},{status:503});
  const query=supabase.from("membership_plans").select("id,name,price_ngn,active").eq("active",true);
  const {data:plan,error}=planId?await query.eq("id",planId).single():await query.ilike("name",String(planName)).single();
  if(error||!plan) return NextResponse.json({error:"Membership plan not found."},{status:404});
  const reference=`IRONFORGE-${crypto.randomUUID()}`;
  const {error:paymentError}=await supabase.from("payments").insert({user_id:user.id,provider:"flutterwave",reference,amount_ngn:plan.price_ngn,status:"pending",metadata:{plan_id:plan.id,plan_name:plan.name}});
  if(paymentError) return NextResponse.json({error:"Unable to create payment record."},{status:500});
  const response=await fetch("https://api.flutterwave.com/v3/payments",{method:"POST",headers:{Authorization:`Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({tx_ref:reference,amount:plan.price_ngn,currency:"NGN",redirect_url:`${process.env.NEXT_PUBLIC_SITE_URL||new URL(request.url).origin}/api/payments/flutterwave/callback`,customer:{email:user.email},meta:{plan_id:plan.id}})});
  const result=await response.json();
  if(!response.ok||result.status!=="success") return NextResponse.json({error:"Flutterwave initialization failed."},{status:502});
  return NextResponse.json({authorization_url:result.data.link,reference});
 }catch{return NextResponse.json({error:"Invalid payment request."},{status:400});}
}