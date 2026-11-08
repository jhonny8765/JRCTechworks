import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ArcadeExperience from "@/components/arcade/arcade-experience";
import ArrowIcon from "@/components/arrow-icon";
import "./arcade.css";

export const metadata: Metadata = {
  title: "JRC Arcade | Four Free Browser Games — JRC Techworks",
  description: "Play four free, lightweight mini-games: Neon Snake, 2048 Challenge, Memory Match, and Cashier Rush. Built by JRC Techworks in the Philippines.",
  alternates: { canonical: "/arcade" },
};

export default function Arcade() {
  return <div className="site-shell arcade-shell"><SiteHeader /><main id="main-content" className="arcade-main" tabIndex={-1}>
    <div className="arcade-glow" aria-hidden="true" />
    <section className="container arcade-intro" aria-labelledby="arcade-heading"><div className="arcade-intro-content"><p className="arcade-kicker"><span className="arcade-kicker-dot" /> JRC PLAYGROUND <span> / </span> FREE BROWSER GAMES</p><h1 id="arcade-heading">Your next break,<br /><em>beautifully played.</em></h1><p>Four little games made for big breaks. No downloads, no accounts, just a few minutes of fun from the builders at JRC Techworks.</p><div className="arcade-hero-pills"><span>04 GAMES</span><span>00 INSTALLS</span><span>∞ GOOD TIMES</span></div></div><div className="arcade-intro-art" aria-hidden="true"><div className="arcade-glow-ring" /><div className="arcade-orbit-card arcade-orbit-a">2<span>4</span></div><div className="arcade-orbit-card arcade-orbit-b">✦</div><div className="arcade-orbit-center"><small>JRC</small><strong>PLAY<span>.</span></strong><i>PRESS START</i></div><div className="arcade-orbit-card arcade-orbit-c">₱</div><div className="arcade-orbit-card arcade-orbit-d">●</div></div></section>
    <section className="container arcade-collection" aria-labelledby="arcade-collection-heading"><div className="arcade-section-heading"><div><p className="arcade-kicker">01 / GAME SELECT</p><h2 id="arcade-collection-heading">Pick your <em>challenge.</em></h2></div><p>Start with a classic or clock in for an original Filipino cashier challenge.</p></div><ArcadeExperience /></section>
    <section className="container arcade-outro"><div><p className="arcade-kicker">02 / MADE BY BUILDERS</p><h2>Play is just another<br /><em>way to build.</em></h2><p>Enjoyed the arcade? We build practical websites, software, point-of-sale systems, and automations too. Let&apos;s make something useful for your business.</p><a className="button primary-button" href="/#contact">Start a project <ArrowIcon diagonal /></a></div><aside className="arcade-credits"><p className="arcade-credits-title">OPEN SOURCE INSPIRATION</p><p>Our lightweight JRC editions of Snake, 2048, and Memory Match take inspiration from these MIT-licensed browser-game projects. Game logic and visual design here are newly implemented. Cashier Rush is a JRC original.</p><div><a href="https://github.com/patorjk/JavaScript-Snake" target="_blank" rel="noopener noreferrer">Snake inspiration ↗</a><a href="https://github.com/gabrielecirulli/2048" target="_blank" rel="noopener noreferrer">2048 inspiration ↗</a><a href="https://github.com/taniarascia/memory" target="_blank" rel="noopener noreferrer">Memory inspiration ↗</a></div></aside></section>
  </main><SiteFooter /></div>;
}
