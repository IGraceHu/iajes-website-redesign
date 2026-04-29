import { getSupabaseServerClient, isSupabaseConfigured } from "../lib/supabase.server";
import { getWebinarById as getStaticWebinarById, getWebinars as getStaticWebinars } from "./webinars";

const WEBINARS_TABLE = "webinars";

function toText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function toStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean);
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

function sanitizeStaticWebinar(webinar) {
  return {
    id: webinar.id,
    legacyId: webinar.id,
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

function staticList() {
  return getStaticWebinars().map(sanitizeStaticWebinar);
}

function staticById(webinarId) {
  const staticWebinar = getStaticWebinarById(webinarId);
  return staticWebinar ? sanitizeStaticWebinar(staticWebinar) : null;
}

export async function listWebinars() {
  if (!isSupabaseConfigured()) {
    return {
      webinars: staticList(),
      source: "static",
      error: null,
    };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from(WEBINARS_TABLE)
    .select(
      "id, legacy_id, title, date_text, subtitle, thumbnail, primary_video, overview, highlights, speakers, extra_recordings, images, links, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return {
      webinars: staticList(),
      source: "fallback",
      error: error.message,
    };
  }

  return {
    webinars: (data || []).map(rowToWebinar),
    source: "supabase",
    error: null,
  };
}

export async function getWebinarDetailsById(webinarId) {
  const id = toText(webinarId);

  if (!isSupabaseConfigured()) {
    return {
      webinar: staticById(id),
      source: "static",
      error: null,
    };
  }

  const supabase = getSupabaseServerClient();

  let query = supabase
    .from(WEBINARS_TABLE)
    .select(
      "id, legacy_id, title, date_text, subtitle, thumbnail, primary_video, overview, highlights, speakers, extra_recordings, images, links"
    )
    .eq("id", id)
    .maybeSingle();

  let { data, error } = await query;

  if (!data && /^\d+$/.test(id)) {
    const legacyLookup = await supabase
      .from(WEBINARS_TABLE)
      .select(
        "id, legacy_id, title, date_text, subtitle, thumbnail, primary_video, overview, highlights, speakers, extra_recordings, images, links"
      )
      .eq("legacy_id", Number(id))
      .maybeSingle();

    data = legacyLookup.data;
    error = legacyLookup.error;
  }

  if (error) {
    return {
      webinar: staticById(id),
      source: "fallback",
      error: error.message,
    };
  }

  if (!data) {
    return {
      webinar: staticById(id),
      source: "supabase",
      error: null,
    };
  }

  return {
    webinar: rowToWebinar(data),
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

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from(WEBINARS_TABLE)
    .insert(webinarToRow(webinar))
    .select(
      "id, legacy_id, title, date_text, subtitle, thumbnail, primary_video, overview, highlights, speakers, extra_recordings, images, links"
    )
    .single();

  if (error) {
    return {
      webinar: null,
      error: error.message,
    };
  }

  return {
    webinar: rowToWebinar(data),
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
  const supabase = getSupabaseServerClient();

  const updatePayload = {
    ...webinarToRow(webinar),
    updated_at: new Date().toISOString(),
  };

  let updateResult = await supabase
    .from(WEBINARS_TABLE)
    .update(updatePayload)
    .eq("id", id)
    .select(
      "id, legacy_id, title, date_text, subtitle, thumbnail, primary_video, overview, highlights, speakers, extra_recordings, images, links"
    )
    .maybeSingle();

  if (!updateResult.data && /^\d+$/.test(id)) {
    updateResult = await supabase
      .from(WEBINARS_TABLE)
      .update(updatePayload)
      .eq("legacy_id", Number(id))
      .select(
        "id, legacy_id, title, date_text, subtitle, thumbnail, primary_video, overview, highlights, speakers, extra_recordings, images, links"
      )
      .maybeSingle();
  }

  if (updateResult.error) {
    return {
      webinar: null,
      error: updateResult.error.message,
    };
  }

  if (!updateResult.data) {
    return {
      webinar: null,
      error: "Webinar not found.",
    };
  }

  return {
    webinar: rowToWebinar(updateResult.data),
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
  const supabase = getSupabaseServerClient();

  let deleteResult = await supabase.from(WEBINARS_TABLE).delete().eq("id", id);

  if (deleteResult.error && /^\d+$/.test(id)) {
    deleteResult = await supabase.from(WEBINARS_TABLE).delete().eq("legacy_id", Number(id));
  }

  if (deleteResult.error) {
    return {
      error: deleteResult.error.message,
    };
  }

  return {
    error: null,
  };
}
