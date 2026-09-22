"use client";

import { useState } from "react";

export default function CheckoutButtons({ planName }: { planName: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function checkout(provider: "paystack" | "flutterwave") {
    setLoading(provider);
    setMessage("");
    try {
      const response = await fetch(`/api/payments/${provider}/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName }),
      });
      const data = await response.json();
      if (!response.ok || !data.authorization_url) throw new Error(data.error || "Unable to start checkout.");
      window.location.assign(data.authorization_url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to start checkout.");
      setLoading(null);
    }
  }

  return (
    <>
      <button className="btn primary" disabled={!!loading} onClick={() => checkout("paystack")}>
        {loading === "paystack" ? "CONNECTING…" : "PAY WITH PAYSTACK"}
      </button>
      <button className="btn" disabled={!!loading} onClick={() => checkout("flutterwave")}>
        {loading === "flutterwave" ? "CONNECTING…" : "PAY WITH FLUTTERWAVE"}
      </button>
      {message && <div className="notice">{message}</div>}
    </>
  );
}
