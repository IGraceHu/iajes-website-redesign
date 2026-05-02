import { isSupabaseConfigured, getSupabaseConfig } from "../lib/supabase.server";
import { getTestWebinarById, getTestWebinars } from "./webinars";

const WEBINARS_TABLE = "webinars";
const SELECT_COLUMNS =
  "id, legacy_id, title, date_text, subtitle, thumbnail, primary_video, overview, highlights, speakers, extra_recordings, images, links, created_at";

function toText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function toStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function toObjectArray(value) {
  return Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : [];
}

function rowToWebinar(row) {
  return {
    id: row.id,
    legacyId: row.legacy_id,
    title: toText(row.title),
    date: toText(row.date_text),
    subtitle: toText(row.subtitle),
    thumbnail: toText(row.thumbnail),
    primaryVideo: toText(row.primary_video),
    overview: toStringArray(row.overview),
    highlights: toStringArray(row.highlights),
    speakers: toObjectArray(row.speakers),
    extraRecordings: toObjectArray(row.extra_recordings),
    images: toStringArray(row.images),
    links: toObjectArray(row.links),
  };
}

function webinarToRow(webinar) {
  return {
    title: toText(webinar.title),
    date_text: toText(webinar.date),
    subtitle: toText(webinar.subtitle),
    thumbnail: toText(webinar.thumbnail),
    primary_video: toText(webinar.primaryVideo),
    overview: toStringArray(webinar.overview),
    highlights: toStringArray(webinar.highlights),
    speakers: toObjectArray(webinar.speakers),
    extra_recordings: toObjectArray(webinar.extraRecordings),
    images: toStringArray(webinar.images),
    links: toObjectArray(webinar.links),
  };
}

function sanitizeTestWebinar(webinar) {
  return {
    id: webinar.id,
    legacyId: null,
    title: toText(webinar.title),
    date: toText(webinar.date),
    subtitle: toText(webinar.subtitle),
    thumbnail: toText(webinar.thumbnail),
    primaryVideo: toText(webinar.primaryVideo),
    overview: toStringArray(webinar.overview),
    highlights: toStringArray(webinar.highlights),
    speakers: toObjectArray(webinar.speakers),
    extraRecordings: toObjectArray(webinar.extraRecordings),
    images: toStringArray(webinar.images),
    links: toObjectArray(webinar.links),
  };
}

function testList() {
  return getTestWebinars().map(sanitizeTestWebinar);
}

function testById(webinarId) {
  const found = getTestWebinarById(webinarId);
  return found ? sanitizeTestWebinar(found) : null;
}

function getSupabaseRequestHeaders(extraHeaders = {}) {
  const config = getSupabaseConfig();

  return {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
    "Content-Type": "application/json",
    ...extraHeaders,
  };
}

async function supabaseRestRequest(pathnameWithQuery, options = {}) {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: "Supabase is not configured.",
    };
  }

  const config = getSupabaseConfig();
  const endpoint = `${config.url.replace(/\/$/, "")}/rest/v1/${pathnameWithQuery}`;

  let response;
  try {
    response = await fetch(endpoint, {
      method: options.method || "GET",
      headers: getSupabaseRequestHeaders(options.headers),
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    return {
      data: null,
      error: "Unable to reach Supabase.",
    };
  }

  const raw = await response.text();
  let parsed = null;

  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
  }

  if (!response.ok) {
    const errorMessage =
      (parsed && (parsed.message || parsed.error_description || parsed.error)) ||
      raw ||
      `Supabase request failed (${response.status}).`;

    return {
      data: null,
      error: errorMessage,
    };
  }

  return {
    data: parsed,
    error: null,
  };
}

function webinarsListPath() {
  const params = new URLSearchParams({
    select: SELECT_COLUMNS,
    order: "created_at.desc",
  });

  return `${WEBINARS_TABLE}?${params.toString()}`;
}

function webinarByIdPath(id) {
  const params = new URLSearchParams({
    select: SELECT_COLUMNS,
    id: `eq.${id}`,
    limit: "1",
  });

  return `${WEBINARS_TABLE}?${params.toString()}`;
}

function webinarByLegacyIdPath(legacyId) {
  const params = new URLSearchParams({
    select: SELECT_COLUMNS,
    legacy_id: `eq.${legacyId}`,
    limit: "1",
  });

  return `${WEBINARS_TABLE}?${params.toString()}`;
}

function insertWebinarPath() {
  const params = new URLSearchParams({
    select: SELECT_COLUMNS,
  });

  return `${WEBINARS_TABLE}?${params.toString()}`;
}

function updateWebinarPathById(id) {
  const params = new URLSearchParams({
    id: `eq.${id}`,
    select: SELECT_COLUMNS,
  });

  return `${WEBINARS_TABLE}?${params.toString()}`;
}

