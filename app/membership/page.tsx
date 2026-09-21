"use client";
import {useState} from "react";
export default function Membership(){
 const[loading,setLoading]=useState<string|null>(null),[message,setMessage]=useState("");
 const plans=[["FORGE","₦35,000","Gym access, group classes and member app"],["ELITE","₦60,000","Full access, all classes and recovery"],["PERFORMANCE","₦120,000","Elite access, 4 PT sessions and priority booking"]];
 async function checkout(planName:string,provider:"paystack"|"flutterwave"){
  setLoading(planName+provider);setMessage("");
  try{const r=await fetch(`/api/payments/${provider}/initialize`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({planName})});const data=await r.json();if(!r.ok)throw new Error(data.error||"Unable to start checkout.");window.location.href=data.authorization_url;}
  catch(e){setMessage(e instanceof Error?e.message:"Unable to start checkout.");setLoading(null);}
 }
 return <main className="page"><a className="back" href="/">← HOME</a><p className="eyebrow">IRONFORGE / MEMBERSHIP</p><h1>CHOOSE YOUR <i>FORGE.</i></h1><p className="pageLead">Select a plan and pay securely through your preferred payment provider. Sign in is required.</p><section className="plans">{plans.map(p=><article className="plan" key={p[0]}><span>{p[0]}</span><strong>{p[1]}<small>/ MONTH</small></strong><p>{p[2]}</p><button className="btn primary" disabled={!!loading} onClick={()=>checkout(p[0],"paystack")}>{loading===p[0]+"paystack"?"CONNECTING…":"PAY WITH PAYSTACK"}</button><button className="btn" disabled={!!loading} onClick={()=>checkout(p[0],"flutterwave")}>{loading===p[0]+"flutterwave"?"CONNECTING…":"PAY WITH FLUTTERWAVE"}</button></article>)}</section>{message&&<div className="notice">{message}</div>}</main>}