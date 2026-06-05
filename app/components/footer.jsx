const missionStatement =
  "IAJES advances global collaboration in Jesuit engineering and science to foster innovation for a just and sustainable world.";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "About IAJES", href: "/about" },
  { label: "Organizational Structure", href: "/organizational-structure" },
  { label: "Task Forces", href: "/task-forces" },
  { label: "Video Resources", href: "/video-resources" },
  { label: "Webinars", href: "/webinars" },
  { label: "Regional Meetings", href: "/regional-meetings" },
  { label: "International Meetings", href: "/international-meetings" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "People", href: "/search" },
];

const missionPillars = [
  { label: "Educating Minds", icon: "bi-people", lines: ["Educating", "Minds"] },
  { label: "Serving Humanity", icon: "bi-heart", lines: ["Serving", "Humanity"] },
  { label: "Building Networks", icon: "bi-diagram-3", lines: ["Building", "Networks"] },
  { label: "Engineering & Science", icon: "bi-gear", lines: ["Engineering &", "Science"] },
  { label: "Driving Social Innovation", icon: "bi-globe-americas", lines: ["Driving Social", "Innovation"] },
];

const socialLinks = [
  { label: "LinkedIn", icon: "bi-linkedin", href: "https://www.linkedin.com/company/iajes/" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden border-b-4 border-primary-light"
      style={{ background: "linear-gradient(180deg, #136E8D 0%, #063751 100%)" }}
    >
      <img
        src="/assets/landing-disc-2b.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-28 hidden w-100 md:block"
        style={{ filter: "brightness(0) invert(1)", opacity: 0.1 }}
      />
      <img
        src="/assets/landing-disc-4a.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-16 hidden w-80 md:block"
        style={{ filter: "brightness(0) invert(1)", opacity: 0.12 }}
      />

      <div className="relative z-10 lg:px-40 px-10 py-7 duration-200">
        <div className="grid gap-6 xl:grid-cols-[1fr_1.7fr] xl:items-center">
          <div className="flex items-center gap-5">
            <div className="h-20 w-1 shrink-0 rounded-full bg-primary-light"></div>
            <div>
              <h5 className="!mb-0 !text-primary-light">
                International Association of
                <br />
                Jesuit Engineering and Sciences Schools
              </h5>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0">
            {missionPillars.map((pillar) => (
              <div
                key={pillar.label}
                className="flex min-h-24 flex-col items-center justify-center rounded-md border-2 border-primary-light px-3 py-3 text-center lg:rounded-none lg:border-y-0 lg:border-r-0"
              >
                <i className={`bi ${pillar.icon} text-3xl text-white`} aria-hidden="true" />
                {pillar.label === "Engineering & Science" ? (
                  <i className="bi bi-flask text-lg text-primary-light -mt-3 ml-8" aria-hidden="true" />
                ) : null}
                {pillar.label === "Driving Social Innovation" ? (
                  <i className="bi bi-leaf text-lg text-primary-light -mt-3 ml-8" aria-hidden="true" />
                ) : null}
                <h6 className="!mb-0 !text-white mt-2 !text-base">
                  {pillar.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h6>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t-2 border-primary-light pt-5">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <a href="/" className="inline-flex min-h-14 items-center rounded-md bg-white p-2 duration-200 hover:opacity-70">
                  <img className="h-12 w-auto" src="/assets/logo-iajes.svg" alt="IAJES logo" />
                </a>
                <a
                  href="https://iaju.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-14 items-center rounded-md bg-white p-2 duration-200 hover:opacity-70"
                >
                  <img
                    className="h-8 w-auto"
                    src="https://iaju.org/sj_files/2023/09/iaju_logo.png"
                    alt="IAJU logo"
                  />
                </a>
              </div>
              <p className="!mb-0 text-sm leading-6 text-white">{missionStatement}</p>
            </div>

            <div>
              <h6 className="!text-primary-light mb-2">Contact</h6>
              <p className="text-sm leading-6 text-white">
                Pascal Berthouloux, IAJES Secretary
                <br />
                Development of International Partnerships, ICAM
              </p>
              <a
                href="mailto:Pascal.berthouloux@icam.fr"
                className="!text-white text-sm duration-200 hover:!text-primary-light"
              >
                Pascal.berthouloux@icam.fr
              </a>
            </div>

            <div>
              <h6 className="!text-primary-light mb-2">Social</h6>
              <div className="mb-2 flex gap-5 text-2xl">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="!text-white duration-200 hover:!text-primary-light"
                  >
                    <i className={`bi ${social.icon}`} aria-hidden="true"></i>
                  </a>
                ))}
              </div>
              <p className="!mb-0 text-sm leading-6 text-white">
                Follow IAJES on LinkedIn for network updates and collaboration news.
              </p>
            </div>

            <div>
              <h6 className="!text-primary-light mb-2">Stay Informed</h6>
              <p className="text-sm leading-6 text-white">
                Get updates on international meetings, task force activity, and newly released resources.
              </p>
              <a href="/newsletter" className="button button-light mt-1 inline-block text-sm">
                Newsletter
              </a>
            </div>
          </div>

          <nav className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t-2 border-primary-light pt-4 text-center text-sm" aria-label="Footer navigation">
            {navigationLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="!text-white duration-200 hover:!text-primary-light"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-3 border-t-2 border-primary-light pt-4 text-sm lg:flex-row lg:items-center lg:justify-between">
            <p className="!mb-0 text-white">
              © {currentYear} International Association of Jesuit Engineering and Science Schools (IAJES). All
              rights reserved. Content is provided for informational purposes.
            </p>
            <span className="text-white">Privacy Policy</span>
          </div>

          <div className="mt-3 flex flex-col items-center justify-center gap-3 border-t-2 border-primary-light pt-3 text-center text-xs text-white sm:flex-row">
            <span>Anisha Malani, Isabelle Hu, Justin Fan, and Nicolas Gibson |</span>
            <span className="inline-flex min-h-12 items-center rounded-md bg-white p-2">
              <img
                className="h-8 w-auto max-w-[220px]"
                src="/assets/frugal-innovation-hub-logo.png"
                alt="Frugal Innovation Hub"
              />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
