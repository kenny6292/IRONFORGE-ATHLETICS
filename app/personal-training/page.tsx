"use client";
import {useState} from "react";
import {submitTrainingRequest} from "./actions";
export default function PersonalTraining(){
 const[done,setDone]=useState(false),[error,setError]=useState("");
 async function submit(fd:FormData){setError("");const r=await submitTrainingRequest(fd);r.ok?setDone(true):setError(r.error||"Unable to submit.");}
 return <main className="page"><a className="back" href="/">← HOME</a><p className="eyebrow">IRONFORGE / COACHING</p><h1>PERSONAL <i>TRAINING.</i></h1><p className="pageLead">Work one-to-one with a coach around your goals, schedule and performance.</p>{done?<div className="notice"><b>REQUEST RECEIVED.</b><br/>Our team can review your goals and contact you about scheduling.</div>:<form action={submit} className="contactForm"><input name="name" required placeholder="FULL NAME"/><input name="email" required type="email" placeholder="EMAIL"/><input name="phone" placeholder="PHONE"/><input name="preferred_time" placeholder="PREFERRED TRAINING TIME"/><textarea name="goals" required minLength={5} rows={6} placeholder="YOUR TRAINING GOALS"/><button className="btn primary" type="submit">REQUEST COACHING →</button>{error&&<div className="notice">{error}</div>}</form>}</main>
}