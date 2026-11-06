"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import ArrowIcon from "@/components/arrow-icon";

const process = [
  { number: "01", title: "Discover", text: "We listen to the people, goals, and workflows behind the idea." },
  { number: "02", title: "Build", text: "We shape the design and develop working features you can review." },
  { number: "03", title: "Refine", text: "We improve the details that make the final experience useful." },
];

export default function StudioScene() {
  const [view, setView] = useState<"studio" | "process">("studio");

  useEffect(() => {
    if (window.location.hash === "#approach") setView("process");
  }, []);

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = view === "studio" ? "process" : "studio";
    setView(next);
    document.getElementById(next === "studio" ? "studio-tab" : "process-tab")?.focus();
  }

  return (
    <div className="studio-explorer">
      <div className="studio-tabs" role="tablist" aria-label="About JRC Techworks">
        <button type="button" id="studio-tab" role="tab" aria-controls="studio-panel" aria-selected={view === "studio"} tabIndex={view === "studio" ? 0 : -1} className={view === "studio" ? "is-active" : ""} onClick={() => setView("studio")} onKeyDown={handleTabKey}>The studio</button>
        <button type="button" id="process-tab" role="tab" aria-controls="studio-panel" aria-selected={view === "process"} tabIndex={view === "process" ? 0 : -1} className={view === "process" ? "is-active" : ""} onClick={() => setView("process")} onKeyDown={handleTabKey}>How we work</button>
      </div>
      <div className="studio-panel" role="tabpanel" id="studio-panel" aria-labelledby={view === "studio" ? "studio-tab" : "process-tab"} key={view}>
        {view === "studio" ? (
          <div className="studio-story">
            <div className="studio-story-copy">
              <p className="section-label">SMALL TEAM / BIG IDEAS</p>
              <h3>Two builders.<br /><em>One shared vision.</em></h3>
              <p>JRC Techworks is an independent, two-person software studio based in the Philippines. We build websites, software, and business tools around how people actually work.</p>
              <a href="#contact">Get to know us through a project <ArrowIcon diagonal /></a>
            </div>
            <div className="studio-team-card">
              <span className="studio-team-label">THE PEOPLE BEHIND THE BUILD / 02</span>
              <div className="studio-team-monogram" aria-hidden="true"><span>[</span>JRC<span>]</span></div>
              <div className="studio-team-member"><span>01</span><div><strong>Jhon Rey Consolacion</strong><small>Developer &amp; automation builder</small></div></div>
              <div className="studio-team-member"><span>02</span><div><strong>Studio collaborator</strong><small>Second member of JRC Techworks</small></div></div>
            </div>
          </div>
        ) : (
          <div className="studio-process">
            <div>
              <p className="section-label">THE WAY WE BUILD</p>
              <h3>Good technology<br /><em>starts with listening.</em></h3>
              <p>From the first conversation to the final details, we keep the work practical and transparent.</p>
            </div>
            <ol className="studio-process-list">
              {process.map((item) => (
                <li key={item.number}>
                  <span>{item.number}</span>
                  <div><h4>{item.title}</h4><p>{item.text}</p></div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
