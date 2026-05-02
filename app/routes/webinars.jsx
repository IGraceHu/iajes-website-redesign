import { useEffect, useState } from "react";
import { Form, useNavigation } from "react-router";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Popup } from "../components/popup";
import { Pagination } from "../components/pagination";
import { isAdminRequest } from "../lib/auth.server";
import { buildWebinarPayloadFromForm, createWebinar, listWebinars } from "../data/webinars.server";
import { WebinarFormFields, emptyFormValues, toFieldErrorState } from "../components/webinar-form-fields";
import "../styles/video-resources.css";

export function meta() {
  return [
    { title: "Webinars" },
    { name: "", content: "" },
  ];
}

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

export async function loader({ request }) {
  const list = await listWebinars();

  return {
    ...list,
    isAdmin: isAdminRequest(request),
  };
}

export async function action({ request }) {
  if (!isAdminRequest(request)) {
    return {
      ok: false,
      error: "Only logged-in admins can edit webinars.",
      fieldErrors: {},
      values: emptyFormValues(),
      intent: "create",
    };
  }

  const formData = await request.formData();
  const intent = typeof formData.get("intent") === "string" ? formData.get("intent").trim() : "";

  if (intent !== "create") {
    return {
      ok: false,
      error: "Unknown action.",
      fieldErrors: {},
      values: emptyFormValues(),
      intent,
    };
  }

  const parsed = buildWebinarPayloadFromForm(formData);
  if (parsed.error) {
    return {
      ok: false,
      error: parsed.error,
      fieldErrors: parsed.fieldErrors,
      values: parsed.values,
      intent,
    };
  }

  const result = await createWebinar(parsed.payload);
  if (result.error) {
    return {
      ok: false,
      error: result.error,
      fieldErrors: {},
      values: parsed.values,
      intent,
    };
  }

  return {
    ok: true,
    message: "Webinar created.",
    fieldErrors: {},
    values: emptyFormValues(),
    intent,
  };
}

export default function Webinars({ loaderData, actionData }) {
  const navigation = useNavigation();

  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const isAdmin = Boolean(loaderData?.isAdmin);
  const webinars = Array.isArray(loaderData?.webinars) ? loaderData.webinars : [];

  useEffect(() => {
    if (actionData?.ok) {
      setShowCreatePopup(false);
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
  const createErrors = actionData?.intent === "create" ? actionData?.fieldErrors || {} : {};
  const createValues = actionData?.intent === "create" ? actionData?.values || emptyFormValues() : emptyFormValues();

  const createPopupDetails = {
    content: (
      <div className="h-[80vh] md:w-[70vw]">
        <h4>Create new webinar</h4>
        <Form id="create-webinar-form" method="post" className="mb-5 h-[80%] overflow-y-auto">
          <input type="hidden" name="intent" value="create" />
          <WebinarFormFields values={createValues} fieldErrors={toFieldErrorState(createErrors)} />
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

  const itemsPerPage = 6;
  const pageStartIndex = currentPage * itemsPerPage;
  const pagedWebinars = webinars.slice(pageStartIndex, pageStartIndex + itemsPerPage);

  const usingSupabase = loaderData?.source === "supabase";

  return (
    <>
      {isAdmin ? (
        <div className="absolute left-0 top-0 z-1000">
          <Popup id="webinars-create" show={showCreatePopup} setShow={setShowCreatePopup} details={createPopupDetails} />
        </div>
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
            Supabase webinar data is unavailable right now, so this page is showing temporary test webinars.
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
