import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { supabase } from "../supabase.js";

export async function loader({ request }) {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
        return { success: false, message: "Missing unsubscribe token." };
    }

    const { supabaseAdmin } = await import("../server/supabaseAdmin.server");
    const { error } = await supabaseAdmin
        .from("newsletter subscribers")
        .delete()
        .eq("subscriber_token", token);

    if (error) {
        console.error(error);
        return { success: false, message: "We could not unsubscribe you right now." };
    }

    return { success: true, message: "You have successfully unsubscribed from the IAJES Newsletter.<br><br>Redirecting..." };
}

export default function Unsubscribe() {
    const { success, message } = useLoaderData();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = window.setTimeout(() => {
            window.location.href = "/";
        }, 2000);

        return () => window.clearTimeout(timer);
    }, [navigate]);

    return (
        <main className="min-h-screen bg-white px-6 py-24 text-black">
            <div className="mx-auto max-w-xl rounded-lg border border-gray-light p-8 text-center">
                <h1 className="mb-4 text-2xl font-semibold">Newsletter Subscription</h1>
                <p className="text-base" dangerouslySetInnerHTML={{ __html: message }}></p>
                {!success && <p className="mt-4 text-sm text-gray-600">Please contact support if this issue continues.</p>}
            </div>
        </main>
    );
}
