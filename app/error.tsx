"use client";

export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){
 return <main className="page"><p className="eyebrow">IRONFORGE / ERROR</p><h1>SOMETHING <i>FAILED.</i></h1><p className="pageLead">An unexpected error occurred. Please try again.</p><button className="btn primary" onClick={()=>reset()}>TRY AGAIN</button></main>
}