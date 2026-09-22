import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { classId } = await request.json();
    if (!classId || typeof classId !== "string") {
      return NextResponse.json({ error: "classId is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const { data, error } = await supabase.rpc("book_class", { p_class_id: classId });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({
      ok: Boolean(data?.ok),
      message: data?.message || "Class reservation processed.",
    });
  } catch {
    return NextResponse.json({ error: "Invalid booking request." }, { status: 400 });
  }
}