function updateWebinarPathByLegacyId(legacyId) {
  const params = new URLSearchParams({
    legacy_id: `eq.${legacyId}`,
    select: SELECT_COLUMNS,
  });

  return `${WEBINARS_TABLE}?${params.toString()}`;
}

function deleteWebinarPathById(id) {
  const params = new URLSearchParams({
    id: `eq.${id}`,
  });

  return `${WEBINARS_TABLE}?${params.toString()}`;
}

function deleteWebinarPathByLegacyId(legacyId) {
  const params = new URLSearchParams({
    legacy_id: `eq.${legacyId}`,
  });

  return `${WEBINARS_TABLE}?${params.toString()}`;
}

export async function listWebinars() {
  if (!isSupabaseConfigured()) {
    return {
      webinars: testList(),
      source: "test",
      error: null,
    };
  }

  const { data, error } = await supabaseRestRequest(webinarsListPath());

  if (error) {
    return {
      webinars: testList(),
      source: "test",
      error,
    };
  }

  const webinars = Array.isArray(data) ? data.map(rowToWebinar) : [];

  if (!webinars.length) {
    return {
      webinars: testList(),
      source: "test",
      error: null,
    };
  }

  return {
    webinars,
    source: "supabase",
    error: null,
  };
}

export async function getWebinarDetailsById(webinarId) {
  const id = toText(webinarId);

  if (!isSupabaseConfigured()) {
    return {
      webinar: testById(id),
      source: "test",
      error: null,
    };
  }

  let { data, error } = await supabaseRestRequest(webinarByIdPath(id));

  if ((!Array.isArray(data) || !data.length) && /^\d+$/.test(id)) {
    const legacyResult = await supabaseRestRequest(webinarByLegacyIdPath(Number(id)));
    data = legacyResult.data;
    error = legacyResult.error;
  }

  if (error) {
    return {
      webinar: testById(id),
      source: "test",
      error,
    };
  }

  const row = Array.isArray(data) ? data[0] : null;

  if (!row) {
    return {
      webinar: testById(id),
      source: "test",
      error: null,
    };
  }

  return {
    webinar: rowToWebinar(row),
    source: "supabase",
    error: null,
  };
}

export async function createWebinar(webinar) {
  if (!isSupabaseConfigured()) {
    return {
      webinar: null,
      error: "Supabase is not configured.",
    };
  }

  const { data, error } = await supabaseRestRequest(insertWebinarPath(), {
    method: "POST",
    body: webinarToRow(webinar),
    headers: {
      Prefer: "return=representation",
    },
  });

  if (error) {
    return {
      webinar: null,
      error,
    };
  }

  const created = Array.isArray(data) ? data[0] : null;

  return {
    webinar: created ? rowToWebinar(created) : null,
    error: null,
  };
}

export async function updateWebinar(webinarId, webinar) {
  if (!isSupabaseConfigured()) {
    return {
      webinar: null,
      error: "Supabase is not configured.",
    };
  }

  const id = toText(webinarId);
  const updatePayload = {
    ...webinarToRow(webinar),
    updated_at: new Date().toISOString(),
  };

  let result = await supabaseRestRequest(updateWebinarPathById(id), {
    method: "PATCH",
    body: updatePayload,
    headers: {
      Prefer: "return=representation",
    },
  });

  let row = Array.isArray(result.data) ? result.data[0] : null;

  if (!row && /^\d+$/.test(id)) {
    result = await supabaseRestRequest(updateWebinarPathByLegacyId(Number(id)), {
      method: "PATCH",
      body: updatePayload,
      headers: {
        Prefer: "return=representation",
      },
    });

    row = Array.isArray(result.data) ? result.data[0] : null;
  }

  if (result.error) {
    return {
      webinar: null,
      error: result.error,
    };
  }

  if (!row) {
    return {
      webinar: null,
      error: "Webinar not found.",
    };
  }

  return {
    webinar: rowToWebinar(row),
    error: null,
  };
}

