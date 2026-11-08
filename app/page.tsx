import SiteHeader from "@/components/site-header";
import BrowserFrame from "@/components/browser-frame";
import ArrowIcon from "@/components/arrow-icon";
import SiteFooter from "@/components/site-footer";
import ScrollExperience from "@/components/scroll-experience";
import CursorCompanion from "@/components/cursor-companion";
import WorkShowcase from "@/components/work-showcase";
import ServicesExplorer from "@/components/services-explorer";
import StudioScene from "@/components/studio-scene";
import ProjectInquiryForm from "@/components/project-inquiry-form";
import CopyEmailButton from "@/components/copy-email-button";
import { contactEmail, gmailComposeHref, socialLinks } from "@/lib/contact";

export default function Home() {
  return (
    <div className="site-shell story-shell editorial-preview">
      <ScrollExperience />
      <CursorCompanion />
      <div className="ambient ambient-purple" aria-hidden="true" />
      <div className="ambient ambient-blue" aria-hidden="true" />
      <SiteHeader arcadeNavTarget="/#arcade" />

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
              <a className="hero-screen hero-screen-suki" href="/work/sukisuite" aria-label="Explore the SukiSuite case study">
                <BrowserFrame
                  src="/projects/sukisuite.png"
                  alt="Actual SukiSuite homepage and booking management interface"
                  hostname="sukisuite.com"
                  className="suki-frame"
                  priority
                />
                <span className="hero-screen-action" aria-hidden="true">EXPLORE CASE STUDY ↗</span>
              </a>
              <a className="hero-screen hero-screen-yield" href="/work/better-yield" aria-label="Explore the Better Yield POS case study">
                <BrowserFrame
                  src="/projects/better-yield.png"
                  alt="Actual Better Yield POS sign-in interface"
                  hostname="better-yield-magpet-pos.pages.dev"
                  className="yield-frame"
                />
                <span className="hero-screen-action" aria-hidden="true">EXPLORE CASE STUDY ↗</span>
              </a>
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
            <a className="scene-next-link" href="#arcade">Take a quick game break <ArrowIcon /></a>
          </div>
        </section>

        <section id="arcade" className="story-scene scene-arcade" aria-labelledby="arcade-slide-title">
          <div className="container scene-frame">
            <div className="scene-heading" data-reveal>
              <div>
                <p className="section-label"><span>05 /</span> JRC ARCADE</p>
                <h2 id="arcade-slide-title">A little break.<br /><em>A lot of play.</em></h2>
              </div>
              <p>Five free browser games—including our new JRC Bot adventure and Filipino cashier challenge. No installs, no accounts, just play.</p>
            </div>
            <div className="arcade-slide-layout" data-reveal>
              <div className="arcade-slide-feature">
                <p className="arcade-slide-kicker"><span /> MADE BY JRC TECHWORKS</p>
                <div className="arcade-slide-emblem" aria-hidden="true">
                  <div className="arcade-slide-emblem-glow" />
                  <span className="arcade-slide-emblem-mark">[J]</span>
                  <strong>ARCADE<span>.</span></strong>
                  <small>INSERT FUN · PRESS PLAY</small>
                </div>
                <div className="arcade-slide-feature-bottom">
                  <p>Save three businesses as JRC Bot, chase your high score, or test your <em>sukli</em> skills behind a mini POS counter.</p>
                  <a className="button primary-button arcade-slide-cta" href="/arcade/system-rescue">Play our featured game <ArrowIcon diagonal /></a>
                </div>
              </div>
              <div className="arcade-slide-cards" aria-label="Games you can play in JRC Arcade">
                <a className="arcade-slide-card arcade-slide-snake" href="/arcade">
                  <span className="arcade-slide-card-number">01 / CLASSIC</span>
                  <span className="arcade-slide-card-art arcade-slide-snake-art" aria-hidden="true"><i /><i /><i /><i /><b /></span>
                  <span className="arcade-slide-card-copy"><strong>Neon Snake</strong><small>Chase the glow. Dodge your tail.</small></span>
                  <span className="arcade-slide-card-arrow" aria-hidden="true">↗</span>
                </a>
                <a className="arcade-slide-card arcade-slide-2048" href="/arcade">
                  <span className="arcade-slide-card-number">02 / PUZZLE</span>
                  <span className="arcade-slide-card-art arcade-slide-number-art" aria-hidden="true"><i>2</i><i>4</i><i>8</i></span>
                  <span className="arcade-slide-card-copy"><strong>2048 Challenge</strong><small>Merge tiles. Reach the goal.</small></span>
                  <span className="arcade-slide-card-arrow" aria-hidden="true">↗</span>
                </a>
                <a className="arcade-slide-card arcade-slide-memory" href="/arcade">
                  <span className="arcade-slide-card-number">03 / FOCUS</span>
                  <span className="arcade-slide-card-art arcade-slide-memory-art" aria-hidden="true"><i>✦</i><i>?</i><i>✦</i></span>
                  <span className="arcade-slide-card-copy"><strong>Memory Match</strong><small>Find the matching pairs.</small></span>
                  <span className="arcade-slide-card-arrow" aria-hidden="true">↗</span>
                </a>
                <a className="arcade-slide-card arcade-slide-cashier" href="/arcade">
                  <span className="arcade-slide-card-number">04 / JRC ORIGINAL</span>
                  <span className="arcade-slide-card-art arcade-slide-cashier-art" aria-hidden="true"><i>₱</i><span>SALE<br /><b>₱ 120</b></span></span>
                  <span className="arcade-slide-card-copy"><strong>Cashier Rush</strong><small>Compute the right sukli.</small></span>
                  <span className="arcade-slide-card-arrow" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <a className="scene-next-link" href="#rescue">Meet JRC Bot: System Rescue <ArrowIcon /></a>
          </div>
        </section>

        <section id="rescue" className="story-scene scene-rescue" aria-labelledby="rescue-slide-title">
          <div className="container scene-frame">
            <div className="scene-heading" data-reveal>
              <div>
                <p className="section-label"><span>06 /</span> FEATURED JRC ORIGINAL</p>
                <h2 id="rescue-slide-title">Small bot.<br /><em>Big mission.</em></h2>
              </div>
              <p>Meet the little robot who fixes big problems. Our newest browser game is built around the business systems we love creating.</p>
            </div>
            <div className="rescue-slide-panel" data-reveal>
              <div className="rescue-slide-info">
                <p className="rescue-slide-kicker"><span /> NOW PLAYABLE / FREE</p>
                <h3>JRC BOT:<br /><span>SYSTEM RESCUE.</span></h3>
                <p>Jump between platforms, dodge glitches, and repair three worlds: a broken cashier, a chaotic stockroom, and a booking system in trouble.</p>
                <div className="rescue-slide-pills"><span>03 LEVELS</span><span>DOUBLE JUMP + DASH</span><span>ONLINE SCORES</span></div>
                <a className="button primary-button rescue-slide-cta" href="/arcade/system-rescue">PLAY THE GAME <ArrowIcon diagonal /></a>
                <small>YOUR PLAYER NAME &amp; PERSONAL BEST STAY SAVED IN THIS BROWSER.</small>
              </div>
              <a className="rescue-slide-screen" href="/arcade/system-rescue" aria-label="Play JRC Bot: System Rescue">
                <span className="rescue-slide-screen-top"><span><i /> SYSTEM RESCUE / WORLD 01</span><b>● LIVE GAME</b></span>
                <span className="rescue-slide-city" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></span>
                <span className="rescue-slide-terminal" aria-hidden="true"><b>✓</b><strong>POS<br />REPAIR</strong><small>RESTORE SYSTEM</small></span>
                <span className="rescue-slide-glitch" aria-hidden="true"><i/><b>× ×</b></span>
                <span className="rescue-slide-bot" aria-hidden="true"><i className="rescue-slide-bot-antenna"/><span className="rescue-slide-bot-face"><i/><i/><b/></span><strong>JRC</strong></span>
                <span className="rescue-slide-platform rescue-slide-platform-a" aria-hidden="true" />
                <span className="rescue-slide-platform rescue-slide-platform-b" aria-hidden="true" />
                <span className="rescue-slide-platform rescue-slide-platform-c" aria-hidden="true" />
                <span className="rescue-slide-gem rescue-slide-gem-a" aria-hidden="true">◆</span>
                <span className="rescue-slide-gem rescue-slide-gem-b" aria-hidden="true">◆</span>
                <span className="rescue-slide-screen-bottom">JUMP THE GAPS <b>•</b> FIX THE GLITCHES <b>•</b> SAVE THE DAY <span>↗</span></span>
              </a>
            </div>
            <a className="scene-next-link" href="#contact">Ready to build something real? <ArrowIcon /></a>
          </div>
        </section>

        <section id="contact" className="story-scene scene-contact contact-section" aria-labelledby="contact-title">
          <div className="container scene-frame">
            <div className="scene-heading" data-reveal>
              <div>
                <p className="section-label"><span>07 /</span> YOUR TURN</p>
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
                <span className="contact-email-address">{contactEmail}</span>
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
                <a className="contact-channel" href={gmailComposeHref} target="_blank" rel="noopener noreferrer" aria-label="Compose an email in Gmail (opens new tab)">
                  <span className="channel-glyph" aria-hidden="true">@</span>
                  <span className="channel-copy"><strong>Compose email</strong><small>Gmail in your browser</small></span>
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
