export const TEST_WEBINARS = [
  {
    id: "test-1",
    title: "Test Webinar 1",
    date: "2026/01/15",
    subtitle: "Temporary test webinar data",
    thumbnail: "",
    primaryVideo: "",
    overview: [
      "This is test data shown when Supabase is unavailable.",
      "Replace with real webinars after backend setup is complete.",
    ],
    highlights: [
      "Test key point A",
      "Test key point B",
    ],
    speakers: [
      {
        name: "Test Speaker One",
        affiliation: "Test University",
        role: "Test Role",
        topic: "Test Topic",
        quote: "Test Quote",
        image: "",
        recordings: [],
      },
    ],
    extraRecordings: [],
    images: [],
    links: [],
  },
  {
    id: "test-2",
    title: "Test Webinar 2",
    date: "2026/02/20",
    subtitle: "Temporary test webinar data",
    thumbnail: "",
    primaryVideo: "",
    overview: ["Demo content for the future webinars page."],
    highlights: [],
    speakers: [],
    extraRecordings: [],
    images: [],
    links: [],
  },
  {
    id: "test-3",
    title: "Test Webinar 3",
    date: "2026/03/10",
    subtitle: "Temporary test webinar data",
    thumbnail: "",
    primaryVideo: "",
    overview: ["Use this entry to verify pagination and card rendering."],
    highlights: [],
    speakers: [],
    extraRecordings: [],
    images: [],
    links: [],
  },
];

export function getTestWebinars() {
  return TEST_WEBINARS;
}

export function getTestWebinarById(webinarId) {
  return TEST_WEBINARS.find((webinar) => String(webinar.id) === String(webinarId));
}
