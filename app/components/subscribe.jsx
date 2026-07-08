import { Form, useActionData } from "react-router";

export function Subscribe() {
    const actionData = useActionData();

    return (
        <div className="flex flex-row justify-center lg:px-40 px-10 py-20 duration-200 border-y border-y-gray-light shadow-sm">
            <div className="w-full flex flex-col justify-start text-left">
                <h2>Subscribe to the IAJES Newsletter!</h2>
                <p>Receive regular IAJES updates on annual meetings, new projects, and more, straight to your inbox!</p>
                <Form method="post" action="/subscribe-request" className="flex flex-col items-center sm:flex-row gap-5 my-5 w-full">
                    <input name="email" type="email" className="input input-text h-full w-full sm:w-3/4 m-0!" placeholder="email@example.com" required />
                    <button type="submit" className="button h-full w-1/4">Subscribe</button>
                </Form>
                {actionData?.message && <div className="mt-3 text-sm text-gray-dark">{actionData.message}</div>}
            </div>
        </div>
    );
}

export function SubscribeLanding() {
    return (
        <div className="h-100 my-20 flex flex-col justify-center items-center text-center">
            <h4 className="text-glow">Subscribe to our Newsletter</h4>
            <Form method="post" action="/subscribe-request" className="flex flex-col justify-center items-center">
                <input name="email" type="email" className="box-glow input input-text md:w-md w-sm" placeholder="Enter email here..." required />
                <button type="submit" className="box-glow button w-xs m-5">Subscribe</button>
            </Form>
        </div>
    );
}