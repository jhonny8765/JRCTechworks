"use client";

import { useEffect, useState } from "react";

const scenes = [
  { id: "top", number: "01", label: "Home" },
  { id: "work", number: "02", label: "Work" },
  { id: "services", number: "03", label: "Services" },
  { id: "about", number: "04", label: "Studio" },
  { id: "contact", number: "05", label: "Contact" },
] as const;

export default function ScrollExperience() {
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    const sections = scenes
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];

    const revealObserver = !reducedMotion && "IntersectionObserver" in window
      ? new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.08, rootMargin: "0px 0px -3% 0px" })
      : null;

    if (revealObserver) {
      reveals.forEach((element) => revealObserver.observe(element));
      document.documentElement.classList.add("motion-enabled");
    }

    let scheduled = false;
    const updateActive = () => {
      scheduled = false;
      const targetY = window.innerHeight * 0.45;
      const closest = sections.reduce<{ id: string; distance: number } | null>((best, section) => {
        const rect = section.getBoundingClientRect();
        const visiblePoint = Math.max(rect.top, Math.min(targetY, rect.bottom));
        const distance = Math.abs(visiblePoint - targetY);
        return !best || distance < best.distance ? { id: section.id, distance } : best;
      }, null);
      if (closest) setActive(closest.id);
    };

    const onScroll = () => {
      if (!scheduled) {
        scheduled = true;
        window.requestAnimationFrame(updateActive);
      }
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      revealObserver?.disconnect();
      document.documentElement.classList.remove("motion-enabled");
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav className="scene-rail" aria-label="Page sections">
      <span className="scene-rail-caption">EXPLORE / 05</span>
      {scenes.map((scene) => (
        <a
          href={`#${scene.id}`}
          key={scene.id}
          aria-label={`Go to ${scene.label}`}
          aria-current={active === scene.id ? "location" : undefined}
          className={active === scene.id ? "is-current" : ""}
        >
          <span className="scene-rail-index">{scene.number}</span>
          <span className="scene-rail-bar" aria-hidden="true" />
          <span className="scene-rail-name">{scene.label}</span>
        </a>
      ))}
      <span className="scene-rail-end">JRC / TECHWORKS</span>
    </nav>
  );
}
