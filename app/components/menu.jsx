import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { supabase } from "../supabase";
import { Popup } from "../components/popup";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "ja", label: "日本語" },
  { code: "zh-CN", label: "中文" },
  { code: "ar", label: "العربية" },
  { code: "hi", label: "हिन्दी" },
];

let googleLoaded = false;

function loadGoogleTranslate() {
  if (googleLoaded) return;
  googleLoaded = true;

  const addScript = () => {
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  };

  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };

  addScript();
}

export function Menu({ currentEndUrl }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const loggedIn = !!currentUser;
  const [sideMenuActive, setSideMenuActive] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [signOutPopup, setSignOutPopup] = useState(false);
  const [language, setLanguage] = useState("en");

  let isGroupActive = {
    whatWeDo: false,
    resources: false,
    meetings: false
  }

  switch (currentEndUrl) {
    case "/about":
    case "/organizational-structure":
    case "/newsletter":
      isGroupActive.whatWeDo = true;
      break;
    case "/video-resources":
    case "/webinars":
      isGroupActive.resources = true;
      break;
    case "/regional-meetings":
    case "/international-meetings":
      isGroupActive.meetings = true;
      break;
  }

  useEffect(() => {
    // Create hidden container AFTER hydration
    const el = document.createElement("div");
    el.id = "google_translate_element";
    el.style.display = "none";
    document.body.appendChild(el);

    loadGoogleTranslate();
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");

    if (savedLang && savedLang !== "en") {
      document.cookie = `googtrans=/en/${savedLang}; path=/`;
    }

    // Set dropdown UI state only
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {

    const user = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('fname, lname, email, image_url')
          .eq("id", userId);
        if (data[0]) {
          setUserInfo(data[0]);
        }
        else { console.log("error"); }

      } catch (error) {
        console.log("error");
      }
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user.id) {
        user(session.user.id);
      }
    });

    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      user(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setSignOutPopup(true);
  };

  const changeLanguage = (e) => {
    const lang = e.target.value;

    // set the cookie that Google itself uses
    document.cookie = `googtrans=/en/${lang}; path=/`;
    document.cookie = `googtrans=/en/${lang}; domain=${window.location.hostname}; path=/`;

    // Store for your dropdown UI only
    localStorage.setItem("lang", lang);

    // Reload so Google re-runs cleanly
    window.location.reload();
  };

  useEffect(() => {

    const menuDropdownEls = document.getElementsByClassName("menu-dropdown-container");

    for (let menuDropdown of menuDropdownEls) {
      menuDropdown.addEventListener("mouseout", function () { menuDropdown.classList.remove("active-popup"); });
      menuDropdown.addEventListener("mouseover", function () { menuDropdown.classList.add("active-popup"); });
    }

    const sideMenuDropdownEls = document.getElementsByClassName("side-menu-dropdown-container");
    for (let sideMenuDropdown of sideMenuDropdownEls) {
      sideMenuDropdown.addEventListener("mouseout", function () { sideMenuDropdown.classList.remove("active-popup"); })
      sideMenuDropdown.addEventListener("mouseover", function () { sideMenuDropdown.classList.add("active-popup"); })
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

  }, [sideMenuActive, currentUser])


  return (
    <>
      <Popup show={signOutPopup} setShow={setSignOutPopup} closePopup={() => { setSignOutPopup(false); navigate("/"); }} stayOnBlur={true}>
        <p className="text-center mt-6">You have been signed out.</p>
      </Popup>
      <div id="menu" className="sticky top-0 bg-white z-100">
        <div className="border-b border-b-gray-light h-6 z-100 flex flex-row justify-start">
          {/* Secondary Header */}
          {/* Google Translate Dropdown */}
          <select
            value={language}
            onChange={changeLanguage}
            className="link ml-3 text-[0.75rem]! z-100 notranslate text-zinc-400!"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
          {/* Linkedin Social Media Link */}
          <a
            href="https://www.linkedin.com/company/iajes"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 flex items-center text-zinc-400 hover:text-[#0A66C2] transition-colors"
            aria-label="LinkedIn"
          >
            <i className="bi bi-linkedin text-[0.9rem]"></i>
          </a>
        </div>

        <div className="relative flex items-center content-center md:justify-start justify-between shadow-sm z-1 duration-200">
          <button onClick={() => setSideMenuActive(!sideMenuActive)} className="relative md:hidden block px-4 text-primary-dark hover:cursor-pointer hover:text-secondary-light duration-200 bg-white z-1">
            <i className="bi bi-list text-[1.7rem]"></i>
          </button>
          <NavLink to="/" end className="relative duration-200 hover:opacity-70 md:px-4 bg-white z-1 my-1 md:mr-auto">
            <img className="h-[2.5rem]" src="/assets/logo.svg" />
            {/* <img className="h-[1.5rem] ml-4 md:hidden block" src="/assets/logo-iajes-text.svg" /> */}
          </NavLink>


          <div className="relative flex items-center justify-end w-130 hidden md:flex">
            <div className="menu-dropdown-container">
              <div className={"menu-dropdown-button link p-4" + (isGroupActive.whatWeDo ? " active" : "")}>
                What We Do
              </div>
              <div className="menu-dropdown -mt-[240px] py-1">
                <NavLink to="/about" end className="link py-3 px-4 pr-10">
                  About IAJES
                </NavLink>
                <NavLink to="/organizational-structure" end className="link py-3 px-4 pr-10">
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
              <div className={"menu-dropdown-button link p-4" + (isGroupActive.resources ? " active" : "")}>
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
              <div className={"menu-dropdown-button link p-4" + (isGroupActive.meetings ? " active" : "")}>
                Meetings
              </div>
              <div className="menu-dropdown w-45 -mt-[220px] py-1">
                <NavLink to="/regional-meetings" end className="link py-3 px-4">
                  Regional Meetings
                </NavLink>
                <NavLink to="/international-meetings" end className="link py-3 px-4">
                  International Meetings
                </NavLink>
              </div>
            </div>

            <NavLink to="/search" end className="link p-4">
              People
            </NavLink>

          </div>

          {!loggedIn ?
            <NavLink to="/signin" end className="block button m-1.5">
              Sign In
            </NavLink>
            :
            <div className="menu-dropdown-container">
              <div className="menu-dropdown-button rounded-full border-2 border-primary-dark overflow-hidden bg-primary-dark size-11 my-1.5 ml-2 mr-4 flex items-center justify-center text-white hover:text-primary-light hover:border-secondary-light hover:bg-secondary-light duration-200 cursor-pointer">
                {(userInfo?.image_url != null && userInfo?.image_url != "") ?
                  <img className="hover:opacity-90 duration-200 min-w-full min-h-full" src={userInfo.image_url} />
                  :
                  <i className="bi bi-person-fill text-[1.5rem]"></i>}
              </div>
              <div className="menu-dropdown right-3 py-1 -mt-[220px]">
                <div className="text-sm py-3 px-3 mx-2 mb-2 border-b-2 border-primary-light flex items-center">

                  <div className="mr-4">
                    <div className="rounded-full bg-primary-dark size-15 border-2 border-primary-dark overflow-hidden flex items-center justify-center">
                      {(userInfo?.image_url != null && userInfo?.image_url != "") ?
                        <img className="min-w-full min-h-full" src={userInfo.image_url} />
                        :
                        <i className="bi bi-person-fill text-[2rem] text-white"></i>}
                    </div>
                  </div>
                  <div className="pr-6">
                    {userInfo?.fname} {userInfo?.lname}
                    <br />
                    <span className="text-disabled-light italic">{userInfo?.email}</span>
                  </div>

                </div>
                <NavLink to={"/profile/" + currentUser?.id} end className="link py-3 px-4 pr-10">
                  Profile
                </NavLink>
                <div className="px-4 pt-2 pb-3">
                  <button onClick={handleSignOut} className="block button w-full">
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
              <div className={"side-menu-dropdown-button link py-3" + (isGroupActive.whatWeDo ? " active" : "")}>
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
              <div className={"side-menu-dropdown-button link pb-3" + (isGroupActive.resources ? " active" : "")}>
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
              <div className={"side-menu-dropdown-button link pb-3" + (isGroupActive.meetings ? " active" : "")}>
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
    </>
  );
}