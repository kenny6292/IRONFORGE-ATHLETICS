"use client";

import { useState } from "react";
import QRCode from "qrcode";

export default function CheckInQR({ url }: { url: string }) {
  const [src, setSrc] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate() {
    setSrc(await QRCode.toDataURL(url, { width: 420, margin: 2, errorCorrectionLevel: "M" }));
  }

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return <div className="qrStation">
    <div className="qrActions">
      <button className="btn primary" onClick={generate}>GENERATE QR</button>
      <button className="btn btnGhost" onClick={copy}>{copied ? "COPIED" : "COPY CHECK-IN LINK"}</button>
    </div>
    {src ? <img className="qrImage" src={src} alt="IRONFORGE member check-in QR code" /> : <p className="emptyState">Generate the station QR and display it at the gym entrance.</p>}
    <code className="qrUrl">{url}</code>
  </div>;
}
