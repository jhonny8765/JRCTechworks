"use client";

import { useState } from "react";
import { projects } from "@/lib/projects";
import BrowserFrame from "@/components/browser-frame";
import ArrowIcon from "@/components/arrow-icon";

export default function WorkShowcase() {
  const [selected, setSelected] = useState(0);
  const project = projects[selected];

  return (
    <div className="work-showcase">
      <div className="work-switcher" role="tablist" aria-label="Featured projects">
        {projects.map((item, index) => (
          <button
            type="button"
            id={`project-tab-${index}`}
            role="tab"
            aria-controls="featured-project-panel"
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            className={selected === index ? "is-active" : ""}
            key={item.slug}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === "Home" ? 0 : event.key === "End" ? projects.length - 1 :
                (selected + (event.key === "ArrowRight" ? 1 : -1) + projects.length) % projects.length;
              setSelected(next);
              document.getElementById(`project-tab-${next}`)?.focus();
            }}
          >
            <span>{item.number}</span> {item.title}
          </button>
        ))}
        <span className="work-switcher-hint">SELECT A PRODUCT ↗</span>
      </div>

      <article
        className={`work-feature work-feature-${project.theme}`}
        role="tabpanel"
        id="featured-project-panel"
        aria-labelledby={`project-tab-${selected}`}
        key={project.slug}
      >
        <div className="work-feature-copy">
          <p className="work-feature-kicker">{project.number} / LIVE PRODUCT · {project.category}</p>
          <h3>{project.title}<span>.</span></h3>
          <p className="work-feature-description">{project.description}</p>
          <div className="work-feature-tags">
            {project.features.map((feature) => <span key={feature}>{feature}</span>)}
          </div>
          <div className="work-feature-actions">
            <a className="button primary-button" href={`/work/${project.slug}`}>
              Explore case study <ArrowIcon />
            </a>
            <a className="work-feature-live" href={project.url} target="_blank" rel="noopener noreferrer">
              Visit live project <ArrowIcon diagonal />
            </a>
          </div>
          <p className="work-feature-footnote">REAL PRODUCT SCREEN / PROVIDED BY PROJECT CREATOR</p>
        </div>
        <a className="work-feature-visual" href={`/work/${project.slug}`} aria-label={`View ${project.title} case study`}>
          <div className="work-feature-glow" aria-hidden="true" />
          <BrowserFrame
            src={project.screenshot}
            alt={project.alt}
            hostname={new URL(project.url).hostname}
            className="work-feature-frame"
            sizes="(max-width: 900px) 94vw, 720px"
          />
          <span className="work-preview-action" aria-hidden="true">OPEN CASE STUDY <ArrowIcon diagonal /></span>
        </a>
      </article>
    </div>
  );
}
