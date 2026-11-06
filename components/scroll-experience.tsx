"use client";

import { useEffect, useRef, useState } from "react";

const scenes = [
  { id: "top", number: "01", label: "Home" },
  { id: "work", number: "02", label: "Work" },
  { id: "services", number: "03", label: "Services" },
  { id: "about", number: "04", label: "Studio" },
  { id: "contact", number: "05", label: "Contact" },
] as const;

const lastIndex = scenes.length - 1;
const TRANSITION_DURATION = 1180;
const TRANSITION_EASING = "cubic-bezier(.68, 0, .18, 1)";

function indexFromHash(hash: string): number {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (id === "project-brief") return lastIndex;
  if (id === "approach") return 3;
  return Math.max(0, scenes.findIndex((scene) => scene.id === id));
}

function isInteractive(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(
    target.closest("input, textarea, select, button, a, [role='tab'], [contenteditable='true']"),
  );
}

function canScrollWithinScene(target: EventTarget | null, section: HTMLElement, direction: number): boolean {
  if (!(target instanceof Element)) return false;
  let current: Element | null = target;

  while (current && section.contains(current)) {
    if (current instanceof HTMLElement) {
      const style = window.getComputedStyle(current);
      const isScrollable = /(auto|scroll)/.test(style.overflowY);
      const availableScroll = current.scrollHeight - current.clientHeight;
      if (isScrollable && availableScroll > 4) {
        if (direction > 0 && current.scrollTop < availableScroll - 3) return true;
        if (direction < 0 && current.scrollTop > 3) return true;
      }
    }
    if (current === section) break;
    current = current.parentElement;
  }

  return false;
}

