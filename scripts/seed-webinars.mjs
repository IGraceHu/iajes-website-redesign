import { createClient } from "@supabase/supabase-js";
import { WEBINARS } from "../app/data/webinars.js";

function mapWebinarToRow(webinar) {
  return {
    legacy_id: webinar.id,
    title: webinar.title || "",
    date_text: webinar.date || "",
    subtitle: webinar.subtitle || "",
    thumbnail: webinar.thumbnail || "",
    primary_video: webinar.primaryVideo || "",
    overview: Array.isArray(webinar.overview) ? webinar.overview : [],
    highlights: Array.isArray(webinar.highlights) ? webinar.highlights : [],
    speakers: Array.isArray(webinar.speakers) ? webinar.speakers : [],
    extra_recordings: Array.isArray(webinar.extraRecordings) ? webinar.extraRecordings : [],
    images: Array.isArray(webinar.images) ? webinar.images : [],
    links: Array.isArray(webinar.links) ? webinar.links : [],
  };
}

async function seed() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  }

  const supabase = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const rows = WEBINARS.map(mapWebinarToRow);

  const { data, error } = await supabase
    .from("webinars")
    .upsert(rows, { onConflict: "legacy_id" })
    .select("id, legacy_id, title");

  if (error) {
    throw new Error(error.message);
  }

  console.log(`Seeded ${data?.length ?? 0} webinars into Supabase.`);
}

seed().catch((error) => {
  console.error("Failed to seed webinars:", error.message);
  process.exit(1);
});
