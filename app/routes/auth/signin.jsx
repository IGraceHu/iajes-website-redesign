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

  const errorPopup = {
    content: <div className="w-full h-30 text-center flex justify-center items-center">{popupErrorMessage}</div>
  }

  return (
    <div className="h-screen flex flex-col justify-between">
      <Popup id="sign-in" show={showPopup} setShow={setShowPopup} details={errorPopup} />

      <div className="relative flex justify-between content-center p-2 shadow-sm z-1">
        <NavLink to="/" end className="relative hover:text-teal-500 duration-200 p-4 bg-white z-1">
          IAJES Home
        </NavLink>
      </div>

      <div className="lg:px-40 px-10 py-20 duration-200 flex flex-col items-center">
        <h4>Sign in to <span className="text-primary-dark">IAJES</span></h4>
        <form action={formAction} className="md:w-md w-full duration-200">
          <label for="email">Email:</label><br />
          <input id="email" name="email" type="text" defaultValue={state?.email}
            className={"input-text w-full " + (formRequired?.email && "input-required")}
            onChange={(e) => checkEmpty(e.target.value, "email")} />
          <div className="input-error">Please enter a valid email address.</div>

          <br /><br />

          <div className="w-full flex justify-between">
            <label for="pwd">Password:</label>
            <p><a href="/forget-password">Forgot password?</a></p>
          </div>
          <input id="pwd" name="pwd" type="password" defaultValue={state?.pwd}
            className={"input-text w-full " + (formRequired?.pwd && "input-required")}
            onChange={(e) => checkEmpty(e.target.value, "pwd")} />
          <div className="input-error">Please enter your password.</div>

          <br /><br />

          <input type="submit" value="Sign In" className="button w-full"></input>

          <div className="w-full my-5 text-center text-disabled-light">
            <p>New here? <a href="/signup">Create an account.</a></p>
          </div>
        </form>
      </div>
      <div className="bg-primary-dark h-20 w-full"></div>
    </div>
  );
}
