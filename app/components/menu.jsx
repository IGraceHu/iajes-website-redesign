import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { supabase } from "../supabase";
// import iajesLogo from "../"

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

    const menuDropdownEls = document.getElementsByClassName("menu-dropdown-container");
    console.log(menuDropdownEls);
    for (let menuDropdown of menuDropdownEls) {
      menuDropdown.addEventListener("mouseout", function() { menuDropdown.classList.remove("active"); });
      menuDropdown.addEventListener("mouseover", function() { menuDropdown.classList.add("active"); });
      console.log(menuDropdown);
    }

    const sideMenuDropdownEls = document.getElementsByClassName("side-menu-dropdown-container");
    for (let sideMenuDropdown of sideMenuDropdownEls) {
      sideMenuDropdown.addEventListener("mouseover", function() { sideMenuDropdown.classList.add("active"); })
      sideMenuDropdown.addEventListener("mouseout", function() { sideMenuDropdown.classList.remove("active"); })
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

  }, [sideMenuActive, accountDdActive, currentUser])


  return (
    <div id="menu" className="sticky top-0 bg-white z-100">
      <div className="border-b border-b-gray-light h-6 z-1">

      </div>

      <div className="relative flex items-center content-center md:justify-start justify-between shadow-sm z-1 duration-200">
        <button onClick={() => setSideMenuActive(!sideMenuActive)} className="relative md:hidden block px-4 text-primary-dark hover:cursor-pointer hover:text-secondary-light duration-200 bg-white z-1">
          <i className="bi bi-list text-[1.7rem]"></i>
        </button>
        <NavLink to="/" end className="relative duration-200 hover:opacity-70 md:px-4 bg-white z-1 my-1 md:mr-auto">
          <img className="h-[2.5rem]" src="/assets/logo.svg" />
          {/* <img className="h-[1.5rem] ml-4 md:hidden block" src="/assets/logo-iajes-text.svg" /> */}
        </NavLink>


        <div className="relative flex items-center w-120 hidden md:flex">
          <div className="menu-dropdown-container">
            <div className="menu-dropdown-button link p-4">
              What We Do
            </div>
            <div className="menu-dropdown -mt-[240px] py-1">
              <NavLink to="/about" className="link py-3 px-4 pr-10">
                About IAJES
              </NavLink>
              <NavLink to="/organizational-structure" className="link py-3 px-4 pr-10">
                Organizational Structure
              </NavLink>
              <NavLink to="/newsletter" className="link py-3 px-4 pr-10">
                Newsletter
              </NavLink>
            </div>
          </div>

          <NavLink to="/task-forces" className="link p-4">
            Task Forces
          </NavLink>

          <div className="menu-dropdown-container">
            <div className="menu-dropdown-button link p-4">
              Resources
            </div>
            <div className="menu-dropdown -mt-[220px] py-1">
              <NavLink to="/video-resources" end className="link py-3 px-4 pr-10">
                Video Resources
              </NavLink>
              <NavLink to="/webinars" end className="link py-3 px-4 pr-10">
                Webinars
              </NavLink>
            </div>
          </div>

          <div className="menu-dropdown-container">
            <div className="menu-dropdown-button link p-4">
              Meetings
            </div>
            <div className="menu-dropdown -mt-[220px] py-1">
              <NavLink to="/regional-meetings" end className="link py-3 px-4 pr-10">
                Regional Meetings
              </NavLink>
              <NavLink to="/international-meetings" end className="link py-3 px-4 pr-10">
                International Meetings
              </NavLink>
            </div>
          </div>

          <NavLink to="/search" end className="link p-4">
            People
          </NavLink>

        </div>

        {!loggedIn &&
          <NavLink to="/signin" end className="block button my-1.5">
            Sign In
          </NavLink>
        }
        {loggedIn &&
          <div className="menu-dropdown-container">
            <div className="menu-dropdown-button rounded-full bg-primary-dark w-10 h-10 my-1.5 ml-2 mr-4 hover:bg-secondary-light duration-200 cursor-pointer" 
                >
            </div>
            <div className="menu-dropdown right-3 -mt-[220px]">
              <NavLink to={"/profile/" + currentUser?.id} end className="link p-4 pb-0">
                Profile
              </NavLink>
              <div className="p-4">
                <button onClick={handleSignOut} className="block button">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        }

      </div>

      <div id="side-menu-container" className="absolute w-full z-0">
        <div id="side-menu-bg" className="absolute w-full h-svh top-0 left-0 z-0 bg-white opacity-10 hidden" onClick={() => setSideMenuActive(false)}></div>
        <div id="side-menu" className="absolute bg-white flex flex-col w-70 h-dvh duration-400 ease-in-out shadow-md z-1 -left-70" >
          
          <div className="side-menu-dropdown-container mt-7 pb-3 px-7">
            <div className="side-menu-dropdown-button link py-3">
              What We Do
            </div>
            <div className="side-menu-dropdown flex flex-col border-l-2 border-primary-light">
              <NavLink to="/about" end className="link py-2 px-4">
                  About IAJES
                </NavLink>
              <NavLink to="/organizational-structure" end className="link py-2 px-4">
                Organizational Structure
              </NavLink>
              <NavLink to="/newsletter" end className="link py-2 px-4">
                Newsletter
              </NavLink>
            </div>
          </div>

          <NavLink to="/task-forces" end className="link py-3 pb-6 px-7">
            Task Forces
          </NavLink>

          <div className="side-menu-dropdown-container py-3 px-7">
            <div className="side-menu-dropdown-button link pb-3">
              Resources
            </div>
            <div className="side-menu-dropdown flex flex-col border-l-2 border-primary-light">
              <NavLink to="/video-resources" end className="link py-2 px-4">
                Video Resources
              </NavLink>
              <NavLink to="/webinars" end className="link py-2 px-4">
                Webinars
              </NavLink>
            </div>
          </div>

          <div className="side-menu-dropdown-container py-3 px-7">
            <div className="side-menu-dropdown-button link pb-3">
              Meetings
            </div>
            <div className="side-menu-dropdown flex flex-col border-l-2 border-primary-light">
              <NavLink to="/regional-meetings" end className="link py-2 px-4">
                Regional Meetings
              </NavLink>
              <NavLink to="/international-meetings" end className="link py-2 px-4">
                International Meetings
              </NavLink>
            </div>
          </div>

          <NavLink to="/search" end className="link py-3 px-7">
            People
          </NavLink>
        </div>
      </div>

    </div>
  );
}