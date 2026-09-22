import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("tx_ref");
  const transactionId = url.searchParams.get("transaction_id");

  if (!reference || !transactionId) return NextResponse.redirect(new URL("/membership?payment=missing", url.origin));
  if (!process.env.FLUTTERWAVE_SECRET_KEY) return NextResponse.redirect(new URL("/membership?payment=unconfigured", url.origin));

  try {
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`,
      {
        headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` },
        cache: "no-store",
      },
    );
    const result = await response.json();
    const transaction = result?.data;
    const supabase = createAdminClient();

    const { data: payment } = await supabase
      .from("payments")
      .select("id, amount_ngn")
      .eq("reference", reference)
      .eq("provider", "flutterwave")
      .maybeSingle();

    if (!payment) return NextResponse.redirect(new URL("/membership?payment=not_found", url.origin));

    const verified =
      response.ok &&
      result?.status === "success" &&
      transaction?.status === "successful" &&
      transaction?.tx_ref === reference &&
      transaction?.currency === "NGN" &&
      Number(transaction?.amount) === payment.amount_ngn;

    if (!verified) {
      await supabase.from("payments").update({ status: "failed", metadata: transaction ?? {} }).eq("id", payment.id);
      return NextResponse.redirect(new URL("/membership?payment=failed", url.origin));
    }

    const { error: paymentError } = await supabase
      .from("payments")
      .update({ status: "successful", metadata: transaction })
      .eq("id", payment.id);

    if (paymentError) return NextResponse.redirect(new URL("/membership?payment=record_error", url.origin));

    const { error: activationError } = await supabase.rpc("activate_membership_for_payment", {
      p_reference: reference,
    });

    if (activationError) return NextResponse.redirect(new URL("/membership?payment=activation_error", url.origin));

    return NextResponse.redirect(
      new URL(`/membership?payment=success&reference=${encodeURIComponent(reference)}`, url.origin),
    );
  } catch {
    return NextResponse.redirect(new URL("/membership?payment=verification_error", url.origin));
  }
}
