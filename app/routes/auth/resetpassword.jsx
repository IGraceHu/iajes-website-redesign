import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { consumePasswordRecoveryCallback, supabase } from "../../supabase";

export function meta() {
  return [
    { title: "Reset Password" },
    { name: "description", content: "Choose a new password for your IAJES account." },
  ];
}

export default function ResetPassword() {
  const [status, setStatus] = useState("checking");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const hasAuthError = [queryParams, hashParams].some((params) =>
      params.has("error") || params.has("error_code") || params.has("error_description")
    );

    if (hasAuthError) {
      consumePasswordRecoveryCallback();
      setStatus("unavailable");
      return;
    }

    let isRecoveryCallback = consumePasswordRecoveryCallback();
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;

      if (event === "PASSWORD_RECOVERY" && session) {
        isRecoveryCallback = true;
        consumePasswordRecoveryCallback();
        setStatus("ready");
      } else if (event === "INITIAL_SESSION" && !isRecoveryCallback) {
        setStatus("unavailable");
      } else if (event === "SIGNED_OUT") {
        isRecoveryCallback = false;
        setStatus("unavailable");
      }
    });

    if (isRecoveryCallback) setStatus("ready");

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function submitPassword(event) {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");
    const confirmation = formData.get("confirmation");

    if (password !== confirmation) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    setStatus("submitting");
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setErrorMessage(error.message);
        setStatus("ready");
        return;
      }

      setStatus("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update your password.");
      setStatus("ready");
    }
  }

  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="relative flex justify-center content-center p-2 shadow-sm z-1">
        <NavLink to="/" end className="relative duration-200 hover:opacity-70 px-4 bg-white z-1">
          <img className="h-[2.5rem]" src="/assets/logo.svg" alt="IAJES Homepage" />
        </NavLink>
      </div>

      <main className="lg:px-40 px-10 py-20 duration-200 flex flex-col items-center">
        <h4>Reset your password</h4>

        {status === "checking" && <p role="status">Checking your reset link...</p>}

        {status === "unavailable" && (
          <div className="text-center">
            <p className="pb-5">This password reset link is invalid or has expired.</p>
            <button className="button w-full">
                <NavLink to="/forget-password">Request a new reset link</NavLink>
            </button>
          </div>
        )}

        {(status === "ready" || status === "submitting") && (
          <form onSubmit={submitPassword} className="md:w-sm w-full duration-200">
            <label htmlFor="password">New password:</label><br />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              className="input-text w-full"
              placeholder="At least 6 characters"
            />

            <br /><br />

            <label htmlFor="confirmation">Confirm new password:</label><br />
            <input
              id="confirmation"
              name="confirmation"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              className="input-text w-full"
              placeholder="Enter the password again"
            />

            {errorMessage && <p className="text-red-700" role="alert">{errorMessage}</p>}

            <br /><br />

            <button type="submit" className="button w-full" disabled={status === "submitting"}>
              {status === "submitting" ? "Updating password..." : "Update password"}
            </button>
          </form>
        )}

        {status === "success" && (
          <div className="text-center">
            <p className="pb-5">Your password has been updated.</p>
            <button className="button w-full">
                <NavLink to="/signin">Continue to sign in</NavLink>
            </button>
          </div>
        )}
      </main>
      <div className="bg-primary-dark h-20 w-full"></div>
    </div>
  );
}