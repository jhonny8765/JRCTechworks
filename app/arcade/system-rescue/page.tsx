import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import RescueGame from "@/components/arcade/rescue-game";
import "./rescue.css";

export const metadata: Metadata = {
  title: "System Rescue | JRC Bot Adventure — JRC Techworks",
  description: "Play System Rescue, the original JRC Bot platform adventure. Save three small businesses, repair broken systems, and earn a place on the leaderboard.",
  alternates: { canonical: "/arcade/system-rescue" },
};

export default function SystemRescuePage() {
  return <div className="site-shell rescue-shell editorial-inner"><SiteHeader /><main className="rescue-main" id="main-content" tabIndex={-1}>
    <div className="rescue-aura" aria-hidden="true" />
    <section className="container rescue-heading" aria-labelledby="rescue-title">
      <div className="rescue-heading-copy">
        <p className="rescue-eyebrow"><span /> 05 / JRC ARCADE <b>—</b> FEATURED ORIGINAL</p>
        <h1 id="rescue-title">Meet the bot.<br /><em>Save the systems.</em></h1>
        <p>From a broken cashier to an overloaded booking system, three businesses need a hero. That hero is you.</p>
      </div>
      <div className="rescue-heading-aside"><span>JRC GAME STUDIO / 001</span><strong>JRC BOT:<br />SYSTEM RESCUE</strong><small>FREE · BROWSER PLAY · DESKTOP + MOBILE</small></div>
    </section>
    <section className="container rescue-play-section" aria-label="Play JRC Bot: System Rescue"><RescueGame /></section>
    <section className="container rescue-details" aria-label="About System Rescue">
      <div><p className="rescue-eyebrow">THE MISSION / 03 WORLDS</p><h2>Little robot.<br /><em>Big impact.</em></h2><p>Every world is inspired by a real problem local businesses face: payments that stall, stock that goes missing, and bookings that pile up. The game is fun; the thinking behind it is what JRC builds for real.</p><a href="/arcade" className="rescue-text-link">← BACK TO ALL FIVE GAMES</a></div>
      <div className="rescue-world-cards"><article><span>01 / CYAN CIRCUIT</span><h3>The Broken Store</h3><p>Bring the POS registers back online.</p></article><article><span>02 / VIOLET NETWORK</span><h3>Inventory Chaos</h3><p>Restore the warehouse stock records.</p></article><article><span>03 / AMBER GRID</span><h3>The Final Backlog</h3><p>Rescue the booking and automation system.</p></article></div>
    </section>
    <section className="container rescue-ending"><p>THE REAL-WORLD VERSION?</p><h2>We make tech work for people.</h2><a href="/#contact">Talk to the builders <span>↗</span></a></section>
  </main><SiteFooter /></div>;
}
