import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { getWebinarById } from "../data/webinars";
import "../styles/video-resources.css";

export function meta({ data }) {
  return [
    { title: data?.title ? `${data.title} | Webinar` : "Webinar" },
  ];
}

export async function loader({ params }) {
  const found = getWebinarById(params.webinarId);

  return {
    id: found?.id ?? "",
    title: found?.title ?? "",
    date: found?.date ?? "",
    subtitle: found?.subtitle ?? "",
    primaryVideo: found?.primaryVideo ?? "",
    overview: Array.isArray(found?.overview) ? found.overview : [],
    highlights: Array.isArray(found?.highlights) ? found.highlights : [],
    speakers: Array.isArray(found?.speakers) ? found.speakers : [],
    extraRecordings: Array.isArray(found?.extraRecordings) ? found.extraRecordings : [],
    images: Array.isArray(found?.images) ? found.images : [],
    links: Array.isArray(found?.links) ? found.links : [],
  };
}

function RecordingFrame({ title, src }) {
  return (
    <div className="overflow-hidden rounded-md border-2 border-gray-light bg-white">
      <div className="border-b-2 border-gray-light bg-teal-50 px-3 py-2 text-sm font-semibold text-secondary-dark">
        {title}
      </div>
      <div className="aspect-video bg-black">
        <iframe title={title} src={src} className="h-full w-full" allowFullScreen />
      </div>
    </div>
  );
}

export default function Webinar({ loaderData }) {
  const isExternalLink = (href) => typeof href === "string" && href.startsWith("http");

  return (
    <>
      <Menu />
      <div className="relative w-full overflow-hidden bg-secondary-light px-10 py-20 lg:px-40" style={{ color: "white" }}>
        <div className="absolute left-0 top-0 z-0 w-full">
          <div className="relative w-full opacity-50">
            <img className="absolute -right-15 -top-20 w-50" src="/assets/landing-disc-2a.svg" alt="" />
            <img className="absolute -left-30 top-15 w-60 -rotate-20" src="/assets/landing-disc-4b.svg" alt="" />
          </div>
        </div>
        <div className="relative z-1">
          <div className="-ml-4 flex w-fit duration-200 hover:-ml-5 hover:text-primary-light">
            <i className="bi bi-caret-left-fill" />
            <a href="/webinars" className="link-back ml-1 border-b-2 border-transparent hover:ml-2 hover:border-primary-light">
              <strong>WEBINARS</strong>
            </a>
          </div>
          <h1 style={{ color: "white", textTransform: "none" }}>{loaderData.title}</h1>
          <p className="text-lg">{loaderData.date}</p>
          {loaderData.subtitle ? <p>{loaderData.subtitle}</p> : null}
        </div>
      </div>

      <div className="px-10 py-20 duration-200 lg:px-40">
        {loaderData.links.length ? (
          <div className="mb-6 flex flex-wrap gap-3">
            {loaderData.links.map((link, index) => (
              <a
                key={`${link.label}-${index}`}
                href={link.href}
                target={isExternalLink(link.href) ? "_blank" : undefined}
                rel={isExternalLink(link.href) ? "noreferrer" : undefined}
                className="button"
              >
                {link.label}
                <i className="bi bi-arrow-right ml-2" />
              </a>
            ))}
          </div>
        ) : null}

        {loaderData.primaryVideo ? (
          <div className="mb-6">
            <RecordingFrame title="Main recording" src={loaderData.primaryVideo} />
          </div>
        ) : null}

        {loaderData.overview.length ? (
          <div className="flex flex-col gap-3">
            {loaderData.overview.map((paragraph, index) => (
              <p key={`overview-${index}`}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        {loaderData.highlights.length ? (
          <div className="mt-6 rounded-md border-2 border-gray-light bg-teal-50 p-4">
            <h4 className="text-secondary-dark">Key points</h4>
            <ul className="list-inside list-disc">
              {loaderData.highlights.map((item, index) => (
                <li key={`highlight-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {loaderData.speakers.length ? (
          <div className="mt-8">
            <h4>Speakers and Sessions</h4>
            <div className="flex flex-col gap-5">
              {loaderData.speakers.map((speaker, speakerIndex) => (
                <div key={`${speaker.name}-${speakerIndex}`} className="rounded-md border-2 border-gray-light bg-white p-4">
                  <div className="grid gap-4 md:grid-cols-[12rem_1fr] md:items-start">
                    <div className="overflow-hidden rounded-md border-2 border-gray-light bg-white">
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="h-48 w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h5>{speaker.name}</h5>
                      {speaker.affiliation ? <p className="font-semibold text-gray-dark/80">{speaker.affiliation}</p> : null}
                      {speaker.role ? <p className="text-gray-dark/80">{speaker.role}</p> : null}
                      {speaker.topic ? <p className="text-gray-dark/80">{speaker.topic}</p> : null}
                      {speaker.quote ? <p className="italic text-gray-dark/80">"{speaker.quote}"</p> : null}
                    </div>
                  </div>

                  {Array.isArray(speaker.recordings) && speaker.recordings.length ? (
                    <div className={`mt-4 grid gap-4 ${speaker.recordings.length > 1 ? "sm:grid-cols-2" : ""}`}>
                      {speaker.recordings.map((recording, recordingIndex) => (
                        <RecordingFrame
                          key={`${speaker.name}-${recording.label}-${recordingIndex}`}
                          title={recording.label}
                          src={recording.embed}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {loaderData.extraRecordings.length ? (
          <div className="mt-8">
            <h4>Additional Recordings</h4>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {loaderData.extraRecordings.map((recording, recordingIndex) => (
                <RecordingFrame
                  key={`${recording.title}-${recordingIndex}`}
                  title={recording.title}
                  src={recording.embed}
                />
              ))}
            </div>
          </div>
        ) : null}

        {loaderData.images.length ? (
          <div className="mt-8">
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {loaderData.images.map((imageSrc, imageIndex) => (
                <div key={`${imageSrc}-${imageIndex}`} className="overflow-hidden rounded-md border-2 border-gray-light bg-white p-3">
                  <img src={imageSrc} alt={`Webinar visual ${imageIndex + 1}`} className="h-full w-full object-contain" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
    </>
  );
}
