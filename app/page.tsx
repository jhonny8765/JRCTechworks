import Image from "next/image";
import SiteHeader from "@/components/site-header";

const email = "mailto:jhonreyc2001@gmail.com?subject=Project%20inquiry%20for%20JRC%20Techworks";

const projects = [
  {
    number: "01",
    title: "SukiSuite",
    category: "SAAS PLATFORM",
    description: "Bookings, client records, and thoughtful follow-ups — brought together in one workspace for service businesses.",
    features: ["Bookings", "Client management", "Follow-ups"],
    url: "https://sukisuite.com/",
    screenshot: "/projects/sukisuite.png",
    alt: "SukiSuite homepage showing an appointment and client follow-up interface",
    theme: "suki",
  },
  {
    number: "02",
    title: "Better Yield POS",
    category: "POINT OF SALE SYSTEM",
    description: "A retail-focused point-of-sale experience for Better Yield, designed around cash checkout, stock records, and branches.",
    features: ["Point of sale", "Stock records", "Branches"],
    url: "https://better-yield-magpet-pos.pages.dev/",
    screenshot: "/projects/better-yield.png",
    alt: "Better Yield POS welcome screen with forest-green brand design",
    theme: "yield",
  },
] as const;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h16m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScreenshotFrame({
  src,
  alt,
  hostname,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  hostname: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={"browser-frame " + className}>
      <div className="browser-bar" aria-hidden="true">
        <span className="browser-dots"><i /><i /><i /></span>
        <span className="browser-domain">{hostname}</span>
        <span className="browser-bar-space" />
      </div>
      <Image
        src={src}
        alt={alt}
        width={1599}
        height={813}
        className="browser-image"
        priority={priority}
        sizes="(max-width: 700px) 92vw, (max-width: 1150px) 52vw, 620px"
      />
    </div>
  );
}

export default function Home() {
  return (
    <div id="top" className="site-shell">
      <div className="ambient ambient-purple" aria-hidden="true" />
      <div className="ambient ambient-blue" aria-hidden="true" />
      <SiteHeader />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero-layout">
            <div className="hero-copy">
              <p className="eyebrow fade-up">
                <span className="pulse" aria-hidden="true" />
                INDEPENDENT SOFTWARE STUDIO <span className="eyebrow-slash">/</span> PHILIPPINES
              </p>
              <h1 id="hero-title" className="hero-title fade-up delay-1">
                Software that<br /><span className="muted-title">works for </span><span className="gradient-type">you.</span>
              </h1>
              <p className="hero-description fade-up delay-2">
                From beautiful websites to the systems running behind a business,
                we turn complex ideas into digital experiences that feel simple.
              </p>
              <div className="hero-actions fade-up delay-3">
                <a className="button primary-button" href="#work">Explore our work <Arrow /></a>
                <a className="button outline-button" href={email}>Start a project <Arrow diagonal /></a>
              </div>
              <p className="hero-caption fade-up delay-4">
                <span className="caption-line" aria-hidden="true" />
                WEBSITES <b>•</b> BUSINESS SYSTEMS <b>•</b> AUTOMATION
              </p>
            </div>

            <div className="hero-art" aria-label="Previews of our real SukiSuite and Better Yield software projects">
              <div className="art-grid" aria-hidden="true" />
              <div className="art-circle circle-one" aria-hidden="true" />
              <div className="art-circle circle-two" aria-hidden="true" />
              <div className="art-label art-label-top" aria-hidden="true"><span className="tiny-pulse" /> REAL PRODUCTS. REAL WORK.</div>
              <div className="hero-screen hero-screen-suki">
                <ScreenshotFrame
                  src="/projects/sukisuite.png"
                  alt="Actual SukiSuite homepage with booking management interface"
                  hostname="sukisuite.com"
                  className="suki-frame"
                  priority
                />
              </div>
              <div className="hero-screen hero-screen-yield">
                <ScreenshotFrame
                  src="/projects/better-yield.png"
                  alt="Actual Better Yield POS sign-in interface"
                  hostname="better-yield-magpet-pos.pages.dev"
                  className="yield-frame"
                  priority
                />
              </div>
              <div className="art-label art-label-bottom" aria-hidden="true"><span>&lt;/&gt;</span> DESIGN + ENGINEERING</div>
            </div>
          </div>
        </section>

        <div className="capabilities" aria-label="Our capabilities">
          <div className="container capabilities-row">
            <strong>WHAT WE BUILD</strong>
            <span>Web experiences</span><i />
            <span>Custom applications</span><i />
            <span>POS &amp; inventory</span><i />
            <span>Smart automations</span>
          </div>
        </div>

        <section id="work" className="work-section" aria-labelledby="work-title">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="section-label"><span>01 /</span> SELECTED WORK</p>
                <h2 id="work-title">Built for the <em>real world.</em></h2>
              </div>
              <p>A look at two products we've worked on — designed to make everyday operations less complicated.</p>
            </div>

            <div className="projects">
              {projects.map((project) => (
                <article key={project.title} className={"project-card " + project.theme}>
                  <a
                    className="project-visual-link"
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={"Visit " + project.title + " (opens in a new tab)"}
                  >
                    <div className="project-visual">
                      <ScreenshotFrame
                        src={project.screenshot}
                        alt={project.alt}
                        hostname={new URL(project.url).hostname}
                        className={"project-frame " + project.theme + "-frame"}
                      />
                      <span className="project-external-icon" aria-hidden="true"><Arrow diagonal /></span>
                    </div>
                  </a>
                  <div className="project-body">
                    <div className="project-meta"><span>{project.number} / FEATURED PROJECT</span><span>{project.category}</span></div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tags">
                      {project.features.map((feature) => <span key={feature}>{feature}</span>)}
                    </div>
                    <a className="project-link" href={project.url} target="_blank" rel="noopener noreferrer">
                      Visit live project <Arrow diagonal />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="approach" className="approach-section" aria-labelledby="approach-title">
          <div className="container approach-layout">
            <div>
              <p className="section-label"><span>02 /</span> OUR APPROACH</p>
              <h2 id="approach-title">Good technology<br /><em>gets out of the way.</em></h2>
            </div>
            <div className="approach-text">
              <p>
                Useful software starts by understanding the people who will use it.
                Thoughtful design, clean engineering, and attention to the little
                details — that's how an idea becomes something people rely on.
              </p>
              <a href={email}>Have something in mind? Let's build it <Arrow diagonal /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-row">
          <a href="#top" className="footer-logo">JRC<span>TECHWORKS</span></a>
          <p>Building technology that works for you.</p>
          <span>© {new Date().getFullYear()} JRC Techworks</span>
        </div>
      </footer>
    </div>
  );
}
