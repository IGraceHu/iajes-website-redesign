const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About IAJES", href: "/about" },
  { label: "Organizational Structure", href: "/organizational-structure" },
  { label: "Task Forces", href: "/task-forces" },
  { label: "Video Resources", href: "/video-resources" },
  { label: "Webinars", href: "/webinars" },
  { label: "International Meetings", href: "/international-meetings" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "People", href: "/search" },
];

const missionPillars = [
  { label: "Educating Minds", icon: "bi-people" },
  { label: "Serving Humanity", icon: "bi-heart" },
  { label: "Building Networks", icon: "bi-diagram-3" },
  { label: "Engineering & Science", icon: "bi-gear" },
  { label: "Driving Social Innovation", icon: "bi-globe-americas" },
];

const socialLinks = [
  { label: "LinkedIn", icon: "bi-linkedin", href: "https://www.linkedin.com/company/iajes/posts/?feedView=all" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
  { label: "Accessibility", href: "#" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-primary-extralight">
      <img
        src="/assets/landing-disc-2b.svg"
        alt=""
        className="pointer-events-none absolute -left-40 top-0 w-120 opacity-25"
      />
      <img
        src="/assets/landing-disc-4a.svg"
        alt=""
        className="pointer-events-none absolute -right-20 top-0 w-90 opacity-20"
      />
      <img
        src="/assets/landing-disc-2a.svg"
        alt=""
        className="pointer-events-none absolute -right-20 bottom-0 w-100 opacity-20"
      />

      <div className="relative lg:px-40 px-10 py-12 duration-200">
        <div className="grid gap-6 xl:grid-cols-[1fr_1.45fr] xl:items-center">
          <div className="flex items-start gap-5">
            <div className="mt-2 h-26 w-1 shrink-0 rounded-full bg-primary-dark"></div>
            <h4 className="!mb-0 !text-secondary-light">
              International Association of
              <br />
              Jesuit Engineering and Science Schools
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:items-stretch lg:justify-between lg:gap-0">
            {missionPillars.map((pillar, index) => (
              <div
                key={pillar.label}
                className={`flex flex-col items-center justify-center px-4 py-3 text-center ${
                  index > 0 ? "lg:border-l-2 lg:border-primary-light" : ""
                }`}
              >
                <i className={`bi ${pillar.icon} text-4xl text-secondary-light`} />
                {pillar.label === "Engineering & Science" ? (
                  <i className="bi bi-flask text-xl text-primary-dark -mt-3 ml-9" />
                ) : null}
                {pillar.label === "Driving Social Innovation" ? (
                  <i className="bi bi-leaf text-xl text-primary-dark -mt-3 ml-9" />
                ) : null}
                <h6 className="!mb-0 !text-secondary-light mt-3">{pillar.label}</h6>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
          <div>
            <a href="/" className="inline-block bg-white rounded-md p-3 mb-3 duration-200 hover:opacity-70">
              <img className="w-14 h-auto" src="/assets/logo.svg" alt="IAJES logo" />
            </a>
            <p className="text-secondary-dark">
              A global network for Jesuit engineering and science collaboration.
            </p>
          </div>

          <div>
            <h4 className="!text-secondary-light mb-3">Contact</h4>
            <p className="text-secondary-dark">
              International Association of Jesuit Engineering Schools
            </p>
            <a href="mailto:info@iajes.org" className="!text-secondary-dark duration-200 hover:!text-primary-dark">
              info@iajes.org
            </a>
          </div>

          <div>
            <h4 className="!text-secondary-light mb-3">Social</h4>
            <div className="flex gap-5 text-3xl">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="!text-secondary-light duration-200 hover:!text-primary-dark"
                >
                  <i className={`bi ${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="!text-secondary-light mb-3">Stay Informed</h4>
            <p className="text-secondary-dark">
              Get updates on meetings, task forces, and new resources.
            </p>
            <a href="/newsletter" className="button button-light mt-3 inline-block">
              Newsletter
            </a>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t-2 border-primary-light">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {quickLinks.map((item) => (
              <a key={item.href} href={item.href} className="!text-secondary-dark duration-200 hover:!text-primary-dark">
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t-2 border-primary-light flex lg:flex-row flex-col gap-4 justify-between">
          <p className="text-secondary-dark">
            © {currentYear} IAJES. All rights reserved.
          </p>
          <div className="flex gap-5 flex-wrap">
            {legalLinks.map((item) => (
              <a key={item.label} href={item.href} className="!text-secondary-dark duration-200 hover:!text-primary-dark">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
