"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["About", "/about"], ["Programs", "/programs"], ["Classes", "/classes"],
  ["Trainers", "/trainers"], ["Membership", "/membership"],
  ["Facilities", "/facilities"], ["Contact", "/contact"],
];

export default function Home() {
  const [open, setOpen] = useState(false);
  return <main>
    <nav className="nav">
      <a className="logo" href="/">IRON<span>FORGE</span><small>ATHLETICS</small></a>
      <div className={open ? "links open" : "links"}>
        {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="navCta" href="/membership" onClick={() => setOpen(false)}>JOIN NOW <ArrowRight size={16}/></a>
      </div>
      <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
    </nav>
    <section className="hero">
      <div className="heroShade"/>
      <div className="heroContent">
        <p className="eyebrow">STRENGTH · PERFORMANCE · DISCIPLINE</p>
        <h1>BUILD YOUR<br/><i>STRONGEST</i> SELF.</h1>
        <p className="lead">Train with purpose. Move with power. Become the version of yourself that refuses to settle.</p>
        <div className="actions">
          <a className="btn primary" href="/membership">START TRAINING <ArrowRight size={18}/></a>
          <a className="btn ghost" href="/programs">EXPLORE PROGRAMS</a>
        </div>
      </div>
      <div className="heroStat"><strong>24/7</strong><span>ACCESS AVAILABLE</span></div>
    </section>
    <section className="homeIntro">
      <div><p className="eyebrow">IRONFORGE ATHLETICS</p><h2>YOUR TRAINING.<br/><i>YOUR STANDARD.</i></h2></div>
      <p>Explore programs, live classes, expert trainers, facilities and membership through dedicated pages instead of one long scrolling homepage.</p>
    </section>
  </main>;
}