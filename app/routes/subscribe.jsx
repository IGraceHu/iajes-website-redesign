import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { confirmSubscriberByToken } from "../server/newsletter.server";

export async function loader({ request }) {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
        return { success: false, message: "Missing subscription token." };
    }

    try {
        const result = await confirmSubscriberByToken(token);
        if (!result.found) {
            return { success: false, message: "Invalid subscription token." };
        }
        if (result.already) {
            return { success: true, message: "You are already subscribed to IAJES News." };
        }
        if (result.confirmed) {
            return { success: true, message: "Successfully subscribed to IAJES News.<br><br>Redirecting..." };
        }
        return { success: false, message: "Unable to confirm subscription." };
    } catch (err) {
        console.error(err);
        return { success: false, message: "An error occurred while confirming subscription." };
    }
}

export default function SubscribeConfirm() {
    const { success, message } = useLoaderData();
    const navigate = useNavigate();

    useEffect(() => {
        if (success) {
            const t = setTimeout(() => {
                window.location.href = "/";
            }, 2000);
            return () => clearTimeout(t);
        }
    }, [success, navigate]);

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
