import SiteHeader from "@/components/site-header";
import BrowserFrame from "@/components/browser-frame";
import ArrowIcon from "@/components/arrow-icon";
import ServiceIcon from "@/components/service-icon";
import { projects } from "@/lib/projects";
import { services } from "@/lib/services";

const email = "mailto:jhonreyc2001@gmail.com?subject=Project%20inquiry%20for%20JRC%20Techworks";

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
                <a className="button primary-button" href="#work">Explore our work <ArrowIcon /></a>
                <a className="button outline-button" href={email}>Start a project <ArrowIcon diagonal /></a>
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
                <BrowserFrame
                  src="/projects/sukisuite.png"
                  alt="Actual SukiSuite homepage with booking management interface"
                  hostname="sukisuite.com"
                  className="suki-frame"
                  priority
                />
              </div>
              <div className="hero-screen hero-screen-yield">
                <BrowserFrame
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

        <section id="services" className="services-section" aria-labelledby="services-title">
          <div className="container">
            <div className="services-heading">
              <div>
                <p className="section-label"><span>01 /</span> WHAT WE DO</p>
                <h2 id="services-title">The right tools for<br /><em>what comes next.</em></h2>
              </div>
              <p>One studio for the digital experiences people see and the business systems they depend on.</p>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <article key={service.number} className="service-card">
                  <div className="service-card-top">
                    <div className="service-icon"><ServiceIcon name={service.icon} /></div>
                    <span>{service.number} / 06</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <div className="service-deliverables">
                    {service.deliverables.map((item) => <span key={item}>{item}</span>)}
                  </div>
                </article>
              ))}
            </div>
            <div className="services-bottom">
              <p>Have a different idea? We love building around unique workflows.</p>
              <a href={email}>Tell us what you have in mind <ArrowIcon diagonal /></a>
            </div>
          </div>
        </section>

        <section id="work" className="work-section" aria-labelledby="work-title">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="section-label"><span>02 /</span> SELECTED WORK</p>
                <h2 id="work-title">Built for the <em>real world.</em></h2>
              </div>
              <p>A look at two products we've worked on — designed to make everyday operations less complicated.</p>
            </div>

            <div className="projects">
              {projects.map((project) => (
                <article key={project.title} className={"project-card " + project.theme}>
                  <a
                    className="project-visual-link"
                    href={"/work/" + project.slug}
                    aria-label={"Read " + project.title + " case study"}
                  >
                    <div className="project-visual">
                      <BrowserFrame
                        src={project.screenshot}
                        alt={project.alt}
                        hostname={new URL(project.url).hostname}
                        className={"project-frame " + project.theme + "-frame"}
                      />
                      <span className="project-external-icon" aria-hidden="true"><ArrowIcon diagonal /></span>
                    </div>
                  </a>
                  <div className="project-body">
                    <div className="project-meta"><span>{project.number} / FEATURED PROJECT</span><span>{project.category}</span></div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tags">
                      {project.features.map((feature) => <span key={feature}>{feature}</span>)}
                    </div>
                    <div className="project-actions">
                      <a className="project-link" href={"/work/" + project.slug}>
                        Read case study <ArrowIcon />
                      </a>
                      <a className="project-live-link" href={project.url} target="_blank" rel="noopener noreferrer">
                        Live project <ArrowIcon diagonal />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="approach" className="approach-section" aria-labelledby="approach-title">
          <div className="container approach-layout">
            <div>
              <p className="section-label"><span>03 /</span> OUR APPROACH</p>
              <h2 id="approach-title">Good technology<br /><em>gets out of the way.</em></h2>
            </div>
            <div className="approach-text">
              <p>
                Useful software starts by understanding the people who will use it.
                Thoughtful design, clean engineering, and attention to the little
                details — that's how an idea becomes something people rely on.
              </p>
              <a href={email}>Have something in mind? Let's build it <ArrowIcon diagonal /></a>
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
