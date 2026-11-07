import SiteHeader from "@/components/site-header";
import BrowserFrame from "@/components/browser-frame";
import ArrowIcon from "@/components/arrow-icon";
import SiteFooter from "@/components/site-footer";
import ScrollExperience from "@/components/scroll-experience";
import WorkShowcase from "@/components/work-showcase";
import ServicesExplorer from "@/components/services-explorer";
import StudioScene from "@/components/studio-scene";
import ProjectInquiryForm from "@/components/project-inquiry-form";
import CopyEmailButton from "@/components/copy-email-button";
import { contactEmail, projectInquiryHref, socialLinks } from "@/lib/contact";

export default function Home() {
  return (
    <div className="site-shell story-shell">
      <ScrollExperience />
      <div className="ambient ambient-purple" aria-hidden="true" />
      <div className="ambient ambient-blue" aria-hidden="true" />
      <SiteHeader />

      <div className="story-viewport">
      <main id="main-content" className="story-main" tabIndex={-1}>
        <section id="top" className="hero story-scene scene-home" aria-labelledby="hero-title">
          <div className="container hero-layout">
            <div className="hero-copy" data-reveal>
              <p className="eyebrow">
                <span className="pulse" aria-hidden="true" />
                INDEPENDENT SOFTWARE STUDIO <span className="eyebrow-slash">/</span> PHILIPPINES
              </p>
              <h1 id="hero-title" className="hero-title">
                Software that<br /><span className="muted-title">works for </span><span className="gradient-type">you.</span>
              </h1>
              <p className="hero-description">
                Thoughtful websites, business systems, and automations that turn complicated work into something simple.
              </p>
              <div className="hero-actions">
                <a className="button primary-button" href="#work">See what we build <ArrowIcon /></a>
                <a className="button outline-button" href="#project-brief">Start a project <ArrowIcon diagonal /></a>
              </div>
              <p className="hero-caption">
                <span className="caption-line" aria-hidden="true" />
                WEB <b>•</b> SOFTWARE <b>•</b> POS <b>•</b> AUTOMATION
              </p>
              <p className="mobile-swipe-hint">SWIPE UP TO EXPLORE <span aria-hidden="true">↑</span></p>
            </div>
            <div className="hero-art" data-reveal aria-label="Previews of real SukiSuite and Better Yield projects">
              <div className="art-grid" aria-hidden="true" />
              <div className="art-circle circle-one" aria-hidden="true" />
              <div className="art-circle circle-two" aria-hidden="true" />
              <div className="art-label art-label-top" aria-hidden="true"><span className="tiny-pulse" /> ACTUAL WORK. NOT CONCEPTS.</div>
              <div className="hero-screen hero-screen-suki">
                <BrowserFrame
                  src="/projects/sukisuite.png"
                  alt="Actual SukiSuite homepage and booking management interface"
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
          <a className="scene-scroll-cue" href="#work" aria-label="Scroll to selected work">
            <span>SCROLL OR SWIPE TO ADVANCE</span><span aria-hidden="true">↓</span>
          </a>
        </section>

        <section id="work" className="story-scene scene-work" aria-labelledby="work-title">
          <div className="container scene-frame">
            <div className="scene-heading" data-reveal>
              <div>
                <p className="section-label"><span>02 /</span> SELECTED WORK</p>
                <h2 id="work-title">Real products.<br /><em>Real proof.</em></h2>
              </div>
              <p>Explore two products we've worked on. Switch between them to see the real interfaces and what they do.</p>
            </div>
            <div data-reveal><WorkShowcase /></div>
            <a className="scene-next-link" href="#services">Explore our services <ArrowIcon /></a>
          </div>
        </section>

        <section id="services" className="story-scene scene-services" aria-labelledby="services-title">
          <div className="container scene-frame">
            <div className="scene-heading" data-reveal>
              <div>
                <p className="section-label"><span>03 /</span> WHAT WE DO</p>
                <h2 id="services-title">Built around<br /><em>your next idea.</em></h2>
              </div>
              <p>Six capabilities, one focused studio. Choose a service to see how we can help.</p>
            </div>
            <div data-reveal><ServicesExplorer /></div>
            <a className="scene-next-link" href="#about">Meet the builders <ArrowIcon /></a>
          </div>
        </section>

        <section id="about" className="story-scene scene-studio" aria-labelledby="studio-title">
          <span id="approach" className="anchor-marker" aria-hidden="true" />
          <div className="container scene-frame">
            <div className="scene-heading" data-reveal>
              <div>
                <p className="section-label"><span>04 /</span> BEHIND THE WORK</p>
                <h2 id="studio-title">Meet the <em>studio.</em></h2>
              </div>
              <p>Get to know the small team behind JRC Techworks and how we turn ideas into useful technology.</p>
            </div>
            <div data-reveal><StudioScene /></div>
            <a className="scene-next-link" href="#contact">Have something in mind? <ArrowIcon /></a>
          </div>
        </section>

        <section id="contact" className="story-scene scene-contact contact-section" aria-labelledby="contact-title">
          <div className="container scene-frame">
            <div className="scene-heading" data-reveal>
              <div>
                <p className="section-label"><span>05 /</span> YOUR TURN</p>
                <h2 id="contact-title">Let's build <em>something useful.</em></h2>
              </div>
              <p>Got a website, POS, inventory tool, app, or automation in mind? Start with a short brief.</p>
            </div>
            <div className="contact-panel" data-reveal>
              <div className="contact-copy">
                <p className="section-label">LET'S CONNECT</p>
                <h3>Big idea?<br /><em>Start small.</em></h3>
                <p>Tell us what you want to make better. We'll start with the problem, then talk through what to build.</p>
                <a className="button primary-button contact-primary" href="#project-brief">
                  Start your brief <ArrowIcon diagonal />
                </a>
                <p className="contact-alternative">Prefer email?</p>
                <a className="contact-email-address" href={projectInquiryHref}>{contactEmail}</a>
                <CopyEmailButton />
              </div>
              <div id="project-brief" className="contact-form-anchor">
                <ProjectInquiryForm />
              </div>
            </div>
            <div className="contact-console contact-channels" data-reveal>
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
      </div>

      <SiteFooter />
    </div>
  );
}
