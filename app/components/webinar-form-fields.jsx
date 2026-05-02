function emptyFormValues() {
  return {
    title: "",
    date: "",
    subtitle: "",
    primaryVideo: "",
    thumbnail: "",
    overview: "",
    highlights: "",
    images: "",
    links: "",
    speakers: "",
    speakerRecordings: "",
    extraRecordings: "",
  };
}

function joinParagraphs(value) {
  return Array.isArray(value) ? value.join("\n\n") : "";
}

function joinLines(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function joinLinks(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((link) => {
      if (!link || typeof link !== "object") {
        return "";
      }

      const label = typeof link.label === "string" ? link.label.trim() : "";
      const href = typeof link.href === "string" ? link.href.trim() : "";
      return label && href ? `${label} | ${href}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

function joinSpeakers(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((speaker) => {
      if (!speaker || typeof speaker !== "object") {
        return "";
      }

      const name = typeof speaker.name === "string" ? speaker.name.trim() : "";
      if (!name) {
        return "";
      }

      const affiliation = typeof speaker.affiliation === "string" ? speaker.affiliation.trim() : "";
      const role = typeof speaker.role === "string" ? speaker.role.trim() : "";
      const topic = typeof speaker.topic === "string" ? speaker.topic.trim() : "";
      const quote = typeof speaker.quote === "string" ? speaker.quote.trim() : "";
      const image = typeof speaker.image === "string" ? speaker.image.trim() : "";

      return [name, affiliation, role, topic, quote, image].join(" | ");
    })
    .filter(Boolean)
    .join("\n");
}

function joinSpeakerRecordings(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  const rows = [];
  value.forEach((speaker) => {
    if (!speaker || typeof speaker !== "object") {
      return;
    }

    const speakerName = typeof speaker.name === "string" ? speaker.name.trim() : "";
    if (!speakerName || !Array.isArray(speaker.recordings)) {
      return;
    }

    speaker.recordings.forEach((recording) => {
      if (!recording || typeof recording !== "object") {
        return;
      }

      const label = typeof recording.label === "string" ? recording.label.trim() : "";
      const embed = typeof recording.embed === "string" ? recording.embed.trim() : "";
      if (label && embed) {
        rows.push(`${speakerName} | ${label} | ${embed}`);
      }
    });
  });

  return rows.join("\n");
}

function joinExtraRecordings(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((recording) => {
      if (!recording || typeof recording !== "object") {
        return "";
      }

      const title = typeof recording.title === "string" ? recording.title.trim() : "";
      const embed = typeof recording.embed === "string" ? recording.embed.trim() : "";
      return title && embed ? `${title} | ${embed}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

function webinarToFormValues(webinar) {
  if (!webinar || typeof webinar !== "object") {
    return emptyFormValues();
  }

  return {
    title: webinar.title || "",
    date: webinar.date || "",
    subtitle: webinar.subtitle || "",
    primaryVideo: webinar.primaryVideo || "",
    thumbnail: webinar.thumbnail || "",
    overview: joinParagraphs(webinar.overview),
    highlights: joinLines(webinar.highlights),
    images: joinLines(webinar.images),
    links: joinLinks(webinar.links),
    speakers: joinSpeakers(webinar.speakers),
    speakerRecordings: joinSpeakerRecordings(webinar.speakers),
    extraRecordings: joinExtraRecordings(webinar.extraRecordings),
  };
}

function toFieldErrorState(fieldErrors = {}) {
  return {
    title: Boolean(fieldErrors.title),
    date: Boolean(fieldErrors.date),
    links: Boolean(fieldErrors.links),
    speakers: Boolean(fieldErrors.speakers),
    speakerRecordings: Boolean(fieldErrors.speakerRecordings),
    extraRecordings: Boolean(fieldErrors.extraRecordings),
  };
}

function FieldError({ message }) {
  return <div className="input-error">{message || "This field has an error."}</div>;
}

function WebinarFormFields({ values, fieldErrors }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="webinar-title">Webinar title:</label>
          <br />
          <input
            id="webinar-title"
            name="title"
            type="text"
            className={`input input-text w-full ${fieldErrors.title ? "input-required" : ""}`}
            defaultValue={values.title}
            placeholder="Test Webinar 1"
          />
          <FieldError message={fieldErrors.title ? "Title is required." : " "} />
        </div>
        <div>
          <label htmlFor="webinar-date">Date:</label>
          <br />
          <input
            id="webinar-date"
            name="date"
            type="text"
            className={`input input-text w-full ${fieldErrors.date ? "input-required" : ""}`}
            defaultValue={values.date}
            placeholder="2026/01/15"
          />
          <FieldError message={fieldErrors.date ? "Date must be YYYY/MM/DD." : " "} />
        </div>
      </div>

      <label htmlFor="webinar-subtitle">Subtitle:</label>
      <br />
      <input
        id="webinar-subtitle"
        name="subtitle"
        type="text"
        className="input input-text w-full"
        defaultValue={values.subtitle}
        placeholder="One-line subtitle"
      />

      <br />
      <br />
      <label htmlFor="webinar-thumbnail-file">Thumbnail image (file upload):</label>
      <br />
      <input id="webinar-thumbnail-file" name="thumbnailFile" type="file" className="mt-2" />
      <input type="hidden" name="thumbnail" defaultValue={values.thumbnail} />
      <p className="mt-1 text-sm text-disabled-light">File upload UI is ready; storage wiring is pending.</p>

      <br />
      <label htmlFor="webinar-primary-video">Main recording embed URL:</label>
      <br />
      <input
        id="webinar-primary-video"
        name="primaryVideo"
        type="text"
        className="input input-text w-full"
        defaultValue={values.primaryVideo}
        placeholder="https://drive.google.com/file/d/.../preview"
      />

      <br />
      <br />
      <label htmlFor="webinar-overview">Overview (separate paragraphs with a blank line):</label>
      <br />
      <textarea
        id="webinar-overview"
        name="overview"
        className="input input-text h-28 w-full"
        defaultValue={values.overview}
        placeholder={"Paragraph 1\n\nParagraph 2"}
      />

      <br />
      <br />
      <label htmlFor="webinar-highlights">Key points (one item per line):</label>
      <br />
      <textarea
        id="webinar-highlights"
        name="highlights"
        className="input input-text h-28 w-full"
        defaultValue={values.highlights}
        placeholder={"Key point one\nKey point two"}
      />

      <br />
      <br />
      <label htmlFor="webinar-images">Image URLs (one URL per line):</label>
      <br />
      <textarea
        id="webinar-images"
        name="images"
        className="input input-text h-28 w-full"
        defaultValue={values.images}
        placeholder={"https://example.com/image-1.jpg\nhttps://example.com/image-2.jpg"}
      />

      <br />
      <br />
      <label htmlFor="webinar-links">Links (one per line: Label | URL):</label>
      <br />
      <textarea
        id="webinar-links"
        name="links"
        className={`input input-text h-28 w-full ${fieldErrors.links ? "input-required" : ""}`}
        defaultValue={values.links}
        placeholder={"Meeting Website | https://example.com\nTask Force | /task-forces/example"}
      />
      <FieldError
        message={fieldErrors.links ? "Use the format: Label | URL (one per line)." : " "}
      />

      <br />
      <label htmlFor="webinar-speakers">
        Speakers (one per line: Name | Affiliation | Role | Topic | Quote | Image URL):
      </label>
      <br />
      <textarea
        id="webinar-speakers"
        name="speakers"
        className={`input input-text h-36 w-full ${fieldErrors.speakers ? "input-required" : ""}`}
        defaultValue={values.speakers}
        placeholder={"Jane Doe | Example University | Professor | Topic | Optional quote | https://example.com/speaker.jpg"}
      />
      <FieldError message={fieldErrors.speakers ? "Each speaker line must include at least a name." : " "} />

      <br />
      <label htmlFor="webinar-speaker-recordings">Speaker recordings (Speaker Name | Recording Label | Embed URL):</label>
      <br />
      <textarea
        id="webinar-speaker-recordings"
        name="speakerRecordings"
        className={`input input-text h-28 w-full ${fieldErrors.speakerRecordings ? "input-required" : ""}`}
        defaultValue={values.speakerRecordings}
        placeholder={"Jane Doe | Slides | https://drive.google.com/file/d/.../preview"}
      />
      <FieldError
        message={
          fieldErrors.speakerRecordings
            ? "Use: Speaker Name | Recording Label | Embed URL."
            : " "
        }
      />

      <br />
      <label htmlFor="webinar-extra-recordings">Additional recordings (Title | Embed URL):</label>
      <br />
      <textarea
        id="webinar-extra-recordings"
        name="extraRecordings"
        className={`input input-text h-28 w-full ${fieldErrors.extraRecordings ? "input-required" : ""}`}
        defaultValue={values.extraRecordings}
        placeholder={"Q&A Session | https://drive.google.com/file/d/.../preview"}
      />
      <FieldError
        message={fieldErrors.extraRecordings ? "Use: Title | Embed URL (one per line)." : " "}
      />
    </>
  );
}

export { emptyFormValues, webinarToFormValues, toFieldErrorState, WebinarFormFields };
