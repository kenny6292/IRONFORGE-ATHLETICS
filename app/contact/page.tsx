"use client";
import { useState } from "react";
import { submitContact } from "./actions";
export default function Contact(){
 const [done,setDone]=useState(false); const [error,setError]=useState("");
 async function submit(formData:FormData){setError("");const r=await submitContact(formData);if(r.ok)setDone(true);else setError(r.error||"Unable to submit.");}
 return <main className="page"><a className="back" href="/">← HOME</a><p className="eyebrow">IRONFORGE / CONTACT</p><h1>READY TO <i>FORGE?</i></h1><p className="pageLead">Ask about membership, book a tour, or speak with a coach.</p>{done?<div className="notice"><b>ENQUIRY RECEIVED.</b><br/>Your message has been submitted.</div>:<form action={submit} className="contactForm"><input name="name" required placeholder="FULL NAME"/><input name="email" required type="email" placeholder="EMAIL ADDRESS"/><input name="phone" placeholder="PHONE"/><select name="subject" defaultValue=""><option value="" disabled>REASON FOR CONTACT</option><option>Membership</option><option>Personal Training</option><option>Book a Tour</option><option>General Enquiry</option></select><textarea name="message" required placeholder="MESSAGE" rows={6}/><button className="btn primary" type="submit">SEND ENQUIRY →</button>{error&&<div className="notice">{error}</div>}</form>}</main>
}