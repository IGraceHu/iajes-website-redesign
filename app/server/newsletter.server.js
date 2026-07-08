import { transporter } from "./mail.server.js";
import { supabase } from "../supabase.js";
import { supabaseAdmin } from "../server/supabaseAdmin.server";

const newsletterUrl = "https://iajes-website--iajes-site.us-east4.hosted.app/newsletter";

export async function publishNewsletter(newsletterId) {
    const { data: subscribers, error } = await supabaseAdmin
        .from("newsletter subscribers")
        .select("email, subscriber_token, confirmed_at")
        .not("confirmed_at", "is", null);

    if (error) throw error;

    const senderAddress = process.env.GMAIL_USER || "iajes.network@gmail.com";
    const subject = "IAJES News - Notification";

    for (const subscriber of subscribers || []) {
        const html = `
            <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5; text-align: center; font-size: 1rem;">
                <img style="margin-bottom: 0.5rem; height: 4rem" src="https://iajes-website--iajes-site.us-east4.hosted.app/assets/logo-iajes.svg" alt="IAJES Logo"/>
                <p>A new IAJES newsletter has been published.</p>
                <p>
                    <a href="${newsletterUrl}" style="display:inline-block;padding:10px 16px;background-color:#1EA493;color:#fff;text-decoration:none;border-radius:4px;">View the news here.</a>
                </p>
                <a href="https://iajes-website--iajes-site.us-east4.hosted.app/unsubscribe?token=${subscriber.subscriber_token}" style="color:#1EA493;text-decoration:none;">Unsubscribe from IAJES News</a>
                <hr>
                <p>Se ha publicado un nuevo boletín de IAJES.</p>
                <p>
                    <a href="${newsletterUrl}" style="display:inline-block;padding:10px 16px;background-color:#1EA493;color:#fff;text-decoration:none;border-radius:4px;">Vea las noticias aquí.</a>
                </p>
                <p style="font-size:0.9rem;color:#6b7280">
                    <a href="https://iajes-website--iajes-site.us-east4.hosted.app/unsubscribe?token=${subscriber.subscriber_token}" style="color:#1EA493;text-decoration:none;">Cancelar la suscripción a IAJES News</a>
                </p>
            </div>
        `;

        await transporter.sendMail({
            from: `"IAJES Newsletter" <${senderAddress}>`,
            to: subscriber.email,
            subject,
            html,
        });
    }

    return { sent: (subscribers || []).length };
}

// FOR LANDING and NEWSLETTER SUBSCRIPTION FORMS

