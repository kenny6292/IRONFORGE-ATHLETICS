"use client";
import { useState } from "react";
import { bookClass, cancelClass } from "./actions";
const data=[
 ["FORGE STRENGTH","MON","06:00 PM","Advanced","forge-strength"],
 ["IRON HIIT","TUE","07:00 AM","Intermediate","iron-hiit"],
 ["BOXING CONDITIONING","THU","06:30 PM","All Levels","boxing-conditioning"],
 ["PERFORMANCE LAB","SAT","09:00 AM","Advanced","performance-lab"],
 ["FUNCTIONAL FLOW","SUN","10:00 AM","Beginner","functional-flow"]
];
export default function Classes(){
 const [state,setState]=useState<Record<string,string>>({});
 async function run(id:string,action:"book"|"cancel"){
  const r=action==="book"?await bookClass(id):await cancelClass(id);
  setState(s=>({...s,[id]:r.ok?r.message:(r.error||"Request failed.")}));
 }
 return <main className="page"><a className="back" href="/">← HOME</a><p className="eyebrow">IRONFORGE / SCHEDULE</p><h1>CLASS <i>LINEUP.</i></h1><p className="pageLead">Choose a session and reserve your place. A member account is required.</p><div className="classList">{data.map(c=><div className="classRow" key={c[4]}><span className="classNum">{c[1]}</span><div><h3>{c[0]}</h3><p>{c[2]} · {c[3]}</p>{state[c[4]]&&<small>{state[c[4]]}</small>}</div><button className="btn primary" onClick={()=>run(c[4],"book")}>BOOK</button><button className="btn" onClick={()=>run(c[4],"cancel")}>CANCEL</button></div>)}</div></main>
}