import { useState, useActionState } from "react";
import { NavLink } from "react-router";
import { Popup } from "../../components/popup";
import { supabase } from "../../supabase";

export function meta() {
  return [
    { title: "Forgot Password" },
    { name: "", content: "" },
  ];
}

/*
  Returns true once the reset email is sent
  Returns "invalid" if email is incorrect
  Returns "error" if there was an error
*/
async function sendReset(data) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: window.location.origin + "/signin",
    });

    if (error) {
      if (error.message.toLowerCase().includes("invalid") || error.message.toLowerCase().includes("not found")) {
        return "invalid";
      }
      return "error";
    }

    return true;
  } catch (err) {
    console.error("Password reset error:", err);
    return "error";
  }
}

function ResetForm({ setShowPopup, setPopupMessage, setFormSuccess }) {
  const [state, formAction] = useActionState(validate, { email: null });
  const [emailRequired, setEmailRequired] = useState(false);

  async function validate(previousState, formData) {
    const data = {
      email: formData.get("email"),
      validated: true
    };

    if ((data.email === null) || (data.email === "") || (!data.email.includes("@"))) {
      setEmailRequired(true);
      data.validated = false;
    }

    if (data.validated) {
      const result = await sendReset(data);
      if (result === true) {
        setFormSuccess(true);
      } else {
        if (result === "invalid") {
          setPopupMessage("The e-mail was invalid.");
        } else if (result === "error") {
          setPopupMessage("An error occured.");
        }
        setShowPopup(true);
      }
    }

    return data;
  }

  function checkEmpty(value) {
    if (value == "") {
      setEmailRequired(true);
    } else {
      setEmailRequired(false);
    }
  }

  return (
    <div>
      <p className="pb-5 text-center w-sm">Enter your email address and we will send you a password reset link.</p>

      <form action={formAction} className="md:w-sm w-full duration-200">
        <label for="email">Email:</label><br />
        <input id="email" name="email" type="text" defaultValue={state?.email} placeholder="Enter your email address"
          className={"input-text w-full " + (emailRequired && "input-required")}
          onChange={(e) => checkEmpty(e.target.value)} />
        <div className="input-error">Please enter a valid email address.</div>

        <br /><br />

        <input type="submit" value="Send password reset e-mail" className="button w-full"></input>
      </form>
    </div>
  )
}

export default function SignIn() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [formSuccess, setFormSuccess] = useState(false);

  const popup = {
    content: <div className="w-full h-30 text-center flex justify-center items-center">{popupMessage}</div>
  }

  return (
    <div className="h-screen flex flex-col justify-between">
      <Popup id="forget-password" show={showPopup} setShow={setShowPopup} details={popup} />

      <div className="relative flex justify-between content-center p-2 shadow-sm z-1">
        <NavLink to="/" end className="relative hover:text-teal-500 duration-200 p-4 bg-white z-1">
          IAJES Home
        </NavLink>
      </div>

      <div className="lg:px-40 px-10 py-20 duration-200 flex flex-col items-center">
        <h4>Reset your password</h4>
        {!formSuccess && <ResetForm setShowPopup={setShowPopup} setPopupMessage={setPopupMessage} setFormSuccess={setFormSuccess} />}
        {formSuccess && <p className="pb-5 text-center w-sm">A password reset link has been sent to your email. Please click on the link in the email to reset your password.</p>}
      </div>
      <div className="bg-primary-dark h-20 w-full"></div>
    </div>
  );
}
