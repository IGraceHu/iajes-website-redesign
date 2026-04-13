import { useState, useEffect } from "react";
import { NavLink } from "react-router";

export function Menu() {
  const loggedIn = false;
  const [meetingsDdActive, setMeetingsDdActive] = useState(false);
  const [whatWeDoActive, setWhatWeDoActive] = useState(false);
  const [sideMenuActive, setSideMenuActive] = useState(false);


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

    if (sideMenuActive) {
      const sideMenuContEl = document.getElementById("side-menu-container");
      sideMenuContEl.children[1].classList.add("left-0");
      sideMenuContEl.children[0].classList.remove("hidden");
    } else {
      const sideMenuContEl = document.getElementById("side-menu-container");
      sideMenuContEl.children[1].classList.remove("left-0");
      sideMenuContEl.children[0].classList.add("hidden");
    }

  }, [meetingsDdActive, whatWeDoActive, sideMenuActive])


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
                <NavLink to="/about" end className="p-4 pr-10">
                  About IAJES
                </NavLink>
                <NavLink to="/organizational-structure" end className="p-4 pr-10 pb-5">
                  Organizational Structure
                </NavLink>
              </div>
            </div>

            <NavLink to="/task-forces" end className="p-4">
              Task Forces
            </NavLink>

            <NavLink to="/video-resources" end className="p-4">
              Video Resources
            </NavLink>

            <div onBlur={() => setMeetingsDdActive(false)} tabIndex="0">
              <div className="link p-4" onClick={() => setMeetingsDdActive(!meetingsDdActive)}>
                Meetings
              </div>
              <div id="meetings-dd" className="z-2 bg-white absolute flex flex-col rounded-md border border-gray-light shadow-sm duration-200 -mt-3 opacity-0 invisible">
                <NavLink to="/regional-meetings" end className="p-4 pr-10">
                  Regional Meetings
                </NavLink>
                <NavLink to="/international-meetings" end className="p-4 pr-10 pb-5">
                  International Meetings
                </NavLink>
              </div>
            </div>

            <NavLink to="/newsletter" end className="p-4">
              Newsletter
            </NavLink>

            <NavLink to="/search" end className="p-4">
              People
            </NavLink>
          </div>

          <div className="mx-2 flex items-center">
            {!loggedIn &&
              <NavLink to="/signin" end className="block button">
                Sign In
              </NavLink>
            }
            {loggedIn &&
              <NavLink to="/account" end className="block bg-primary-dark hover:bg-secondary-light rounded-full size-13 flex justify-center items-center">
                <i className="bi bi-person text-[1.7rem] text-white"></i>
              </NavLink>
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
          <NavLink to="/international-meetings" end className="pt-10 px-7">
            International Meetings
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
