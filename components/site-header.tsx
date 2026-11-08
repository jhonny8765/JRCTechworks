"use client";

import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Home", href: "/#top" },
  { label: "Our work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Arcade", href: "/arcade" },
  { label: "Contact", href: "/#contact" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeScene, setActiveScene] = useState("top");
  const headerRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const current = document.querySelector<HTMLElement>(".story-shell")?.dataset.currentScene;
    if (current) setActiveScene(current);

    function onSceneChange(event: Event) {
      if (event instanceof CustomEvent && typeof event.detail === "string") {
        setActiveScene(event.detail);
        setMenuOpen(false);
      }
    }

    function onOutsidePointer(event: PointerEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function onResize() {
      if (window.innerWidth > 1080) setMenuOpen(false);
    }

    window.addEventListener("jrc:scenechange", onSceneChange);
    window.addEventListener("pointerdown", onOutsidePointer);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("jrc:scenechange", onSceneChange);
      window.removeEventListener("pointerdown", onOutsidePointer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <header ref={headerRef} className="site-header" onKeyDown={(event) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    }}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="container header-inner">
        <a
          href="/#top"
          className="brand"
          aria-label="JRC Techworks home"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-mark-bracket">[</span>
            <span className="brand-mark-core">J</span>
            <span className="brand-mark-bracket">]</span>
          </span>
          <span className="brand-name"><strong>JRC</strong> <span>TECHWORKS</span></span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} aria-current={link.href.includes("#") && activeScene === link.href.split("#")[1] ? "location" : undefined}>{link.label}</a>
          ))}
        </nav>

        <a
          className="header-contact"
          href="/#contact"
        >
          Let's talk
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <button
          ref={menuToggleRef}
          className={"menu-toggle" + (menuOpen ? " is-open" : "")}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span /><span />
        </button>
      </div>

      <nav
        id="mobile-navigation"
        className={"mobile-nav" + (menuOpen ? " is-open" : "")}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} aria-current={activeScene === link.href.split("#")[1] ? "location" : undefined} onClick={() => setMenuOpen(false)}>{link.label}</a>
        ))}
        <a
          href="/#contact"
          onClick={() => setMenuOpen(false)}
        >Start a project</a>
      </nav>
    </header>
  );
}
