"use client";

import { useEffect, useRef, useState } from "react";

const scenes = [
  { id: "top", number: "01", label: "Home" },
  { id: "work", number: "02", label: "Work" },
  { id: "services", number: "03", label: "Services" },
  { id: "about", number: "04", label: "Studio" },
  { id: "arcade", number: "05", label: "Arcade" },
  { id: "rescue", number: "06", label: "System Rescue" },
  { id: "contact", number: "07", label: "Contact" },
] as const;

const lastIndex = scenes.length - 1;
const TRANSITION_DURATION = 750;

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
  const activeRef = useRef(0);
  const motionRef = useRef(true);

  useEffect(() => {
    const shellElement = document.querySelector<HTMLElement>(".story-shell");
    const sections = scenes.map(({ id }) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section));
    if (!shellElement || sections.length !== scenes.length) return;
    const shell: HTMLElement = shellElement;

    // Phones use the browser's native page scroll. The desktop presentation
    // intentionally locks the document and moves slides, but that makes a
    // tall phone scene difficult to read, reach, or navigate with touch.
    if (window.matchMedia("(max-width: 900px)").matches) {
      let scrollFrame: number | null = null;

      const updateVisibleScene = () => {
        scrollFrame = null;
        const readingLine = Math.min(220, Math.max(105, window.innerHeight * 0.32));
        let visibleIndex = 0;
        sections.forEach((section, index) => {
          if (section.getBoundingClientRect().top <= readingLine) visibleIndex = index;
        });

        if (visibleIndex !== activeRef.current || !shell.dataset.currentScene) {
          activeRef.current = visibleIndex;
          setActiveIndex(visibleIndex);
          shell.dataset.currentScene = scenes[visibleIndex].id;
          window.dispatchEvent(new CustomEvent("jrc:scenechange", { detail: scenes[visibleIndex].id }));
        }
      };

      const scheduleUpdate = () => {
        if (scrollFrame === null) scrollFrame = window.requestAnimationFrame(updateVisibleScene);
      };

      // Reveal each mobile section as it enters the viewport. Keep natural
      // scrolling and all interactive controls untouched; if the API or motion
      // preference disallows it, content remains visible without animation.
      const revealTargets = Array.from(shell.querySelectorAll<HTMLElement>("[data-reveal]"));
      let revealObserver: IntersectionObserver | null = null;
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
        shell.classList.add("motion-enabled");
        revealObserver = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const element = entry.target as HTMLElement;
            element.dataset.motionVisible = "true";
            revealObserver?.unobserve(element);
          }
        }, { rootMargin: "0px 0px 14% 0px", threshold: 0.01 });
        revealTargets.forEach((element) => revealObserver?.observe(element));
      }

      // Native links, scrolling, history, and form focus remain untouched.
      // No inert slides and no wheel/touch/key interception on narrow screens.
      window.addEventListener("scroll", scheduleUpdate, { passive: true });
      window.addEventListener("resize", scheduleUpdate);
      window.addEventListener("hashchange", scheduleUpdate);
      scheduleUpdate();

      return () => {
        if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
        window.removeEventListener("scroll", scheduleUpdate);
        window.removeEventListener("resize", scheduleUpdate);
        window.removeEventListener("hashchange", scheduleUpdate);
        revealObserver?.disconnect();
        shell.classList.remove("motion-enabled");
        revealTargets.forEach((element) => delete element.dataset.motionVisible);
        delete shell.dataset.currentScene;
      };
    }

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Follow the visitor's system accessibility preference. The removed
    // floating control can no longer accidentally disable the experience.
    motionRef.current = !reducedMotion;
    shell.classList.toggle("motion-disabled", reducedMotion);
    let lockedUntil = 0;
    let lastWheelAt = 0;
    let wheelConsumed = false;
    let touchStart: { x: number; y: number; scrollTop: number; target: EventTarget | null; sceneIndex: number } | null = null;
    let finishTimer: number | null = null;
    let exitingIndex: number | null = null;
    let queuedNavigation: { index: number; method: "push" | "replace" | "none" } | null = null;

    function clearTransition(runQueued = true) {
      if (finishTimer !== null) window.clearTimeout(finishTimer);
      finishTimer = null;
      if (exitingIndex !== null) {
        const previous = sections[exitingIndex];
        previous.dataset.slideState = exitingIndex < activeRef.current ? "before" : "after";
        previous.scrollTop = 0;
        exitingIndex = null;
      }
      delete shell.dataset.transitioning;
      if (runQueued && queuedNavigation) {
        const pending = queuedNavigation;
        queuedNavigation = null;
        setScene(pending.index, pending.method);
      }
    }

    function setScene(index: number, method: "push" | "replace" | "none" = "replace") {
      const next = Math.max(0, Math.min(lastIndex, index));
      const wasReady = shell.classList.contains("presentation-ready");
      // Prevent focus or anchor navigation from shifting the clipped shell.
      if (shell.scrollTop !== 0) shell.scrollTop = 0;
      if (activeRef.current === next && wasReady) return;
      if (exitingIndex !== null) {
        // Queue the final destination while a transition is in flight; this
        // avoids interrupting animations and flashing through other slides.
        queuedNavigation = { index: next, method };
        return;
      }
      const previous = activeRef.current;
      const animate = wasReady && motionRef.current && previous !== next;

      activeRef.current = next;
      setActiveIndex(next);

      sections.forEach((section, sectionIndex) => {
        const isActive = sectionIndex === next;
        // Every slide is positioned just above or below the viewport. Only
        // the old and new slides animate; intermediate slides stay hidden,
        // even when a header link jumps from Home directly to Contact.
        section.dataset.slideState = isActive ? "active" :
          animate && sectionIndex === previous ? (next > previous ? "exit-before" : "exit-after") :
          sectionIndex < next ? "before" : "after";
        section.inert = !isActive;
        section.setAttribute("aria-hidden", String(!isActive));
        // Don't jump a visible departing scene back to the top mid-animation.
        if (!isActive && !(animate && sectionIndex === previous)) section.scrollTop = 0;
      });

      shell.dataset.currentScene = scenes[next].id;
      window.dispatchEvent(new CustomEvent("jrc:scenechange", { detail: scenes[next].id }));

      if (animate) {
        exitingIndex = previous;
        shell.dataset.transitioning = next > previous ? "forward" : "backward";
        finishTimer = window.setTimeout(() => clearTransition(), TRANSITION_DURATION + 90);
      }

      if (method !== "none") {
        const destination = `${window.location.pathname}${window.location.search}#${scenes[next].id}`;
        window.history[method === "push" ? "pushState" : "replaceState"](null, "", destination);
      }
    }

    setScene(indexFromHash(window.location.hash), "none");
    window.scrollTo(0, 0);
    shell.classList.add("presentation-ready");

    // A direct link from a case study to the brief should land on the
    // actual form, including on short mobile viewports.
    if (window.location.hash === "#project-brief") {
      window.requestAnimationFrame(() => {
        const target = document.getElementById("project-brief");
        const section = sections[lastIndex];
        if (!target) return;
        const position = target.getBoundingClientRect().top - section.getBoundingClientRect().top + section.scrollTop - 18;
        section.scrollTop = Math.max(0, position);
        document.getElementById("inquiry-name")?.focus({ preventScroll: true });
      });
    }

    function onWheel(event: WheelEvent) {
      if (event.ctrlKey || event.defaultPrevented) return;

      // Scrolling inside an open selection or text area should not switch slides.
      if (event.target instanceof Element && event.target.closest("select, textarea, [contenteditable='true']")) return;

      // Trackpads can emit dozens of wheel events while two full-screen scenes
      // are moving. Avoid repeated layout/style reads until the move settles.
      const now = performance.now();
      if (exitingIndex !== null || now < lockedUntil) {
        event.preventDefault();
        lastWheelAt = now;
        return;
      }

      const current = sections[activeRef.current];
      const direction = Math.sign(event.deltaY);
      if (!direction) return;
      if (canScrollWithinScene(event.target, current, direction)) return;

      // One wheel or trackpad gesture = one scene. Momentum cannot skip slides.
      event.preventDefault();
      if (now - lastWheelAt > 340) wheelConsumed = false;
      lastWheelAt = now;

      if (wheelConsumed || now < lockedUntil || exitingIndex !== null || Math.abs(event.deltaY) < 5) return;
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
        " ": activeRef.current + (event.shiftKey ? -1 : 1),
        Home: 0,
        End: lastIndex,
      }[event.key];

      if (next === undefined) return;
      event.preventDefault();
      // On short screens a scene can have its own scrollable content. Read
      // that content first, and only advance the presentation at its edge.
      if (!["Home", "End"].includes(event.key)) {
        const current = sections[activeRef.current];
        const direction = next > activeRef.current ? 1 : -1;
        if (canScrollWithinScene(current, current, direction)) {
          const step = event.key === "ArrowDown" || event.key === "ArrowUp"
            ? 100 : current.clientHeight * 0.8;
          current.scrollBy({ top: direction * step, behavior: motionRef.current ? "smooth" : "instant" });
          return;
        }
      }
      setScene(next);
    }

    function onTouchStart(event: TouchEvent) {
      touchStart = null;
      if (event.touches.length !== 1 || !(event.target instanceof Node)) return;
      const scene = sections[activeRef.current];
      // Swipes on the fixed header, open menu, or browser chrome are not
      // presentation gestures. The gesture must begin inside the live scene.
      if (!scene.contains(event.target)) return;
      touchStart = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
        scrollTop: scene.scrollTop,
        target: event.target,
        sceneIndex: activeRef.current,
      };
    }

    function onTouchEnd(event: TouchEvent) {
      const started = touchStart;
      touchStart = null;
      if (!started || !event.changedTouches.length || started.sceneIndex !== activeRef.current) return;
      const distance = started.y - event.changedTouches[0].clientY;
      const horizontalDistance = started.x - event.changedTouches[0].clientX;
      if (Math.abs(distance) < 70 || Math.abs(distance) < Math.abs(horizontalDistance) * 1.3) return;
      // Anchors may be large interactive previews. A deliberate swipe over a
      // preview should still advance the presentation; a tap still opens it.
      // Keep form controls and tab buttons reserved for their own gestures.
      const touchControl = started.target instanceof Element && started.target.closest(
        "input, textarea, select, button, [role='tab'], [contenteditable='true']",
      );
      if (touchControl || shell.dataset.transitioning) return;

      const direction = Math.sign(distance);
      const current = sections[activeRef.current];
      // If this gesture already scrolled long mobile scene content, don't
      // also advance to another slide when the finger lifts at the edge.
      if (Math.abs(current.scrollTop - started.scrollTop) > 2) return;
      if (canScrollWithinScene(started.target, current, direction)) return;
      setScene(activeRef.current + direction);
    }

    function onTouchCancel() {
      touchStart = null;
    }

    function onAnchorClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link) return;

      const href = new URL(link.href, window.location.href);
      if (href.origin !== window.location.origin || href.pathname !== window.location.pathname || href.search !== window.location.search || !href.hash) return;

      const id = decodeURIComponent(href.hash.slice(1));
      if (id === "main-content") {
        event.preventDefault();
        document.getElementById("main-content")?.focus({ preventScroll: true });
        return;
      }
      const target = document.getElementById(id);
      const section = target?.closest<HTMLElement>(".story-scene");
      if (!section) return;

      event.preventDefault();
      const index = scenes.findIndex((scene) => scene.id === section.id);
      if (index < 0) return;
      setScene(index, "push");

      // Deep links to the form can move within the final scene if needed.
      if (target && target !== section) {
        const deepLink = `${window.location.pathname}${window.location.search}#${id}`;
        window.history.replaceState(null, "", deepLink);
        const focusTargetWhenReady = () => {
          if (activeRef.current !== index || exitingIndex !== null) {
            window.setTimeout(focusTargetWhenReady, 100);
            return;
          }
          const position = target.getBoundingClientRect().top - section.getBoundingClientRect().top + section.scrollTop - 22;
          section.scrollTo({ top: Math.max(0, position), behavior: "smooth" });
          if (id === "project-brief") document.getElementById("inquiry-name")?.focus({ preventScroll: true });
        };
        window.setTimeout(focusTargetWhenReady, 100);
      }
    }

    function onHistoryChange() {
      setScene(indexFromHash(window.location.hash), "none");
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchCancel);
    document.addEventListener("click", onAnchorClick, true);
    window.addEventListener("popstate", onHistoryChange);
    window.addEventListener("hashchange", onHistoryChange);

    return () => {
      window.history.scrollRestoration = previousRestoration;
      queuedNavigation = null;
      clearTransition(false);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchCancel);
      document.removeEventListener("click", onAnchorClick, true);
      window.removeEventListener("popstate", onHistoryChange);
      window.removeEventListener("hashchange", onHistoryChange);
      shell.classList.remove("presentation-ready");
      shell.classList.remove("motion-disabled");
      delete shell.dataset.currentScene;
      sections.forEach((section) => {
        section.inert = false;
        section.removeAttribute("aria-hidden");
        delete section.dataset.slideState;
      });
    };
  }, []);

  return (
    <div className="story-header-progress" role="progressbar" aria-label="Presentation progress" aria-valuemin={1} aria-valuemax={scenes.length} aria-valuenow={activeIndex + 1}>
      <span style={{ transform: `scaleX(${(activeIndex + 1) / scenes.length})` }} />
    </div>
  );
}
