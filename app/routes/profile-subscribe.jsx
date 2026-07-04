import { supabaseAdmin } from "../server/supabaseAdmin.server";

export async function action({ request }) {
  try {
    const body = await request.json();
    const op = body.op;
    const email = (body.email || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ success: false, message: "Invalid email." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    if (op === "check") {
      const { data, error } = await supabaseAdmin
        .from("newsletter subscribers")
        .select("confirmed_at")
        .eq("email", email)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, confirmed_at: data?.confirmed_at ?? null }), { headers: { "Content-Type": "application/json" } });
    }

    if (op === "subscribe") {
      // Upsert a confirmed subscription row
      const token = (globalThis.crypto && globalThis.crypto.randomUUID) ? globalThis.crypto.randomUUID() : null;
      const now = new Date().toISOString();
      // Try to insert; if exists, update confirmed_at
      const { data: existing } = await supabaseAdmin
        .from("newsletter subscribers")
        .select("subscriber_token, confirmed_at")
        .eq("email", email)
        .limit(1)
        .maybeSingle();

      if (!existing) {
        const { error: insertError } = await supabaseAdmin.from("newsletter subscribers").insert([{ email, subscriber_token: token, confirmed_at: now }]);
        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabaseAdmin.from("newsletter subscribers").update({ confirmed_at: now }).eq("email", email);
        if (updateError) throw updateError;
      }
      return new Response(JSON.stringify({ success: true, message: "Subscribed" }), { headers: { "Content-Type": "application/json" } });
    }

    if (op === "unsubscribe") {
      const { error } = await supabaseAdmin.from("newsletter subscribers").delete().eq("email", email);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, message: "Unsubscribed" }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ success: false, message: "Unknown operation." }), { status: 400, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("profile-subscribe error", err);
    return new Response(JSON.stringify({ success: false, message: "Server error." }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export default function ProfileSubscribe() {
  return null;
}
