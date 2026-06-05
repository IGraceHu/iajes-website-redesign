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

function DesktopDropdown({ label, active, className = "", children }) {
  return (
    <details
      className="menu-dropdown-container"
      onMouseEnter={(event) => {
        event.currentTarget.open = true;
      }}
      onMouseLeave={(event) => {
        event.currentTarget.open = false;
      }}
    >
      <summary className={"menu-dropdown-button link p-4 list-none" + (active ? " active" : "")}>
        {label}
      </summary>
      <div className={"menu-dropdown py-1 " + className}>
        {children}
      </div>
    </details>
  );
}

function SideDropdown({ label, active, children }) {
  return (
    <details className="side-menu-dropdown-container py-3 px-7">
      <summary className={"side-menu-dropdown-button link pb-3 list-none" + (active ? " active" : "")}>
        {label}
      </summary>
      <div className="side-menu-dropdown flex flex-col border-l-2 border-primary-light">
        {children}
      </div>
    </details>
  );
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
          .select('fname, lname, email, image_url, roles')
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
      if (session?.user.id) {
        user(session.user.id);
      }
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

  return (
    <>
      <Popup id="signout" label="Sign-out confirmation" show={signOutPopup} setShow={setSignOutPopup} closePopup={() => { setSignOutPopup(false); navigate("/"); }} stayOnBlur={true}>
        <p className="text-center mt-6">You have been signed out.</p>
      </Popup>
      <header id="menu" className="sticky top-0 bg-white z-100">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <div className="border-b border-b-gray-light h-6 relative z-999 flex flex-row justify-end">
          {/* Secondary Header */}
          {/* Linkedin Social Media Link */}
          <a
            href="https://www.linkedin.com/company/iajes"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-3 flex items-center text-zinc-400 hover:text-[#0A66C2] transition-colors"
            aria-label="LinkedIn"
          >
            <i className="bi bi-linkedin text-[0.9rem]" aria-hidden="true"></i>
          </a>
          {/* Google Translate Dropdown */}
          <select
            value={language}
            onChange={changeLanguage}
            aria-label="Select page language"
            className="link mr-3 text-[0.75rem]! z-100 notranslate text-zinc-400!"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex items-center content-center md:justify-start justify-between shadow-sm z-1 duration-200">
          <button
            type="button"
            onClick={() => setSideMenuActive(!sideMenuActive)}
            className="relative md:hidden block px-4 text-primary-dark hover:cursor-pointer hover:text-secondary-light duration-200 bg-white z-1"
            aria-label={sideMenuActive ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="side-menu"
            aria-expanded={sideMenuActive}
          >
            <i className="bi bi-list text-[1.7rem]" aria-hidden="true"></i>
          </button>
          <NavLink to="/" end className="relative duration-200 flex items-center hover:opacity-70 md:px-4 bg-white z-1 my-1 md:mr-auto shrink-0" aria-label="IAJES home">
            <img className="h-[2.5rem]" src="/assets/logo.svg" alt="IAJES logo" />
            <p id="logo-title" className="ml-2 text-secondary-light text-xs w-47" style={{fontWeight: 400}}>International Association of Jesuit Engineering and Sciences Schools</p>
            {/* <img className="h-[1.5rem] ml-4 md:hidden block" src="/assets/logo-iajes-text.svg" /> */}
          </NavLink>


          <nav className="relative flex items-center justify-end hidden md:flex shrink-0" aria-label="Primary navigation">
            <DesktopDropdown label="What We Do" active={isGroupActive.whatWeDo}>
              <NavLink to="/about" end className="link py-3 px-4 pr-10">
                About IAJES
              </NavLink>
              <NavLink to="/organizational-structure" end className="link py-3 px-4 pr-10">
                Organizational Structure
              </NavLink>
              <NavLink to="/newsletter" className="link py-3 px-4 pr-10">
                Newsletter
              </NavLink>
            </DesktopDropdown>

            <NavLink to="/task-forces" className="link p-4">
              Task Forces
            </NavLink>

            <DesktopDropdown label="Resources" active={isGroupActive.resources}>
              <NavLink to="/video-resources" end className="link py-3 px-4 pr-10">
                Video Resources
              </NavLink>
              <NavLink to="/webinars" end className="link py-3 px-4 pr-10">
                Webinars
              </NavLink>
            </DesktopDropdown>

            <DesktopDropdown label="Meetings" active={isGroupActive.meetings} className="w-45">
              <NavLink to="/regional-meetings" end className="link py-3 px-4">
                Regional Meetings
              </NavLink>
              <NavLink to="/international-meetings" end className="link py-3 px-4">
                International Meetings
              </NavLink>
            </DesktopDropdown>

            <NavLink to="/search" end className="link p-4">
              People
            </NavLink>

          </nav>

          {!loggedIn ?
            <NavLink to="/signin" end className="block button m-1.5 shrink-0">
              Sign In
            </NavLink>
            :
            <details className="menu-dropdown-container">
              <summary className="menu-dropdown-button list-none rounded-full border-2 border-primary-dark overflow-hidden bg-primary-dark size-11 my-1.5 ml-2 mr-4 flex items-center justify-center text-white hover:text-primary-light hover:border-secondary-light hover:bg-secondary-light duration-200 cursor-pointer" aria-label="Open account menu">
                {(userInfo?.image_url != null && userInfo?.image_url != "") ?
                  <img className="hover:opacity-90 duration-200 min-w-full min-h-full object-cover" src={userInfo.image_url} alt={`${userInfo?.fname || "User"} ${userInfo?.lname || ""} profile photo`.trim()} />
                  :
                  <i className="bi bi-person-fill text-[1.5rem]" aria-hidden="true"></i>}
              </summary>
              <div className="menu-dropdown right-3 py-1 -mt-[220px]">
                <div className="text-sm py-3 px-3 mx-2 mb-2 border-b-2 border-primary-light flex items-center">

                  <div className="mr-4">
                    <div className="rounded-full bg-primary-dark size-15 border-2 border-primary-dark overflow-hidden flex items-center justify-center">
                      {(userInfo?.image_url != null && userInfo?.image_url != "") ?
                        <img className="min-w-full min-h-full object-cover" src={userInfo.image_url} alt="" aria-hidden="true" />
                        :
                        <i className="bi bi-person-fill text-[2rem] text-white" aria-hidden="true"></i>}
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
                { userInfo?.roles.includes("admin-super") ?
                  <NavLink to={"/admin-options"} end className="link py-3 px-4 pr-10">
                    Administrator Options
                  </NavLink>
                  :
                  <></>
                }
                <div className="px-4 pt-3 pb-3">
                  <button onClick={handleSignOut} className="block button w-full">
                    Sign Out
                  </button>
                </div>
              </div>
            </details>
          }

        </div>

        <div id="side-menu-container" className="absolute w-full z-0">
          <div id="side-menu-bg" className={"absolute w-full h-svh top-0 left-0 z-0 bg-black opacity-30 " + (sideMenuActive ? "" : "hidden")} onClick={() => setSideMenuActive(false)} aria-hidden="true"></div>
          <nav
            id="side-menu"
            className={"absolute bg-white flex flex-col w-70 h-dvh duration-400 ease-in-out shadow-md z-1 " + (sideMenuActive ? "left-0" : "-left-70")}
            aria-label="Mobile navigation"
            aria-hidden={!sideMenuActive}
            {...(!sideMenuActive ? { inert: "" } : {})}
          >

            <div className="mt-4 px-7">
              <button type="button" className="button button-light w-full" onClick={() => setSideMenuActive(false)}>
                Close menu
              </button>
            </div>

            <SideDropdown label="What We Do" active={isGroupActive.whatWeDo}>
              <NavLink to="/about" end className="link py-2 px-4" onClick={() => setSideMenuActive(false)}>
                About IAJES
              </NavLink>
              <NavLink to="/organizational-structure" end className="link py-2 px-4" onClick={() => setSideMenuActive(false)}>
                Organizational Structure
              </NavLink>
              <NavLink to="/newsletter" end className="link py-2 px-4" onClick={() => setSideMenuActive(false)}>
                Newsletter
              </NavLink>
            </SideDropdown>

            <NavLink to="/task-forces" end className="link py-3 pb-6 px-7" onClick={() => setSideMenuActive(false)}>
              Task Forces
            </NavLink>

            <SideDropdown label="Resources" active={isGroupActive.resources}>
              <NavLink to="/video-resources" end className="link py-2 px-4" onClick={() => setSideMenuActive(false)}>
                Video Resources
              </NavLink>
              <NavLink to="/webinars" end className="link py-2 px-4" onClick={() => setSideMenuActive(false)}>
                Webinars
              </NavLink>
            </SideDropdown>

            <SideDropdown label="Meetings" active={isGroupActive.meetings}>
              <NavLink to="/regional-meetings" end className="link py-2 px-4" onClick={() => setSideMenuActive(false)}>
                Regional Meetings
              </NavLink>
              <NavLink to="/international-meetings" end className="link py-2 px-4" onClick={() => setSideMenuActive(false)}>
                International Meetings
              </NavLink>
            </SideDropdown>

            <NavLink to="/search" end className="link py-3 px-7" onClick={() => setSideMenuActive(false)}>
              People
            </NavLink>
          </nav>
        </div>

      </header>
    </>
  );
}