export async function deleteWebinar(webinarId) {
  if (!isSupabaseConfigured()) {
    return {
      error: "Supabase is not configured.",
    };
  }

  const id = toText(webinarId);

  let result = await supabaseRestRequest(deleteWebinarPathById(id), {
    method: "DELETE",
  });

  if (result.error && /^\d+$/.test(id)) {
    result = await supabaseRestRequest(deleteWebinarPathByLegacyId(Number(id)), {
      method: "DELETE",
    });
  }

  if (result.error) {
    return {
      error: result.error,
    };
  }

  return {
    error: null,
  };
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

function parseLinkLines(rawText) {
  const links = [];
  const lines = parseLines(rawText);

  for (const line of lines) {
    const [label, href] = line.split("|").map((part) => part.trim());
    if (!label || !href) {
      return {
        value: null,
        error: "Links must use the format: Label | URL (one per line).",
      };
    }

    links.push({ label, href });
  }

  return {
    value: links,
    error: null,
  };
}

function parseSpeakerLines(rawText) {
  const lines = parseLines(rawText);
  const speakers = [];
  const speakerMap = new Map();

  for (const line of lines) {
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length < 1 || !parts[0]) {
      return {
        value: null,
        speakerMap: null,
        error: "Each speaker line must include at least a name.",
      };
    }

    const [name, affiliation = "", role = "", topic = "", quote = "", image = ""] = parts;

    const normalized = {
      name,
      affiliation,
      role,
      topic,
      quote,
      image,
      recordings: [],
    };

    speakers.push(normalized);
    speakerMap.set(name.toLowerCase(), normalized);
  }

  return {
    value: speakers,
    speakerMap,
    error: null,
  };
}

function parseSpeakerRecordingLines(rawText, speakerMap) {
  const lines = parseLines(rawText);

  for (const line of lines) {
    const [speakerName, label, embed] = line.split("|").map((part) => part.trim());

    if (!speakerName || !label || !embed) {
      return {
        error: "Speaker recordings must use: Speaker Name | Recording Label | Embed URL.",
      };
    }

    const speaker = speakerMap.get(speakerName.toLowerCase());
    if (!speaker) {
      return {
        error: `Speaker recording references unknown speaker: ${speakerName}`,
      };
    }

    speaker.recordings.push({ label, embed });
  }

  return {
    error: null,
  };
}

function parseExtraRecordingLines(rawText) {
  const lines = parseLines(rawText);
  const extraRecordings = [];

  for (const line of lines) {
    const [title, embed] = line.split("|").map((part) => part.trim());
    if (!title || !embed) {
      return {
        value: null,
        error: "Additional recordings must use: Title | Embed URL (one per line).",
      };
    }

    extraRecordings.push({ title, embed });
  }

  return {
    value: extraRecordings,
    error: null,
  };
}

export function buildWebinarPayloadFromForm(formData) {
  const title = toText(formData.get("title"));
  const date = toText(formData.get("date"));
  const subtitle = toText(formData.get("subtitle"));
  const primaryVideo = toText(formData.get("primaryVideo"));
  const thumbnail = toText(formData.get("thumbnail"));
  const overviewRaw = toText(formData.get("overview"));
  const highlightsRaw = toText(formData.get("highlights"));
  const imagesRaw = toText(formData.get("images"));
  const linksRaw = toText(formData.get("links"));
  const speakersRaw = toText(formData.get("speakers"));
  const speakerRecordingsRaw = toText(formData.get("speakerRecordings"));
  const extraRecordingsRaw = toText(formData.get("extraRecordings"));

  const values = {
    title,
    date,
    subtitle,
    primaryVideo,
    thumbnail,
    overview: overviewRaw,
    highlights: highlightsRaw,
    images: imagesRaw,
    links: linksRaw,
    speakers: speakersRaw,
    speakerRecordings: speakerRecordingsRaw,
    extraRecordings: extraRecordingsRaw,
  };

  const fieldErrors = {};

  if (!title) {
    fieldErrors.title = "Title is required.";
  }

  if (!date) {
    fieldErrors.date = "Date is required.";
  } else if (!/^\d{4}\/\d{2}\/\d{2}$/.test(date)) {
    fieldErrors.date = "Date must be YYYY/MM/DD.";
  }

  const linksResult = parseLinkLines(linksRaw);
  if (linksResult.error) {
    fieldErrors.links = linksResult.error;
  }

  const speakerResult = parseSpeakerLines(speakersRaw);
  if (speakerResult.error) {
    fieldErrors.speakers = speakerResult.error;
  }

  if (speakerResult.speakerMap) {
    const recordingsResult = parseSpeakerRecordingLines(speakerRecordingsRaw, speakerResult.speakerMap);
    if (recordingsResult.error) {
      fieldErrors.speakerRecordings = recordingsResult.error;
    }
  }

  const extraRecordingsResult = parseExtraRecordingLines(extraRecordingsRaw);
  if (extraRecordingsResult.error) {
    fieldErrors.extraRecordings = extraRecordingsResult.error;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      payload: null,
      values,
      fieldErrors,
      error: "Please fix the highlighted fields.",
    };
  }

  return {
    payload: {
      title,
      date,
      subtitle,
      thumbnail,
      primaryVideo,
      overview: parseParagraphs(overviewRaw),
      highlights: parseLines(highlightsRaw),
      images: parseLines(imagesRaw),
      links: linksResult.value,
      speakers: speakerResult.value,
      extraRecordings: extraRecordingsResult.value,
    },
    values,
    fieldErrors: {},
    error: null,
  };
}
