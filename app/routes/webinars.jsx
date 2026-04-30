import { useEffect, useState } from "react";
import { Form, useNavigation } from "react-router";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Popup } from "../components/popup";
import { Pagination } from "../components/pagination";
import { createWebinar, deleteWebinar, listWebinars, updateWebinar } from "../data/webinars.server";
import "../styles/video-resources.css";

export function meta() {
  return [
    { title: "Webinars" },
    { name: "", content: "" },
  ];
}

function toText(formData, fieldName) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

function parseParagraphs(rawText) {
  if (!rawText) {
    return [];
  }

  return rawText
    .split(/\n\s*\n/g)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseLines(rawText) {
  if (!rawText) {
    return [];
  }

  return rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseJsonArray(rawText, fieldLabel) {
  if (!rawText) {
    return { value: [], error: null };
  }

  try {
    const parsed = JSON.parse(rawText);
    if (!Array.isArray(parsed)) {
      return {
        value: null,
        error: `${fieldLabel} must be a JSON array.`,
      };
    }

    return {
      value: parsed,
      error: null,
    };
  } catch {
    return {
      value: null,
      error: `${fieldLabel} is not valid JSON.`,
    };
  }
}

function parseWebinarPayload(formData) {
  const title = toText(formData, "title");
  const date = toText(formData, "date");

  if (!title) {
    return { payload: null, error: "Title is required." };
  }

  if (!date) {
    return { payload: null, error: "Date is required." };
  }

  const linksResult = parseJsonArray(toText(formData, "links"), "Links");
  if (linksResult.error) {
    return { payload: null, error: linksResult.error };
  }

  const speakersResult = parseJsonArray(toText(formData, "speakers"), "Speakers");
  if (speakersResult.error) {
    return { payload: null, error: speakersResult.error };
  }

  const extraRecordingsResult = parseJsonArray(toText(formData, "extraRecordings"), "Additional recordings");
  if (extraRecordingsResult.error) {
    return { payload: null, error: extraRecordingsResult.error };
  }

  return {
    payload: {
      title,
      date,
      subtitle: toText(formData, "subtitle"),
      thumbnail: toText(formData, "thumbnail"),
      primaryVideo: toText(formData, "primaryVideo"),
      overview: parseParagraphs(toText(formData, "overview")),
      highlights: parseLines(toText(formData, "highlights")),
      images: parseLines(toText(formData, "images")),
      links: linksResult.value,
      speakers: speakersResult.value,
      extraRecordings: extraRecordingsResult.value,
    },
    error: null,
  };
}

function joinParagraphs(value) {
  return Array.isArray(value) ? value.join("\n\n") : "";
}

function joinLines(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function toPrettyJson(value) {
  return Array.isArray(value) && value.length ? JSON.stringify(value, null, 2) : "";
}

export async function loader() {
  return await listWebinars();
}

export async function action({ request }) {
  const formData = await request.formData();
  const intent = toText(formData, "intent");

  if (intent === "delete") {
    const webinarId = toText(formData, "id");

    if (!webinarId) {
      return { ok: false, error: "Missing webinar id." };
    }

    const result = await deleteWebinar(webinarId);
    if (result.error) {
      return { ok: false, error: result.error };
    }

    return { ok: true, message: "Webinar deleted." };
  }

  const parsedPayload = parseWebinarPayload(formData);
  if (parsedPayload.error) {
    return { ok: false, error: parsedPayload.error };
  }

  if (intent === "create") {
    const result = await createWebinar(parsedPayload.payload);
    if (result.error) {
      return { ok: false, error: result.error };
    }

    return { ok: true, message: "Webinar created." };
  }

  if (intent === "update") {
    const webinarId = toText(formData, "id");

    if (!webinarId) {
      return { ok: false, error: "Missing webinar id." };
    }

    const result = await updateWebinar(webinarId, parsedPayload.payload);
    if (result.error) {
      return { ok: false, error: result.error };
    }

    return { ok: true, message: "Webinar updated." };
  }

  return { ok: false, error: "Unknown action." };
}

function WebinarFormFields({ webinar }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="webinar-title">Webinar title:</label>
          <br />
          <input id="webinar-title" name="title" type="text" className="input input-text w-full" defaultValue={webinar?.title || ""} />
        </div>
        <div>
          <label htmlFor="webinar-date">Date:</label>
          <br />
          <input
            id="webinar-date"
            name="date"
            type="text"
            className="input input-text w-full"
            placeholder="Month day, year"
            defaultValue={webinar?.date || ""}
          />
        </div>
      </div>

      <label htmlFor="webinar-subtitle">Subtitle:</label>
      <br />
      <input id="webinar-subtitle" name="subtitle" type="text" className="input input-text w-full" defaultValue={webinar?.subtitle || ""} />

      <br />
      <br />
      <label htmlFor="webinar-thumbnail">Thumbnail image URL:</label>
      <br />
      <input
        id="webinar-thumbnail"
        name="thumbnail"
        type="text"
        className="input input-text w-full"
        defaultValue={webinar?.thumbnail || ""}
      />

      <br />
      <br />
      <label htmlFor="webinar-primary-video">Main recording embed URL:</label>
      <br />
      <input
        id="webinar-primary-video"
        name="primaryVideo"
        type="text"
        className="input input-text w-full"
        defaultValue={webinar?.primaryVideo || ""}
      />

      <br />
      <br />
      <label htmlFor="webinar-overview">Overview (separate paragraphs with a blank line):</label>
      <br />
      <textarea
        id="webinar-overview"
        name="overview"
        className="input input-text h-28 w-full"
        defaultValue={joinParagraphs(webinar?.overview)}
      />

      <br />
      <br />
      <label htmlFor="webinar-highlights">Key points (one item per line):</label>
      <br />
      <textarea
        id="webinar-highlights"
        name="highlights"
        className="input input-text h-28 w-full"
        defaultValue={joinLines(webinar?.highlights)}
      />

      <br />
      <br />
      <label htmlFor="webinar-images">Image URLs (one URL per line):</label>
      <br />
      <textarea
        id="webinar-images"
        name="images"
        className="input input-text h-28 w-full"
        defaultValue={joinLines(webinar?.images)}
      />

      <br />
      <br />
      <label htmlFor="webinar-links">Links JSON array:</label>
      <br />
      <textarea
        id="webinar-links"
        name="links"
        className="input input-text h-28 w-full"
        defaultValue={toPrettyJson(webinar?.links)}
      />

      <br />
      <br />
      <label htmlFor="webinar-speakers">Speakers JSON array:</label>
      <br />
      <textarea
        id="webinar-speakers"
        name="speakers"
        className="input input-text h-36 w-full"
        defaultValue={toPrettyJson(webinar?.speakers)}
      />

      <br />
      <br />
      <label htmlFor="webinar-extra-recordings">Additional recordings JSON array:</label>
      <br />
      <textarea
        id="webinar-extra-recordings"
        name="extraRecordings"
        className="input input-text h-28 w-full"
        defaultValue={toPrettyJson(webinar?.extraRecordings)}
      />
    </>
  );
}

function WebinarCard({ webinarInfo, isAdmin, onEdit }) {
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

      {isAdmin ? (
        <div className="mt-2 flex flex-wrap gap-2 px-2">
          <button type="button" className="button button-light" onClick={() => onEdit(webinarInfo)}>
            Edit
          </button>
          <Form
            method="post"
            onSubmit={(event) => {
              if (!window.confirm(`Delete webinar \"${webinarInfo.title}\"?`)) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="intent" value="delete" />
            <input type="hidden" name="id" value={webinarInfo.id} />
            <button type="submit" className="button button-light">
              Delete
            </button>
          </Form>
        </div>
      ) : null}
    </div>
  );
}

export default function Webinars({ loaderData, actionData }) {
  const navigation = useNavigation();

  const isAdmin = true;
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingWebinar, setEditingWebinar] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const webinars = Array.isArray(loaderData?.webinars) ? loaderData.webinars : [];

  useEffect(() => {
    if (actionData?.ok) {
      setShowCreatePopup(false);
      setShowEditPopup(false);
      setEditingWebinar(null);
    }
  }, [actionData]);

  useEffect(() => {
    const itemsPerPage = 6;
    const maxPage = Math.max(Math.ceil(webinars.length / itemsPerPage) - 1, 0);
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [currentPage, webinars.length]);

  const isSubmitting = navigation.state === "submitting";

  const createPopupDetails = {
    content: (
      <div className="h-[80vh] md:w-[70vw]">
        <h4>Create new webinar</h4>
        <Form id="create-webinar-form" method="post" className="mb-5 h-[80%] overflow-y-auto">
          <input type="hidden" name="intent" value="create" />
          <WebinarFormFields webinar={null} />
        </Form>
      </div>
    ),
    buttons: [
      {
        text: isSubmitting ? "Saving..." : "Save",
        onclick: () => {
          if (isSubmitting) {
            return;
          }
          document.getElementById("create-webinar-form")?.requestSubmit();
        },
      },
    ],
    defaultButton: {
      text: "Cancel",
      onclick: () => {
        if (!isSubmitting) {
          setShowCreatePopup(false);
        }
      },
    },
    closeOnBlur: false,
  };

  const editPopupDetails = {
    content: (
      <div className="h-[80vh] md:w-[70vw]" key={editingWebinar?.id || "new"}>
        <h4>Edit webinar</h4>
        <Form id="edit-webinar-form" method="post" className="mb-5 h-[80%] overflow-y-auto">
          <input type="hidden" name="intent" value="update" />
          <input type="hidden" name="id" value={editingWebinar?.id || ""} />
          <WebinarFormFields webinar={editingWebinar} />
        </Form>
      </div>
    ),
    buttons: [
      {
        text: isSubmitting ? "Saving..." : "Save",
        onclick: () => {
          if (isSubmitting) {
            return;
          }
          document.getElementById("edit-webinar-form")?.requestSubmit();
        },
      },
    ],
    defaultButton: {
      text: "Cancel",
      onclick: () => {
        if (!isSubmitting) {
          setShowEditPopup(false);
          setEditingWebinar(null);
        }
      },
    },
    closeOnBlur: false,
  };

  const itemsPerPage = 6;
  const pageStartIndex = currentPage * itemsPerPage;
  const pagedWebinars = webinars.slice(pageStartIndex, pageStartIndex + itemsPerPage);

  const usingSupabase = loaderData?.source === "supabase";

  return (
    <>
      {isAdmin ? (
        <>
          <div className="absolute left-0 top-0 z-1000">
            <Popup id="webinars-create" show={showCreatePopup} setShow={setShowCreatePopup} details={createPopupDetails} />
          </div>
          <div className="absolute left-0 top-0 z-1000">
            <Popup id="webinars-edit" show={showEditPopup} setShow={setShowEditPopup} details={editPopupDetails} />
          </div>
        </>
      ) : null}

      <Menu />
      <div className="px-10 py-20 duration-200 lg:px-40">
        <div className="mb-5 flex flex-col justify-between md:mb-0 md:flex-row md:items-center">
          <h1>Webinars</h1>
          {isAdmin ? (
            <button className="button" onClick={() => setShowCreatePopup(true)}>
              <i className="bi bi-plus-lg mr-3" />
              Create new webinar
            </button>
          ) : null}
        </div>

        {!usingSupabase ? (
          <div className="mb-4 mt-3 rounded-md border-2 border-primary-light bg-primary-extralight p-3 text-secondary-dark">
            Showing fallback static webinar data. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to enable Supabase-backed webinars.
          </div>
        ) : null}

        {loaderData?.error ? (
          <div className="mb-4 rounded-md border-2 border-error/35 bg-error/10 p-3 text-error">
            Supabase error: {loaderData.error}
          </div>
        ) : null}

        {actionData?.error ? (
          <div className="mb-4 rounded-md border-2 border-error/35 bg-error/10 p-3 text-error">{actionData.error}</div>
        ) : null}

        {actionData?.ok ? (
          <div className="mb-4 rounded-md border-2 border-primary-light bg-primary-extralight p-3 text-secondary-dark">
            {actionData.message}
          </div>
        ) : null}

        <p>Explore recordings, speaker sessions, and supporting materials from IAJES webinars.</p>
        <a href="/webinars/archive" className="button button-light mt-3 inline-block">
          View webinars archive
        </a>

        <div className="my-5 grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {pagedWebinars.map((webinar) => (
            <WebinarCard
              key={webinar.id}
              webinarInfo={webinar}
              isAdmin={isAdmin}
              onEdit={(selectedWebinar) => {
                setEditingWebinar(selectedWebinar);
                setShowEditPopup(true);
              }}
            />
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
