import SiteHeader from "@/components/site-header";
import BrowserFrame from "@/components/browser-frame";
import ArrowIcon from "@/components/arrow-icon";
import SiteFooter from "@/components/site-footer";
import type { Project } from "@/lib/projects";

export default function CaseStudyPage({
  project,
  nextProject,
}: {
  project: Project;
  nextProject: Project;
}) {
  return (
    <div id="top" className={"site-shell case-study-shell case-" + project.theme}>
      <div className="ambient ambient-purple" aria-hidden="true" />
      <SiteHeader />
      <main id="main-content">
        <section className="case-hero" aria-labelledby="case-title">
          <div className="container">
            <nav className="case-breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a><span>/</span>
              <a href="/#work">Selected work</a><span>/</span>
              <span aria-current="page">{project.title}</span>
            </nav>

            <div className="case-header-layout">
              <div className="case-header-copy">
                <p className="section-label"><span>{project.number} /</span> CASE STUDY</p>
                <h1 id="case-title">{project.title}<span className="case-dot">.</span></h1>
                <p className="case-headline">{project.headline}</p>
                <div className="case-buttons">
                  <a className="button primary-button" href={project.url} target="_blank" rel="noopener noreferrer">
                    Visit live project <ArrowIcon diagonal />
                  </a>
                  <a className="button outline-button" href="/#work">Back to work <ArrowIcon /></a>
                </div>
              </div>
              <aside className="case-facts" aria-label="Project overview">
                <div><span>PROJECT CATEGORY</span><strong>{project.category}</strong></div>
                <div><span>INDUSTRY / USE</span><strong>{project.industry}</strong></div>
                <div><span>FOCUS AREAS</span><p>{project.features.join(" / ")}</p></div>
              </aside>
            </div>

            <figure className={"case-visual case-visual-" + project.theme}>
              <div className="case-visual-grid" aria-hidden="true" />
              <span className="case-visual-label" aria-hidden="true">ACTUAL PRODUCT SCREEN</span>
              <BrowserFrame
                src={project.screenshot}
                alt={project.alt}
                hostname={new URL(project.url).hostname}
                className="case-browser"
                priority
                sizes="(max-width: 760px) 95vw, 1050px"
              />
              <figcaption>{project.imageCaption}</figcaption>
            </figure>
          </div>
        </section>

        <section className="case-overview-section" aria-labelledby="case-overview-title">
          <div className="container case-overview-grid">
            <div>
              <p className="section-label"><span>01 /</span> THE OVERVIEW</p>
              <h2 id="case-overview-title">A closer look at<br /><em>the product.</em></h2>
            </div>
            <div className="case-overview-copy">
              <p>{project.overview}</p>
              <div className="case-feature-pills">
                {project.features.map((feature) => <span key={feature}>{feature}</span>)}
              </div>
            </div>
          </div>
        </section>

        <section className="case-details-section" aria-labelledby="case-details-title">
          <div className="container">
            <div className="case-details-heading">
              <p className="section-label"><span>02 /</span> {project.detailLabel}</p>
              <h2 id="case-details-title">The key <em>workflows.</em></h2>
            </div>
            <div className="case-detail-grid">
              {project.details.map((detail) => (
                <article key={detail.number} className="case-detail-card">
                  <span className="case-detail-index">{detail.number}</span>
                  <div className="case-detail-rule" aria-hidden="true" />
                  <h3>{detail.title}</h3>
                  <p>{detail.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="case-design-section" aria-labelledby="case-design-title">
          <div className="container case-design-grid">
            <div>
              <p className="section-label"><span>03 /</span> INTERFACE FOCUS</p>
              <h2 id="case-design-title">{project.designTitle}</h2>
              <p>{project.designDescription}</p>
            </div>
            <aside className="case-design-note">
              <div className="case-note-symbol" aria-hidden="true"><span>[</span>JRC<span>]</span></div>
              <span className="case-note-kicker">FROM THE ACTUAL SCREEN</span>
              <p>{project.screenshotNote}</p>
            </aside>
          </div>
        </section>

        <section className="case-next-section" aria-label="Next project">
          <div className="container case-next-grid">
            <div>
              <p className="section-label"><span>KEEP EXPLORING /</span> NEXT PROJECT</p>
              <h2>{nextProject.title}</h2>
              <p>{nextProject.description}</p>
            </div>
            <a href={"/work/" + nextProject.slug} className="next-project-link" aria-label={"View " + nextProject.title + " case study"}>
              <ArrowIcon diagonal />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