export default function ScrollExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const activeRef = useRef(0);
  const motionRef = useRef(true);
  const navigateRef = useRef<(index: number, method?: "push" | "replace" | "none") => void>(() => {});

  function toggleMotion() {
    const enabled = !motionRef.current;
    motionRef.current = enabled;
    setMotionEnabled(enabled);
    const shell = document.querySelector<HTMLElement>(".story-shell");
    shell?.classList.toggle("motion-disabled", !enabled);
    shell?.classList.toggle("motion-user-enabled", enabled);
    try {
      window.localStorage.setItem("jrc-slide-motion", enabled ? "on" : "off");
    } catch {
      // Storage can be disabled in private browsing; the toggle still works.
    }
  }

  useEffect(() => {
    const shell = document.querySelector<HTMLElement>(".story-shell");
    const sections = scenes.map(({ id }) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section));
    if (!shell || sections.length !== scenes.length) return;

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let storedMotion: string | null = null;
    try {
      storedMotion = window.localStorage.getItem("jrc-slide-motion");
    } catch {
      // Continue with the system preference when storage is unavailable.
    }
    const initialMotion = storedMotion === "on" || (storedMotion !== "off" && !reducedMotion);
    motionRef.current = initialMotion;
    setMotionEnabled(initialMotion);
    shell.classList.toggle("motion-disabled", !initialMotion);
    shell.classList.toggle("motion-user-enabled", storedMotion === "on");
    const supportsKeyframes = sections.every((section) => typeof section.animate === "function");
    shell.classList.toggle("motion-scripted", supportsKeyframes);

    let lockedUntil = 0;
    let lastWheelAt = 0;
    let wheelConsumed = false;
    let touchY: number | null = null;
    let touchTarget: EventTarget | null = null;
    let runningAnimations: Animation[] = [];

    function clearAnimations() {
      const oldAnimations = runningAnimations;
      runningAnimations = [];
      oldAnimations.forEach((animation) => {
        animation.onfinish = null;
        animation.cancel();
      });
      sections.forEach((section) => {
        section.style.removeProperty("visibility");
        section.style.removeProperty("z-index");
      });
      delete shell?.dataset.transitioning;
    }

    function setScene(index: number, method: "push" | "replace" | "none" = "replace") {
      const next = Math.max(0, Math.min(lastIndex, index));
      const wasReady = shell?.classList.contains("presentation-ready");
      if (activeRef.current === next && wasReady) return;
      const previous = activeRef.current;
      clearAnimations();

      activeRef.current = next;
      setActiveIndex(next);

      sections.forEach((section, sectionIndex) => {
        const isActive = sectionIndex === next;
        section.dataset.slideState = isActive ? "active" : sectionIndex < next ? "before" : "after";
        section.inert = !isActive;
        section.setAttribute("aria-hidden", String(!isActive));
        if (!isActive) section.scrollTop = 0;
      });

      shell?.style.setProperty("--active-scene", String(next));

      if (wasReady && motionRef.current && supportsKeyframes && previous !== next) {
        // Real timelines keep both scenes painted for the whole movement. A hidden
        // CSS layer can otherwise appear as an instant flash on some browsers.
        const direction = next > previous ? 1 : -1;
        const outgoing = sections[previous];
        const incoming = sections[next];
        outgoing.style.visibility = "visible";
        outgoing.style.zIndex = "3";
        incoming.style.visibility = "visible";
        incoming.style.zIndex = "4";
        if (shell) shell.dataset.transitioning = direction > 0 ? "forward" : "backward";

        const timing: KeyframeAnimationOptions = {
          duration: TRANSITION_DURATION,
          easing: TRANSITION_EASING,
          fill: "both",
        };
        const enterAnimation = incoming.animate([
          { transform: `translate3d(0, ${direction * 105}%, 0) scale(.988)`, opacity: 0.45 },
          { transform: `translate3d(0, ${direction * 52}%, 0) scale(.994)`, opacity: 1, offset: 0.52 },
          { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
        ], timing);
        const exitAnimation = outgoing.animate([
          { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
          { transform: `translate3d(0, ${direction * -28}%, 0) scale(.965)`, opacity: 0.16 },
        ], timing);

        runningAnimations = [enterAnimation, exitAnimation];
        let finished = 0;
        runningAnimations.forEach((animation) => {
          animation.onfinish = () => {
            finished += 1;
            if (finished === 2) clearAnimations();
          };
        });
      }

      if (method !== "none") {
        const destination = `${window.location.pathname}${window.location.search}#${scenes[next].id}`;
        window.history[method === "push" ? "pushState" : "replaceState"](null, "", destination);
      }
    }

    navigateRef.current = setScene;
    setScene(indexFromHash(window.location.hash), "none");
    window.scrollTo(0, 0);
    shell.classList.add("presentation-ready");

    function onWheel(event: WheelEvent) {
      if (event.ctrlKey || event.defaultPrevented) return;

      const current = sections[activeRef.current];
      const direction = Math.sign(event.deltaY);
      if (!direction) return;
      if (canScrollWithinScene(event.target, current, direction)) return;

      // One wheel or trackpad gesture = one scene. Momentum cannot skip slides.
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheelAt > 340) wheelConsumed = false;
      lastWheelAt = now;

      if (wheelConsumed || now < lockedUntil || runningAnimations.length > 0 || Math.abs(event.deltaY) < 5) return;
      wheelConsumed = true;
      lockedUntil = now + (motionRef.current ? TRANSITION_DURATION + 160 : 400);
      setScene(activeRef.current + direction);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || isInteractive(event.target)) return;
      const next = {
        ArrowDown: activeRef.current + 1,
        PageDown: activeRef.current + 1,
        ArrowUp: activeRef.current - 1,
        PageUp: activeRef.current - 1,
        Home: 0,
        End: lastIndex,
      }[event.key];

      if (next === undefined) return;
      event.preventDefault();
      setScene(next);
    }

    function onTouchStart(event: TouchEvent) {
      if (event.touches.length !== 1) return;
      touchY = event.touches[0].clientY;
      touchTarget = event.target;
    }

    function onTouchEnd(event: TouchEvent) {
      if (touchY === null || !event.changedTouches.length) return;
      const distance = touchY - event.changedTouches[0].clientY;
      touchY = null;
      if (Math.abs(distance) < 65 || isInteractive(touchTarget) || runningAnimations.length > 0) return;

      const direction = Math.sign(distance);
      const current = sections[activeRef.current];
      if (canScrollWithinScene(touchTarget, current, direction)) return;
      setScene(activeRef.current + direction);
    }

    function onAnchorClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link) return;

      const href = new URL(link.href, window.location.href);
      if (href.origin !== window.location.origin || href.pathname !== window.location.pathname || href.search !== window.location.search || !href.hash) return;

      const id = decodeURIComponent(href.hash.slice(1));
      const target = document.getElementById(id);
      const section = target?.closest<HTMLElement>(".story-scene");
      if (!section) return;

      event.preventDefault();
      const index = scenes.findIndex((scene) => scene.id === section.id);
      if (index < 0) return;
      setScene(index, "push");

      // Deep links to the form can move within the final scene if needed.
      if (target && target !== section) {
        window.setTimeout(() => {
          const position = target.getBoundingClientRect().top - section.getBoundingClientRect().top + section.scrollTop - 22;
          section.scrollTo({ top: Math.max(0, position), behavior: "smooth" });
        }, 80);
      }
    }

    function onHistoryChange() {
      setScene(indexFromHash(window.location.hash), "none");
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("click", onAnchorClick, true);
    window.addEventListener("popstate", onHistoryChange);
    window.addEventListener("hashchange", onHistoryChange);

    return () => {
      window.history.scrollRestoration = previousRestoration;
      clearAnimations();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("click", onAnchorClick, true);
      window.removeEventListener("popstate", onHistoryChange);
      window.removeEventListener("hashchange", onHistoryChange);
      shell.classList.remove("presentation-ready");
      shell.classList.remove("motion-scripted", "motion-disabled", "motion-user-enabled");
      shell.style.removeProperty("--active-scene");
      sections.forEach((section) => {
        section.inert = false;
        section.removeAttribute("aria-hidden");
        delete section.dataset.slideState;
      });
    };
  }, []);

  return (
    <>
      <nav className="scene-rail" aria-label="Page sections">
        <span className="scene-rail-caption">EXPLORE / 05</span>
        {scenes.map((scene, index) => (
          <a
            href={`#${scene.id}`}
            key={scene.id}
            aria-label={`Go to ${scene.label}`}
            aria-current={activeIndex === index ? "location" : undefined}
            className={activeIndex === index ? "is-current" : ""}
          >
            <span className="scene-rail-index">{scene.number}</span>
            <span className="scene-rail-bar" aria-hidden="true" />
            <span className="scene-rail-name">{scene.label}</span>
          </a>
        ))}
        <span className="scene-rail-end">JRC / TECHWORKS</span>
      </nav>

      <nav className="scene-controls" aria-label="Slide controls">
        <span className="scene-counter" aria-live="polite">{scenes[activeIndex].number} <span>/ 05</span></span>
        <button
          type="button"
          className="scene-motion-toggle"
          aria-label={motionEnabled ? "Turn slide animations off" : "Turn slide animations on"}
          aria-pressed={motionEnabled}
          onClick={toggleMotion}
        >
          Motion {motionEnabled ? "on" : "off"}
        </button>
        <button type="button" aria-label="Previous scene" disabled={activeIndex === 0} onClick={() => navigateRef.current(activeIndex - 1)}>
          <span aria-hidden="true">↑</span>
        </button>
        <button type="button" aria-label="Next scene" disabled={activeIndex === lastIndex} onClick={() => navigateRef.current(activeIndex + 1)}>
          <span aria-hidden="true">↓</span>
        </button>
      </nav>
    </>
  );
}
