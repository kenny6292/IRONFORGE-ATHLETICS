import { createClient } from "@/lib/supabase/server";
import CheckoutButtons from "./checkout-buttons";

export default async function Membership({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string; reference?: string }>;
}) {
  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("membership_plans")
    .select("id,name,price_ngn,billing_period,description")
    .eq("active", true)
    .order("price_ngn");

  const params = await searchParams;
  const paymentMessage =
    params.payment === "success"
      ? "Payment verified successfully. Your membership is being activated."
      : params.payment === "failed"
        ? "Payment could not be verified. No membership was activated."
        : params.payment === "activation_error"
          ? "Payment was verified, but membership activation needs attention."
          : params.payment === "unconfigured"
            ? "Online payments are not configured yet."
            : params.payment === "record_error"
              ? "Payment verification succeeded, but the payment record could not be updated."
              : params.payment === "not_found"
                ? "The payment reference could not be found."
                : "";

  return (
    <main className="page">
      <a className="back" href="/">← HOME</a>
      <p className="eyebrow">IRONFORGE / MEMBERSHIP</p>
      <h1>CHOOSE YOUR <i>FORGE.</i></h1>
      <p className="pageLead">Select a live membership plan and pay securely through your preferred provider. Sign in is required at checkout.</p>
      <section className="plans">
        {plans?.map((plan) => (
          <article className="plan" key={plan.id}>
            <span>{plan.name}</span>
            <strong>₦{Number(plan.price_ngn).toLocaleString("en-NG")}<small>/ {String(plan.billing_period || "MONTH").toUpperCase()}</small></strong>
            <p>{plan.description || "Full access to the IRONFORGE training experience."}</p>
            <CheckoutButtons planName={plan.name} />
          </article>
        ))}
      </section>
      {!plans?.length && <div className="notice">No active membership plans are currently available.</div>}
      {paymentMessage && <div className="notice">{paymentMessage}</div>}
      {params.reference && params.payment === "success" && <p className="pageLead">Reference: {params.reference}</p>}
    </main>
  );
}
