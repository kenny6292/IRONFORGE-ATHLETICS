"use client";

import { useState } from "react";

export default function BookClassButton({ classId }: { classId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function book() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/classes/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          window.location.assign("/login?next=/classes");
          return;
        }
        throw new Error(data.error || "Unable to reserve class.");
      }
      setMessage(data.message || "Reserved");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to reserve class.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button className="btn primary" disabled={loading} onClick={book}>
        {loading ? "RESERVING…" : "BOOK"}
      </button>
      {message && <small>{message}</small>}
    </div>
  );
}
