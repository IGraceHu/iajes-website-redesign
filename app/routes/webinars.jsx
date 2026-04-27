import { useState } from "react";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Popup } from "../components/popup";
import { Pagination } from "../components/pagination";
import { getWebinars } from "../data/webinars";
import "../styles/video-resources.css";

export function meta() {
  return [
    { title: "Webinars" },
    { name: "", content: "" },
  ];
}

const webinars = getWebinars();

function WebinarCard({ webinarInfo }) {
  return (
    <div className="resource-card">
      <a
        href={`/webinar/${webinarInfo.id}`}
        className="block w-full rounded-md border-2 border-transparent p-2 hover:border-primary-light"
      >
        <div className="mb-2 flex h-[52vw] w-full items-center overflow-hidden rounded-md bg-primary-dark sm:h-[28vw] lg:h-[14vw]">
          {webinarInfo.thumbnail ? (
            <img className="h-full w-full object-cover" src={webinarInfo.thumbnail} alt={webinarInfo.title} />
          ) : (
            <div className="relative h-full w-full p-5">
              <img className="absolute -bottom-20 -right-20 z-0 w-[50%]" src="/assets/landing-disc-4a.svg" alt="" />
              <h5 className="relative z-1 text-white">{webinarInfo.title}</h5>
            </div>
          )}
        </div>
        <h6>{webinarInfo.title}</h6>
        {webinarInfo.subtitle ? <p className="font-semibold text-black">{webinarInfo.subtitle}</p> : null}
        <p className="text-sm text-disabled-light">
          <i>{webinarInfo.date}</i>
        </p>
      </a>
    </div>
  );
}

export default function Webinars() {
  const isAdmin = true;
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const popupDetails = {
    content: (
      <div className="h-[80vh] md:w-[70vw]">
        <h4>Create new webinar</h4>
        <form className="mb-5 h-[80%] overflow-y-auto">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="webinar-title">Webinar title:</label>
              <br />
              <input id="webinar-title" type="text" className="input input-text w-full" />
            </div>
            <div>
              <label htmlFor="webinar-date">Date:</label>
              <br />
              <input id="webinar-date" type="text" className="input input-text w-full" placeholder="Month day, year" />
            </div>
          </div>

          <label htmlFor="webinar-subtitle">Subtitle:</label>
          <br />
          <input id="webinar-subtitle" type="text" className="input input-text w-full" />
          <br />
          <br />

          <label htmlFor="webinar-thumbnail">Thumbnail image:</label>
          <br />
          <input id="webinar-thumbnail" type="file" className="ml-1" />

          <br />
          <br />
          <label htmlFor="webinar-primary-video">Primary recording link:</label>
          <br />
          <input id="webinar-primary-video" type="text" className="input input-text w-full" />

          <br />
          <br />
          <label htmlFor="webinar-description">Description:</label>
          <br />
          <textarea id="webinar-description" className="input input-text h-28 w-full" />

          <br />
          <br />
          <label htmlFor="webinar-speakers">Speakers and session details:</label>
          <br />
          <textarea
            id="webinar-speakers"
            className="input input-text h-36 w-full"
            placeholder="Add speaker names, affiliations, and recording links"
          />
        </form>
      </div>
    ),
    buttons: [{ text: "Save", onclick: () => console.log("saved") }],
    defaultButton: { text: "Cancel", onclick: () => setShowPopup(false) },
    closeOnBlur: false,
  };

  const itemsPerPage = 6;
  const pageStartIndex = currentPage * itemsPerPage;
  const pagedWebinars = webinars.slice(pageStartIndex, pageStartIndex + itemsPerPage);

  return (
    <>
      {isAdmin ? (
        <div className="absolute left-0 top-0 z-1000">
          <Popup id="webinars" show={showPopup} setShow={setShowPopup} details={popupDetails} />
        </div>
      ) : null}

      <Menu />
      <div className="px-10 py-20 duration-200 lg:px-40">
        <div className="mb-5 flex flex-col justify-between md:mb-0 md:flex-row md:items-center">
          <h1>Webinars</h1>
          {isAdmin ? (
            <button className="button" onClick={() => setShowPopup(true)}>
              <i className="bi bi-plus-lg mr-3" />
              Create new webinar
            </button>
          ) : null}
        </div>

        <p>
          Explore recordings, speaker sessions, and supporting materials from IAJES webinars.
        </p>

        <div className="my-5 grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {pagedWebinars.map((webinar) => (
            <WebinarCard key={webinar.id} webinarInfo={webinar} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={webinars.length}
          itemsPerPage={itemsPerPage}
          pageRange={5}
        />
      </div>
      <Footer />
    </>
  );
}
