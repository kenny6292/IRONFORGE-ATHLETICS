"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CheckInPage() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [status, setStatus] = useState("Checking you in...");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!token) { setStatus("Invalid check-in QR code."); return; }
    fetch("/api/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).then(async r => {
      const data = await r.json();
      setOk(Boolean(data.ok));
      setStatus(data.message || "Unable to complete check-in.");
    }).catch(() => setStatus("Unable to reach IRONFORGE. Please try again."));
  }, [token]);

  return <main className="page checkInPage">
    <a className="back" href="/member">← MEMBER AREA</a>
    <p className="eyebrow">IRONFORGE / ATTENDANCE</p>
    <h1>CHECK <i>IN.</i></h1>
    <section className="checkInCard">
      <div className={ok ? "checkMark success" : "checkMark"}>{ok ? "✓" : "•"}</div>
      <h2>{ok ? "ACCESS LOGGED." : "CHECK-IN"}</h2>
      <p>{status}</p>
      {ok ? <a className="btn primary" href="/member">VIEW MEMBER DASHBOARD</a> : <a className="btn ghost" href="/login?next=/member">SIGN IN</a>}
    </section>
  </main>;
}
