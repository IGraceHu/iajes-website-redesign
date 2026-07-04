import { createOrResendConfirmation } from "../server/newsletter.server.js";
import { useActionData } from "react-router";

export async function action({ request }) {
    const formData = await request.formData();
    const email = (formData.get("email") || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
        return { success: false, message: "Please enter a valid email address." };
    }

    try {
        const result = await createOrResendConfirmation(email);
        if (result.status === "already") {
            return { success: true, message: "You're already subscribed to IAJES News." };
        }
        return { success: true, message: "Thanks! Please check your inbox to confirm your subscription." };
    } catch (err) {
        console.error(err);
        return { success: false, message: "Unable to process subscription right now." };
    }
}

export default function SubscribeRequest() {
    const actionData = useActionData();
    return (
        <main className="min-h-screen bg-white px-6 py-24 text-black">
            <div className="mx-auto max-w-xl rounded-lg border border-gray-light p-8 text-center">
                <h1 className="mb-4 text-2xl font-semibold">Subscription</h1>
                <p className="text-base">{actionData?.message ?? "Processing subscription request..."}</p>
            </div>
        </main>
    );
}
