import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, message: "Please sign in before checking in." }, { status: 401 });

  let body: { token?: string } = {};
  try { body = await request.json(); } catch {}
  const token = String(body.token || "").trim();
  if (!token || token.length < 20) return NextResponse.json({ ok: false, message: "Invalid check-in QR code." }, { status: 400 });

  const { data: station } = await supabase
    .from("checkin_stations")
    .select("id,name")
    .eq("token", token)
    .eq("active", true)
    .maybeSingle();

  if (!station) return NextResponse.json({ ok: false, message: "This check-in station is inactive or invalid." }, { status: 400 });

  const { data: recent } = await supabase
    .from("attendance")
    .select("id,checked_in_at")
    .eq("user_id", user.id)
    .eq("method", "qr")
    .gte("checked_in_at", new Date(Date.now() - 30 * 60 * 1000).toISOString())
    .limit(1)
    .maybeSingle();

  if (recent) return NextResponse.json({ ok: true, message: "You are already checked in. Your previous QR check-in is still active." });

  const { error } = await supabase.from("attendance").insert({
    user_id: user.id,
    checked_in_by: user.id,
    method: "qr",
    notes: station.name,
  });

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, message: "Check-in successful. Welcome to IRONFORGE." });
}
