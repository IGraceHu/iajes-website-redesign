import { useState, useActionState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Popup } from "../../components/popup";
import { updateRequired } from "../../helpers/form";
import { supabase } from "../../supabase";

export function meta() {
  return [
    { title: "Sign Up" },
    { name: "", content: "" },
  ];
}

/*
  Returns { success: true } once user is authenticated
  Returns { success: false, message: "..." } if an error has occurred
*/
async function signUp(data) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.pwd,
      options: {
        data: {
          fname: data.fname,
          lname: data.lname,
        },
      },
    });

    if (authError) {
      const msg = authError.message?.toLowerCase() || "";
      if (msg.includes("already registered") || msg.includes("already been registered")) {
        return { success: false, message: "An account with this email already exists. Please sign in instead." };
      }
      if (msg.includes("password") && (msg.includes("short") || msg.includes("least"))) {
        return { success: false, message: "Password is too short. Please use at least 6 characters." };
      }
      if (msg.includes("valid email") || msg.includes("invalid") || msg.includes("email")) {
        return { success: false, message: "Please enter a valid email address." };
      }
      if (msg.includes("rate limit") || msg.includes("too many")) {
        return { success: false, message: "Too many sign-up attempts. Please try again later." };
      }
      return { success: false, message: authError.message || "An unexpected error occurred during sign up." };
    }

    // Sync to custom users table
    if (authData.user) {
      const { error: dbError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          fname: data.fname,
          lname: data.lname,
          created_at: authData.user.created_at,
          last_sign_in: authData.user.last_sign_in_at || new Date().toISOString(),
          email: data.email,
          role: "member"
        }]);

      if (dbError) {
        console.error("Error syncing to users table:", dbError);
        return { success: false, message: "Account was created but failed to save user profile. Please try signing in." };
      }
    }

    return { success: true };
  } catch (err) {
    console.error("Sign up error:", err);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}

export default function SignUp() {
  let navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [state, formAction] = useActionState(validate, { fname: null, lname: null, email: null, pwd: null, rePwd: null, subscribe: null });
  const [formRequired, setFormRequired] = useState({ fname: false, lname: false, email: false, pwd: false, rePwd: false });

  async function validate(previousState, formData) {
    const data = {
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      email: formData.get("email"),
      pwd: formData.get("pwd"),
      rePwd: formData.get("re-pwd"),
    };

    if (formData.get("subscribe") == "on") {
      data.subscribe = true;
    } else {
      data.subscribe = false;
    }

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
      const result = await signUp(data);
      if (result.success) {
        navigate("/");
      } else {
        setErrorMessage(result.message);
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

  function checkPassword() {
    const updatedFormRequired = structuredClone(formRequired);
    if (document.getElementById("re-pwd").value !== document.getElementById("pwd").value) {
      updatedFormRequired.rePwd = true;
    } else {
      updatedFormRequired.rePwd = false;
    }

    if (updatedFormRequired != formRequired) {
      setFormRequired(updatedFormRequired);
    }

  }

  const errorPopup = {
    content: <div className="w-full h-30 text-center flex justify-center items-center">{errorMessage || "An unexpected error occurred."}</div>
  }

  return (
    <div className="flex flex-col justify-between">
      <Popup id="sign-up" show={showPopup} setShow={setShowPopup} details={errorPopup} />

      <div className="relative flex justify-between content-center p-2 shadow-sm z-1">
        <NavLink to="/" end className="relative hover:text-teal-500 duration-200 p-4 bg-white z-1">
          IAJES Home
        </NavLink>
      </div>

      <div className="lg:px-40 px-10 py-20 duration-200 flex flex-col items-center">
        <h4>Create a <span className="text-primary-dark">IAJES</span> account</h4>
        <form action={formAction} className="lg:w-md w-full duration-200">
          <div className="w-full mb-5 grid md:grid-cols-2 grid-cols-1 gap-5">
            <div>
              <label for="fname">First name:</label><br />
              <input id="fname" name="fname" type="text" defaultValue={state?.fname}
                className={"input-text w-full " + (formRequired?.fname && "input-required")}
                onChange={(e) => checkEmpty(e.target.value, "fname")} />
              <div className="input-error">This field is required.</div>
            </div>
            <div>
              <label for="lname">Last name:</label><br />
              <input id="lname" name="lname" type="text" defaultValue={state?.lname}
                className={"input-text w-full " + (formRequired?.lname && "input-required")}
                onChange={(e) => checkEmpty(e.target.value, "lname")} />
              <div className="input-error">This field is required.</div>
            </div>
          </div>

          <label for="email">Email:</label><br />
          <input id="email" name="email" type="text" defaultValue={state?.email}
            className={"input-text w-full " + (formRequired?.email && "input-required")}
            onChange={(e) => checkEmpty(e.target.value, "email")} />
          <div className="input-error">Please enter a valid email address.</div>

          <br /><br />

          <label for="pwd">Create Password:</label><br />
          <input id="pwd" name="pwd" type="password" defaultValue={state?.pwd}
            className={"input-text w-full " + (formRequired?.pwd && "input-required")}
            onChange={(e) => { checkPassword(); checkEmpty(e.target.value, "pwd"); }} />
          <div className="input-error">Please enter a password.</div>

          <br /><br />

          <label for="re-pwd">Re-enter Password:</label><br />
          <input id="re-pwd" name="re-pwd" type="password" defaultValue={state?.rePwd}
            className={"input-text w-full " + (formRequired?.rePwd && "input-required")}
            onChange={checkPassword} />
          <div className="input-error">Passwords must match.</div>

          <br /><br />

          <label for="subscribe" className="checkbox">
            <input id="subscribe" name="subscribe" type="checkbox" defaultChecked={state?.subscribe} /><p>Subscribe to IAJES Weekly</p>
          </label>

          <br /><br />

          <input type="submit" value="Create Account" className="button w-full"></input>
          <div className="w-full my-5 text-center text-disabled-light">
            <p>Already have an account? <a href="/signin">Sign in here.</a></p>
          </div>
        </form>

      </div>
      <div className="bg-primary-dark h-20 w-full"></div>
    </div>
  );
}
