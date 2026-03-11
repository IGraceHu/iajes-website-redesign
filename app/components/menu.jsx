import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { supabase } from "../supabase";

export function Menu() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const loggedIn = !!currentUser;
  const [meetingsDdActive, setMeetingsDdActive] = useState(false);
  const [whatWeDoActive, setWhatWeDoActive] = useState(false);
  const [sideMenuActive, setSideMenuActive] = useState(false);
  const [accountDdActive, setAccountDdActive] = useState(false);


  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    navigate("/");
  };

  useEffect(() => {

    if (meetingsDdActive) {
      const meetingsDdEl = document.getElementById("meetings-dd");
      meetingsDdEl.classList.remove("invisible");
      meetingsDdEl.classList.remove("opacity-0");
      meetingsDdEl.classList.add("mt-0");
    } else {
      const meetingsDdEl = document.getElementById("meetings-dd");
      meetingsDdEl.classList.add("opacity-0");
      meetingsDdEl.classList.add("invisible");
      meetingsDdEl.classList.remove("mt-0");
    }

    if (whatWeDoActive) {
      const whatWeDoEl = document.getElementById("what-we-do-dd");
      whatWeDoEl.classList.remove("invisible");
      whatWeDoEl.classList.remove("opacity-0");
      whatWeDoEl.classList.add("mt-0");
    } else {
      const whatWeDoEl = document.getElementById("what-we-do-dd");
      whatWeDoEl.classList.add("opacity-0");
      whatWeDoEl.classList.add("invisible");
      whatWeDoEl.classList.remove("mt-0");
    }
    if (loggedIn) {
      if (accountDdActive) {
        const accountDdEl = document.getElementById("account-dd");
        accountDdEl.classList.remove("invisible");
        accountDdEl.classList.remove("opacity-0");
        accountDdEl.classList.add("mt-1");
      } else {
        const accountDdEl = document.getElementById("account-dd");
        accountDdEl.classList.add("opacity-0");
        accountDdEl.classList.add("invisible");
        accountDdEl.classList.remove("mt-1");
      }
    }
    

    if (sideMenuActive) {
      const sideMenuContEl = document.getElementById("side-menu-container");
      sideMenuContEl.children[1].classList.add("left-0");
      sideMenuContEl.children[0].classList.remove("hidden");
    } else {
      const sideMenuContEl = document.getElementById("side-menu-container");
      sideMenuContEl.children[1].classList.remove("left-0");
      sideMenuContEl.children[0].classList.add("hidden");
    }

  }, [meetingsDdActive, whatWeDoActive, sideMenuActive, accountDdActive])


  return (
    <div id="menu" className="sticky top-0 bg-white z-100">
      <div className="border-b border-b-gray-light h-6 z-1">

      </div>

      <div className="relative flex justify-between content-center p-2 shadow-sm z-1">
        <div className="flex content-center">
          <button onClick={() => setSideMenuActive(!sideMenuActive)} className="relative md:hidden block px-4 text-primary-dark hover:cursor-pointer hover:text-secondary-light duration-200 bg-white z-1">
            <i className="bi bi-list text-[1.7rem]"></i>
          </button>
          <NavLink to="/" end className="relative duration-200 hover:opacity-70 px-4 bg-white z-1">
            <img className="w-18 h-full" src="../assets/logo.svg" />
          </NavLink>
        </div>

        <div className="flex content-center">
          <div className="md:flex hidden">
            <div onBlur={() => setWhatWeDoActive(false)} tabIndex="0">
              <div className="link p-4" onClick={() => setWhatWeDoActive(!whatWeDoActive)}>
                What We Do
              </div>
              <div id="what-we-do-dd" className="z-2 bg-white absolute flex flex-col rounded-md border border-gray-light shadow-sm duration-200 -mt-3 opacity-0 invisible">
                <NavLink to="/about" end className="link p-4 pr-10">
                  About IAJES
                </NavLink>
                <NavLink to="/organizational-structure" end className="link p-4 pr-10 pb-5">
                  Organizational Structure
                </NavLink>
              </div>
            </div>

            <NavLink to="/task-forces" end className="link p-4">
              Task Forces
            </NavLink>

            <NavLink to="/video-resources" end className="link p-4">
              Video Resources
            </NavLink>

            <div onBlur={() => setMeetingsDdActive(false)} tabIndex="0">
              <div className="link p-4" onClick={() => setMeetingsDdActive(!meetingsDdActive)}>
                Meetings
              </div>
              <div id="meetings-dd" className="z-2 bg-white absolute flex flex-col rounded-md border border-gray-light shadow-sm duration-200 -mt-3 opacity-0 invisible">
                <NavLink to="/regional-meetings" end className="link p-4 pr-10">
                  Regional Meetings
                </NavLink>
                <NavLink to="/international-meetings" end className="link p-4 pr-10 pb-5">
                  International Meetings
                </NavLink>
              </div>
            </div>

            <NavLink to="/newsletter" end className="link p-4">
              Newsletter
            </NavLink>

            <NavLink to="/search" end className="link p-4">
              People
            </NavLink>
          </div>

          <div className="mx-2 flex items-center gap-3">
            {!loggedIn &&
              <NavLink to="/signin" end className="block button">
                Sign In
              </NavLink>
            }
            {loggedIn &&
              <div onBlur={() => setAccountDdActive(false)} className="relative" tabIndex="0">
                <div className="rounded-full bg-primary-dark w-12 h-12 p-4 hover:bg-secondary-light duration-200 cursor-pointer" onClick={() => setAccountDdActive(!accountDdActive)}>
                </div>
                <div id="account-dd" className="z-2 w-50 bg-white absolute right-0 flex flex-col rounded-md border border-gray-light shadow-sm duration-200 -mt-3 opacity-0 invisible">
                  <NavLink to={"/profile/" + currentUser?.id} end className="p-4 pb-0">
                    Profile
                  </NavLink>
                  <div end className="p-4">
                    <button onClick={handleSignOut} className="block button">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <div id="side-menu-container" className="absolute w-full z-0 md:hidden">
        <div id="side-menu-bg" className="absolute w-full h-svh top-0 left-0 z-0 bg-white opacity-10 hidden" onClick={() => setSideMenuActive(false)}></div>
        <div id="side-menu" className="absolute bg-white flex flex-col w-70 h-dvh duration-400 ease-in-out shadow-md z-1 -left-70" >
          <NavLink to="/about" end className="pt-10 px-7">
            What We Do
          </NavLink>
          <NavLink to="/task-forces" end className="pt-10 px-7">
            Task Forces
          </NavLink>
          <NavLink to="/regional-meetings" end className="pt-10 px-7">
            Regional Meetings
          </NavLink>
          <NavLink to="/biennal-meetings" end className="pt-10 px-7">
            Biennal Meetings
          </NavLink>
          <NavLink to="/newsletter" end className="pt-10 px-7">
            Newsletter
          </NavLink>
          <NavLink to="/search" end className="py-10 px-7">
            People
          </NavLink>
        </div>
      </div>

    </div>
  );
}