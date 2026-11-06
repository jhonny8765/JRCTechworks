import SiteHeader from "@/components/site-header";
import BrowserFrame from "@/components/browser-frame";
import ArrowIcon from "@/components/arrow-icon";
import ServiceIcon from "@/components/service-icon";
import SiteFooter from "@/components/site-footer";
import ProjectInquiryForm from "@/components/project-inquiry-form";
import { projects } from "@/lib/projects";
import { services } from "@/lib/services";
import { contactEmail, projectInquiryHref, socialLinks } from "@/lib/contact";

export default function Home() {
  return (
    <div id="top" className="site-shell">
      <div className="ambient ambient-purple" aria-hidden="true" />
      <div className="ambient ambient-blue" aria-hidden="true" />
      <SiteHeader />

      <main id="main-content">
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
                <a className="button primary-button" href="#contact">Discuss your project <ArrowIcon diagonal /></a>
                <a className="button outline-button" href="#work">Explore our work <ArrowIcon /></a>
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
                  <a className="service-inquiry-link" href={`/?service=${encodeURIComponent(service.title)}#contact`}>
                    Discuss this service <ArrowIcon />
                  </a>
                </article>
              ))}
            </div>
            <div className="services-bottom">
              <p>Have a different idea? We love building around unique workflows.</p>
              <a href="#contact">Tell us what you have in mind <ArrowIcon diagonal /></a>
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
          <div className="container">
            <div className="approach-layout">
              <div>
                <p className="section-label"><span>03 /</span> HOW WE WORK</p>
                <h2 id="approach-title">Good technology<br /><em>starts with listening.</em></h2>
              </div>
              <div className="approach-text">
                <p>
                  Every business works differently. We start with the people and the
                  problem, then shape the design and software around what matters.
                </p>
                <a href="#contact">Tell us what you're building <ArrowIcon diagonal /></a>
              </div>
            </div>
            <ol className="approach-steps" aria-label="Our three-step approach">
              <li className="approach-step">
                <span className="approach-step-index">01 / DISCOVER</span>
                <h3>Understand the work.</h3>
                <p>We talk through your goals, the people using the tool, and where the current process gets difficult.</p>
              </li>
              <li className="approach-step">
                <span className="approach-step-index">02 / MAKE</span>
                <h3>Design and build.</h3>
                <p>We turn the workflow into clear screens and working features you can review as the idea takes shape.</p>
              </li>
              <li className="approach-step">
                <span className="approach-step-index">03 / REFINE</span>
                <h3>Make it useful.</h3>
                <p>We review the experience with you, refine the important details, and keep the next steps clear.</p>
              </li>
            </ol>
          </div>
        </section>

        <section id="about" className="about-section" aria-labelledby="about-title">
          <div className="container about-layout">
            <div className="about-copy">
              <p className="section-label"><span>04 /</span> WHO WE ARE</p>
              <h2 id="about-title">Two builders.<br /><em>One shared vision.</em></h2>
              <p className="about-lead">
                JRC Techworks is an independent, two-person software studio based in the Philippines.
                We design and build the websites, applications, and everyday business tools that help ideas move forward.
              </p>
              <p className="about-support">
                Small by design, we keep the conversation close to the work — from understanding a workflow to building something people can actually use.
              </p>
              <div className="about-principle">
                <span className="about-principle-mark" aria-hidden="true">✳</span>
                <span>OUR FOCUS</span>
                <strong>Make useful technology feel effortless.</strong>
              </div>
            </div>

            <div className="team-panel" aria-label="Meet the JRC Techworks team">
              <div className="team-panel-top">
                <span>THE PEOPLE BEHIND THE BUILD</span>
                <span className="team-count">02 <small>/ BUILDERS</small></span>
              </div>
              <div className="team-orbit" aria-hidden="true">
                <div className="team-orbit-ring team-orbit-ring-one" />
                <div className="team-orbit-ring team-orbit-ring-two" />
                <div className="team-orbit-initial team-orbit-initial-one">JRC</div>
                <div className="team-orbit-initial team-orbit-initial-two">02</div>
                <span className="team-orbit-caption">IDEAS × DESIGN × DEVELOPMENT</span>
              </div>
              <div className="team-list">
                <div className="team-member">
                  <span className="team-member-index">01</span>
                  <div>
                    <strong>Jhon Rey Consolacion</strong>
                    <p>Developer &amp; automation builder</p>
                  </div>
                  <span className="team-member-dot" aria-hidden="true" />
                </div>
                <div className="team-member">
                  <span className="team-member-index">02</span>
                  <div>
                    <strong>Studio collaborator</strong>
                    <p>Second member of JRC Techworks</p>
                  </div>
                  <span className="team-member-dot" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section" aria-labelledby="contact-title">
          <div className="container">
            <div className="contact-panel">
              <div className="contact-copy">
                <p className="section-label"><span>05 /</span> LET'S CONNECT</p>
                <h2 id="contact-title">Have a project<br />in mind?<br /><em>Let's make it work.</em></h2>
                <p>
                  A website, a custom system, or a workflow you wish could run itself?
                  Tell us what you have in mind and we can talk through the next steps.
                </p>
                <a className="button primary-button contact-primary" href="#project-brief">
                  Share your project brief <ArrowIcon diagonal />
                </a>
                <p className="contact-alternative">Prefer to talk directly?</p>
                <a className="contact-email-address" href={projectInquiryHref}>{contactEmail}</a>
              </div>
              <div id="project-brief" className="contact-form-anchor">
                <ProjectInquiryForm />
              </div>
            </div>
            <div className="contact-console contact-channels">
                <div className="contact-console-header">
                  <span className="contact-console-light" />
                  <span>OTHER WAYS TO CONNECT</span>
                  <span className="contact-console-status">CHOOSE YOUR CHANNEL</span>
                </div>
                <div className="contact-console-body contact-channel-grid">
                  <a className="contact-channel" href={projectInquiryHref}>
                    <span className="channel-glyph" aria-hidden="true">@</span>
                    <span className="channel-copy"><strong>Email</strong><small>{contactEmail}</small></span>
                    <ArrowIcon diagonal />
                  </a>
                  {socialLinks.map((link) => (
                    <a className="contact-channel" href={link.href} key={link.label} target="_blank" rel="noopener noreferrer">
                      <span className="channel-glyph" aria-hidden="true">{link.monogram}</span>
                      <span className="channel-copy"><strong>{link.label}</strong><small>{link.detail}</small></span>
                      <ArrowIcon diagonal />
                    </a>
                  ))}
                </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
