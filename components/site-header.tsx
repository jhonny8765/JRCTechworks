"use client";

import { useState } from "react";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Our work", href: "#work" },
  { label: "Approach", href: "#approach" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a
          href="#top"
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
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </nav>

        <a
          className="header-contact"
          href="mailto:jhonreyc2001@gmail.com?subject=Project%20inquiry%20for%20JRC%20Techworks"
        >
          Let's talk
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <button
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
        inert={!menuOpen}
      >
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
        ))}
        <a
          href="mailto:jhonreyc2001@gmail.com?subject=Project%20inquiry%20for%20JRC%20Techworks"
          onClick={() => setMenuOpen(false)}
        >Start a project</a>
      </nav>
    </header>
  );
}
