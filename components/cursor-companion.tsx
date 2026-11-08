"use client";

import { useEffect, useRef, useState } from "react";
import AssistantChat from "./assistant-chat";

type Scene = "top" | "work" | "services" | "about" | "arcade" | "contact";

const isScene = (value: string | undefined): value is Scene =>
  value === "top" || value === "work" || value === "services" || value === "about" || value === "arcade" || value === "contact";

/** A stage companion: anchored per scene, animated between scenes, and attentive to the pointer. */
export default function CursorCompanion() {
  const buddyRef = useRef<HTMLButtonElement>(null);
  const [scene, setScene] = useState<Scene>("top");
  const [walking, setWalking] = useState(false);
  const [excited, setExcited] = useState(false);
  const [ready, setReady] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const buddy = buddyRef.current;
    if (!buddy) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let walkTimer = 0;
    let readyFrame = 0;
    let gazeFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let previousLookX = 0;
    let previousLookY = 0;
    const startingScene = document.querySelector<HTMLElement>(".story-shell")?.dataset.currentScene;
    if (isScene(startingScene)) setScene(startingScene);
    readyFrame = window.requestAnimationFrame(() => setReady(true));

    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(max, value));

    const updateGaze = () => {
      gazeFrame = 0;
      if (document.visibilityState === "hidden") return;
      // One layout read per rendered frame at most, even on high-frequency mice.
      const bounds = buddy.getBoundingClientRect();
      const lookX = clamp((pointerX - (bounds.left + 56)) / 34, -4, 4);
      const lookY = clamp((pointerY - (bounds.top + 61)) / 42, -3, 3);
      if (Math.abs(lookX - previousLookX) > 0.12) {
        buddy.style.setProperty("--buddy-look-x", `${lookX.toFixed(2)}px`);
        previousLookX = lookX;
      }
      if (Math.abs(lookY - previousLookY) > 0.12) {
        buddy.style.setProperty("--buddy-look-y", `${lookY.toFixed(2)}px`);
        previousLookY = lookY;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !finePointer.matches || reducedMotion.matches) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!gazeFrame) gazeFrame = window.requestAnimationFrame(updateGaze);
    };

    const onSceneChange = (event: Event) => {
      const next = (event as CustomEvent<string>).detail;
      if (!isScene(next) || next === buddy.dataset.scene) return;
      window.clearTimeout(walkTimer);
      setScene(next);
      setWalking(true);
      setExcited(false);
      walkTimer = window.setTimeout(() => setWalking(false), 800);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("jrc:scenechange", onSceneChange);

    return () => {
      window.clearTimeout(walkTimer);
      window.cancelAnimationFrame(readyFrame);
      window.cancelAnimationFrame(gazeFrame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("jrc:scenechange", onSceneChange);
    };
  }, []);

  return (
    <>
    <button
      type="button"
      className={`cursor-companion${ready ? " is-ready" : ""}${walking ? " is-walking" : ""}${excited ? " is-excited" : ""}`}
      data-scene={scene}
      ref={buddyRef}
      aria-label={chatOpen ? "Close JRC assistant chat" : "Ask JRC assistant a question"}
      aria-expanded={chatOpen}
      aria-controls="jrc-assistant-chat"
      onClick={() => setChatOpen((open) => !open)}
      onMouseEnter={() => setExcited(true)}
      onMouseLeave={() => setExcited(false)}
      onFocus={() => setExcited(true)}
      onBlur={() => setExcited(false)}
    >
      <div className="cursor-companion__float">
        <svg viewBox="0 0 112 138" width="112" height="138" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="buddy-shell" x1="11" y1="22" x2="104" y2="118" gradientUnits="userSpaceOnUse">
              <stop stopColor="#96F4FF" />
              <stop offset="0.48" stopColor="#3CC9F4" />
              <stop offset="1" stopColor="#6467E7" />
            </linearGradient>
            <linearGradient id="buddy-visor" x1="30" y1="39" x2="83" y2="83" gradientUnits="userSpaceOnUse">
              <stop stopColor="#172B4C" />
              <stop offset="1" stopColor="#070F22" />
            </linearGradient>
            <filter id="buddy-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          <ellipse cx="56" cy="131" rx="34" ry="5" fill="#36D9F1" opacity=".25" filter="url(#buddy-glow)" />
          <path d="M56 22V13" stroke="#99F2FF" strokeWidth="5" strokeLinecap="round" />
          <circle className="cursor-companion__antenna" cx="56" cy="10" r="6" fill="#57E9F7" stroke="#B7FFFF" strokeWidth="2" />
          <g className="cursor-companion__arm-left">
            <path d="M23 95C12 96 10 88 11 82" stroke="url(#buddy-shell)" strokeWidth="12" strokeLinecap="round" />
          </g>
          <g className="cursor-companion__arm-right">
            <path d="M89 94C104 91 102 78 99 73" stroke="url(#buddy-shell)" strokeWidth="12" strokeLinecap="round" />
            <circle cx="100" cy="69" r="8" fill="#79DBFA" stroke="#C9FCFF" strokeWidth="2" />
          </g>
          <rect x="26" y="80" width="60" height="46" rx="22" fill="url(#buddy-shell)" stroke="#B3FCFF" strokeWidth="2" />
          <rect x="40" y="98" width="32" height="17" rx="8.5" fill="#071629" opacity=".84" />
          <text x="56" y="109.5" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="850" fontSize="10" fill="#A6FFFF">JRC</text>
          <rect x="10" y="45" width="15" height="26" rx="7" fill="#4777C7" stroke="#9CF4FF" strokeWidth="2" />
          <rect x="87" y="45" width="15" height="26" rx="7" fill="#4777C7" stroke="#9CF4FF" strokeWidth="2" />
          <rect x="17" y="25" width="78" height="70" rx="29" fill="url(#buddy-shell)" stroke="#D2FEFF" strokeWidth="2.3" />
          <path d="M31 32C40 25 63 24 78 32" stroke="#E0FFFF" opacity=".7" strokeWidth="4" strokeLinecap="round" />
          <rect x="26" y="41" width="60" height="41" rx="18" fill="url(#buddy-visor)" stroke="#3CD9F6" strokeWidth="2" />
          <ellipse cx="42" cy="61" rx="10" ry="11" fill="#EDFFFF" />
          <ellipse cx="70" cy="61" rx="10" ry="11" fill="#EDFFFF" />
          <g className="cursor-companion__pupil">
            <circle cx="44" cy="62" r="4.8" fill="#0D315B" />
            <circle cx="72" cy="62" r="4.8" fill="#0D315B" />
            <circle cx="45.5" cy="60" r="1.6" fill="#C9FFFF" />
            <circle cx="73.5" cy="60" r="1.6" fill="#C9FFFF" />
          </g>
          <path d="M50 74Q56 79 62 74" stroke="#6EF3F4" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="29" cy="76" r="3" fill="#FFA2BE" opacity=".82" />
          <circle cx="83" cy="76" r="3" fill="#FFA2BE" opacity=".82" />
          <g className="cursor-companion__foot-left"><path d="M39 123V129" stroke="#67C4F7" strokeWidth="8" strokeLinecap="round" /></g>
          <g className="cursor-companion__foot-right"><path d="M73 123V129" stroke="#67C4F7" strokeWidth="8" strokeLinecap="round" /></g>
        </svg>
        <span className="cursor-companion__hello" aria-hidden="true">
          {chatOpen ? "CHATTING!" : excited ? "ASK ME!" : "ASK ME!"}
        </span>
      </div>
    </button>
    <AssistantChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
