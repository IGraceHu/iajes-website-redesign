import { supabase } from "../supabase";

const BUCKET_NAME = "landing";
const SUPABASE_URL = "https://mnjmyajjyxaoemhexhyt.supabase.co";

/**
 * Generate a public Supabase storage URL for a file
 * @param {string} filename - The name of the file (e.g., "banner1.png", "event1.png")
 * @returns {string} The full Supabase storage URL
 */
export function getImageUrl(filename) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filename}`;
}

/**
 * Generate a public Supabase storage URL for a PDF file
 * @param {string} filename - The name of the PDF file (e.g., "sample-local-pdf.pdf")
 * @returns {string} The full Supabase storage URL
 */
export function getPdfUrl(filename) {
  return `${SUPABASE_URL}/storage/v1/object/public/newsletter/current/${filename}`;
}

/**
 * Fetch all event images from the landing bucket
 * Images are expected to follow the pattern: event1.png, event2.png, etc.
 * @returns {Promise<Array>} Array of image filenames sorted numerically
 */
export async function fetchEventImages() {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" }
      });

    if (error) {
      console.error("Error fetching images from Supabase:", error);
      return [];
    }

    // Filter for event images and sort numerically
    const eventImages = data
      .filter(file => file.name.startsWith("event") && file.name.endsWith(".png"))
      .sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)?.[0] || 0);
        const numB = parseInt(b.name.match(/\d+/)?.[0] || 0);
        return numA - numB;
      });

    return eventImages.map(img => img.name);
  } catch (error) {
    console.error("Error fetching event images:", error);
    return [];
  }
}
