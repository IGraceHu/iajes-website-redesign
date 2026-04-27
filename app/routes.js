import { index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.jsx"),
    route("about", "routes/about.jsx"),
    route("organizational-structure", "routes/organizational-structure.jsx"),
    route("styleguide", "routes/styleguide.jsx"),
    route("newsletter", "routes/newsletter.jsx"),
    route("newsletter/drafts", "routes/newsletter-drafts.jsx"),
    route("newsletter/drafts/:newsletterId/edit/:articleId", "routes/article-edit.jsx"),
    route("signin", "routes/auth/signin.jsx"),
    route("signup", "routes/auth/signup.jsx"),
    route("forget-password", "routes/auth/forgetpassword.jsx"),
    route("search", "routes/search.jsx"),
    route("profile/:id", "routes/profile.jsx"),
    route("task-forces", "routes/taskforces.jsx"),
    route("task-forces/:tfName", "routes/taskforce.jsx"),
    route("webinars", "routes/webinars.jsx"),
    route("webinar/:webinarId", "routes/webinar.jsx"),
    route("video-resources", "routes/video-resources.jsx"),
    route("video-resource/:vidId", "routes/video-resource.jsx"),
    route("international-meetings", "routes/international-meetings.jsx"),
];
