const footerNavigation = [
  {
    title: "Organization",
    links: [
      { label: "Home", href: "/" },
      { label: "About IAJES", href: "/about" },
      { label: "Organizational Structure", href: "/organizational-structure" },
    ],
  },
  {
    title: "Programs",
    links: [
      { label: "Task Forces", href: "/task-forces" },
      { label: "Video Resources", href: "/video-resources" },
      { label: "Webinars", href: "/webinars" },
      { label: "International Meetings", href: "/international-meetings" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Newsletter", href: "/newsletter" },
      { label: "People", href: "/search" },
    ],
  },
];

const socialLinks = [
  { label: "LinkedIn", icon: "bi-linkedin", href: "#" },
  { label: "YouTube", icon: "bi-youtube", href: "#" },
  { label: "Instagram", icon: "bi-instagram", href: "#" },
  { label: "X", icon: "bi-twitter-x", href: "#" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
  { label: "Accessibility", href: "#" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-b from-secondary-light to-secondary-dark text-white">
      <div className="lg:px-40 px-10 py-20 duration-200">
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10">
          <div>
            <a href="/" className="inline-block bg-white rounded-md p-4 mb-5 duration-200 hover:opacity-70">
              <img className="w-18 h-auto" src="/assets/logo.svg" alt="IAJES logo placeholder" />
            </a>
            <p className="text-white">
              [PLACEHOLDER] Add final organization mission statement or one-line brand message.
            </p>
          </div>

          <div>
            <h4 className="!text-primary-light mb-5">Contact</h4>
            <p className="text-white">
              International Association of Jesuit Engineering Schools
              <br />
              [PLACEHOLDER] Street Address, City, State, ZIP
            </p>
            <a href="mailto:info@iajes.org" className="!text-white duration-200 hover:!text-primary-light">
              [PLACEHOLDER]info@iajes.org
            </a>
            <br />
            <a href="tel:+10000000000" className="!text-white duration-200 hover:!text-primary-light">
              [PLACEHOLDER]+1 (000) 000-0000
            </a>
          </div>

          <div>
            <h4 className="!text-primary-light mb-5">Social</h4>
            <div className="flex gap-5 text-3xl">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="!text-white duration-200 hover:!text-primary-light"
                >
                  <i className={`bi ${social.icon}`}></i>
                </a>
              ))}
            </div>
            <p className="text-white mt-5">
              [PLACEHOLDER] Replace social URLs with official client accounts.
            </p>
          </div>

          <div>
            <h4 className="!text-primary-light mb-5">Stay Informed</h4>
            <p className="text-white">
              Get updates on international meetings, task force activity, and newly released resources.
            </p>
            <a href="/newsletter" className="button button-light mt-5 inline-block">
              Newsletter
            </a>
          </div>
        </div>

        <div className="mt-10">
          <h5 className="!text-primary-light mb-4">Navigate</h5>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
            {footerNavigation.map((section) => (
              <div key={section.title} className="border-2 border-primary-light rounded-md p-4">
                <h6 className="!text-white mb-3">{section.title}</h6>
                <div className="flex flex-col gap-2">
                  {section.links.map((item) => (
                    <a key={item.href} href={item.href} className="!text-white duration-200 hover:!text-primary-light">
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-5 border-t-2 border-primary-light flex lg:flex-row flex-col gap-5 justify-between">
          <p className="text-white">
            © {currentYear} [PLACEHOLDER] IAJES. All rights reserved.
          </p>
          <div className="flex gap-5 flex-wrap">
            {legalLinks.map((item) => (
              <a key={item.label} href={item.href} className="!text-white duration-200 hover:!text-primary-light">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
