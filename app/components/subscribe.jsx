export function Subscribe() {

    return (
        <div className="flex flex-row justify-center lg:px-40 px-10 py-20 duration-200 border-y border-y-gray-light shadow-sm">
            <div className="w-full flex flex-col justify-start text-left">
                <h2>Subscribe to the IAJES Newsletter!</h2>
                <p>Receive regular IAJES updates on annual meetings, new projects, and more, straight to your inbox!</p>
                <form className="flex flex-col items-center sm:flex-row gap-5 my-5">
                    <label htmlFor="newsletter-subscribe-email" className="sr-only">Email address</label>
                    <input id="newsletter-subscribe-email" name="email" type="email" className="input input-text h-full w-full sm:w-3/4 m-0!" placeholder="email@example.com" autoComplete="email" />
                    {/* <input type="email" placeholder="email@example.com" className="w-full sm:w-3/4 p-3 border-2 border-black bg-white rounded-md"></input> */}
                    <input type="submit" className="button h-full w-1/4" value="Subscribe"></input>
                </form>
            </div>
        </div>
    );
}