export async function sendConfirmationEmail(email, subscriber_token) {
    const subject = "IAJES News - Confirm Subscription";
    const confirmUrl = `https://iajes-website--iajes-site.us-east4.hosted.app/subscribe?token=${subscriber_token}`;

    const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height:1.5; text-align: center; font-size: 1rem;">
        <img style="margin-bottom: 0.5rem; height: 4rem" src="https://iajes-website--iajes-site.us-east4.hosted.app/assets/logo-iajes.svg" alt="IAJES Logo"/>
        <p>Thank you for your interest in IAJES News! Confirm your subscription below.</p>
        <p>
            <a href="${confirmUrl}" style="display:inline-block;padding:10px 16px;background-color:#1EA493;color:#fff;text-decoration:none;border-radius:4px;">Yes, subscribe me to this list.</a>
        </p>
        <p style="font-size:0.9rem;color:#6b7280">If you received this email by mistake, simply delete it.<br>You won't be subscribed if you don't click the confirmation link above.</p>
        <hr>
        <p>¡Gracias por su interés en IAJES News! Confirme su suscripción a continuación.</p>
        <p>
            <a href="${confirmUrl}" style="display:inline-block;padding:10px 16px;background-color:#1EA493;color:#fff;text-decoration:none;border-radius:4px;">Sí, suscríbeme a esta lista.</a>
        </p>
        <p style="font-size:0.9rem;color:#6b7280">Si ha recibido este correo electrónico por error, simplemente elimínelo.<br>No se suscribirá si no hace clic en el enlace de confirmación anterior.</p>
    </div>
  `;

    await transporter.sendMail({
        from: `"IAJES Newsletter" <${process.env.GMAIL_USER}>`,
        to: email,
        subject,
        html,
    });
}

export async function createOrResendConfirmation(email) {
    const { data, error } = await supabaseAdmin
        .from("newsletter subscribers")
        .select("email, subscriber_token, confirmed_at")
        .eq("email", email)
        .limit(1)
        .maybeSingle();

    if (error) throw error;

    if (data) {
        if (data.confirmed_at) return { status: "already" };
        await sendConfirmationEmail(email, data.subscriber_token);
        return { status: "resent" };
    }

    const token = (globalThis.crypto && globalThis.crypto.randomUUID) ? globalThis.crypto.randomUUID() : require('crypto').randomUUID();
    const { error: insertError } = await supabaseAdmin
        .from("newsletter subscribers")
        .insert([{ email, subscriber_token: token, confirmed_at: null }]);

    if (insertError) throw insertError;

    await sendConfirmationEmail(email, token);
    return { status: "created" };
}

export async function confirmSubscriberByToken(token) {
    const { data, error } = await supabaseAdmin
        .from("newsletter subscribers")
        .select("confirmed_at")
        .eq("subscriber_token", token)
        .limit(1)
        .maybeSingle();
    if (error) throw error;
    if (!data) return { found: false };
    if (data.confirmed_at) return { found: true, already: true };

    const now = new Date().toISOString();
    const { error: updateError } = await supabaseAdmin
        .from("newsletter subscribers")
        .update({ confirmed_at: now })
        .eq("subscriber_token", token);
    if (updateError) throw updateError;
    return { found: true, confirmed: true };
}

export async function unsubscribeByToken(token) {
    const { error } = await supabaseAdmin
        .from("newsletter subscribers")
        .delete()
        .eq("subscriber_token", token);
    if (error) throw error;
    return { unsubscribed: true };
}

// FOR PROFILE & SIGNUP SUBSCRIPTION CHECKBOXES

//check if user is subscribed
export async function isSubscribed(email) {
    const { data, error } = await supabaseAdmin
        .from("newsletter subscribers")
        .select("email")
        .eq("email", email)
        .not("confirmed_at", "is", null) //CHECK
        .limit(1)
        .maybeSingle();

    if (error) throw error;

    return !!data; // !! makes into a boolean (double NOT)
}

export async function subscribeConfirmedUser(email) {
    const { data, error } = await supabaseAdmin
        .from("newsletter subscribers")
        .select("subscriber_token, confirmed_at")
        .eq("email", email)
        .limit(1)
        .maybeSingle();

    if (error) throw error;

    const now = new Date().toISOString();

    // Already subscribed and confirmed //CHECK
    if (data?.confirmed_at) {
        return { subscribed: true, already: true };
    }

    // Exists but hasn't been confirmed yet
    if (data) {
        const { error: updateError } = await supabaseAdmin
            .from("newsletter subscribers")
            .update({ confirmed_at: now })
            .eq("email", email);

        if (updateError) throw updateError;

        return { subscribed: true, confirmedExisting: true };
    }

    // Doesn't exist yet
    const token =
        globalThis.crypto?.randomUUID?.() ??
        require("crypto").randomUUID();

    const { error: insertError } = await supabaseAdmin
        .from("newsletter subscribers")
        .insert([
            {
                email,
                subscriber_token: token,
                confirmed_at: now,
            },
        ]);

    if (insertError) throw insertError;

    return { subscribed: true, created: true };
}

export async function unsubscribeByEmail(email) {
    const { error } = await supabaseAdmin
        .from("newsletter subscribers")
        .delete()
        .eq("email", email);

    if (error) throw error;

    return { unsubscribed: true };
}
