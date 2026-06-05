import { useState, useActionState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Popup } from "../../components/popup";
import { updateRequired } from "../../helpers/form";
import { supabase } from "../../supabase";

export function meta() {
  return [
    { title: "Sign In" },
    { name: "", content: "" },
  ];
}

/*
  Returns true once user is authenticated
  Returns "invalid" if email or password is incorrect
  Returns "error" if there was an error
*/
async function signIn(data) {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.pwd,
    });

    if (error) {
      if (error.message.toLowerCase().includes("invalid")) {
        return "invalid";
      }
      return "error";
    }

    // Update last_sign_in in custom users table
    if (authData.user) {
      await supabase
        .from('users')
        .update({ last_sign_in: authData.user.last_sign_in_at || new Date().toISOString() })
        .eq('id', authData.user.id);
    }

    return true;
  } catch (err) {
    console.error("Sign in error:", err);
    return "error";
  }
}

export default function SignIn() {
  let navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupErrorMessage, setPopupErrorMessage] = useState("");

  const [state, formAction] = useActionState(validate, { email: null, pwd: null });
  const [formRequired, setFormRequired] = useState({ email: false, pwd: false });

  async function validate(previousState, formData) {
    const data = { email: formData.get("email"), pwd: formData.get("pwd") };
    let validated = true;

    let updatedFormRequired = structuredClone(formRequired);
    for (let input in formRequired) {
      updatedFormRequired = updateRequired(data[input], input, updatedFormRequired);
      if (updatedFormRequired[input]) {
        validated = false;
      }
    }
    if ((!data.email.includes("@"))) {
      updatedFormRequired.email = true;
      validated = false;
    }
    setFormRequired(updatedFormRequired);

    if (validated) {
      const result = await signIn(data);
      if (result === true) {
        navigate("/");
      } else {
        if (result === "invalid") {
          setPopupErrorMessage("Your email or password was invalid.");
        } else if (result === "error") {
          setPopupErrorMessage("An error occured.");
        }
        setShowPopup(true);
      }
    }

    return data;
  }

  function checkEmpty(value, inputName) {
    const updatedFormRequired = updateRequired(value, inputName, formRequired);
    if (updatedFormRequired != formRequired) {
      setFormRequired(updatedFormRequired);
    }
  }

  return (
    <div className="h-screen flex flex-col justify-between">
      <Popup id="sign-in" label="Sign-in error" show={showPopup} setShow={setShowPopup} >
        <div className="w-full h-30 text-center flex justify-center items-center" role="alert">{popupErrorMessage}</div>
      </Popup>

      <div className="relative flex justify-center content-center p-2 shadow-sm z-1">
        <NavLink to="/" end className="relative duration-200 hover:opacity-70 px-4 bg-white z-1">
          <img className="h-[2.5rem]" src="/assets/logo.svg" alt="IAJES logo" />
        </NavLink>
      </div>

      <main id="main-content" className="lg:px-40 px-10 py-20 duration-200 flex flex-col items-center">
        <h1 style={{ fontSize: "1.7rem", textTransform: "none", color: "var(--color-secondary-light)" }}>Sign in to <span className="text-primary-dark">IAJES</span></h1>
        <form action={formAction} className="md:w-md w-full duration-200">
          <label htmlFor="email">Email:</label><br />
          <input id="email" name="email" type="email" defaultValue={state?.email} placeholder="Email" autoComplete="email"
            className={"input-text w-full " + (formRequired?.email && "input-required")}
            onChange={(e) => checkEmpty(e.target.value, "email")} />
          <div className="input-error">Please enter a valid email address.</div>

          <br /><br />

          <div className="w-full flex justify-between">
            <label htmlFor="pwd">Password:</label>
            <p><a href="/forget-password">Forgot password?</a></p>
          </div>
          <input id="pwd" name="pwd" type="password" defaultValue={state?.pwd} placeholder="Password" autoComplete="current-password"
            className={"input-text w-full " + (formRequired?.pwd && "input-required")}
            onChange={(e) => checkEmpty(e.target.value, "pwd")} />
          <div className="input-error">Please enter your password.</div>

          <br /><br />

          <input type="submit" value="Sign In" className="button w-full"></input>

          <div className="w-full my-5 text-center text-disabled-light">
            <p>New here? <a href="/signup">Create an account.</a></p>
          </div>
        </form>
      </main>
      <div className="bg-primary-dark h-20 w-full"></div>
    </div>
  );
}
