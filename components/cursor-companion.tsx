"use client";

import { useEffect, useRef } from "react";

/** A lightweight, decorative companion that trails desktop pointers without blocking UI. */
export default function CursorCompanion() {
  const buddyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const buddy = buddyRef.current;
    if (!buddy) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const size = { width: 112, height: 138 };
    let frame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let previousX = 0;
    let hasPointer = false;

    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(max, value));

    const follow = () => {
      frame = 0;
      currentX += (targetX - currentX) * 0.13;
      currentY += (targetY - currentY) * 0.13;
      const tilt = clamp((currentX - previousX) * 0.65, -12, 12);
      previousX = currentX;
      buddy.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${tilt}deg)`;

      if (Math.abs(targetX - currentX) > 0.3 || Math.abs(targetY - currentY) > 0.3 || Math.abs(tilt) > 0.3) {
        frame = window.requestAnimationFrame(follow);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !finePointer.matches || reducedMotion.matches) return;
      // Swap sides near the right/bottom edge to keep the companion in view.
      const offsetX = event.clientX > window.innerWidth - 165 ? -size.width - 20 : 32;
      const offsetY = event.clientY > window.innerHeight - 175 ? -size.height - 16 : 20;
      targetX = clamp(event.clientX + offsetX, 8, window.innerWidth - size.width - 8);
      targetY = clamp(event.clientY + offsetY, 8, window.innerHeight - size.height - 8);

      const lookX = clamp((event.clientX - (currentX + size.width / 2)) / 24, -4, 4);
      const lookY = clamp((event.clientY - (currentY + 54)) / 30, -3, 3);
      buddy.style.setProperty("--buddy-look-x", `${lookX}px`);
      buddy.style.setProperty("--buddy-look-y", `${lookY}px`);

      if (!hasPointer) {
        hasPointer = true;
        currentX = targetX;
        currentY = targetY;
        previousX = targetX;
        buddy.classList.add("is-visible");
      }
      if (!frame) frame = window.requestAnimationFrame(follow);
    };

    const hide = () => buddy.classList.remove("is-visible");
    const onMotionChange = () => {
      if (!finePointer.matches || reducedMotion.matches) {
        hide();
        window.cancelAnimationFrame(frame);
        frame = 0;
        hasPointer = false;
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", hide);
    document.addEventListener("pointerleave", hide);
    finePointer.addEventListener("change", onMotionChange);
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", hide);
      document.removeEventListener("pointerleave", hide);
      finePointer.removeEventListener("change", onMotionChange);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div className="cursor-companion" ref={buddyRef} aria-hidden="true">
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
          <circle cx="56" cy="10" r="6" fill="#57E9F7" stroke="#B7FFFF" strokeWidth="2" />
          <path d="M23 95C12 96 10 88 11 82" stroke="url(#buddy-shell)" strokeWidth="12" strokeLinecap="round" />
          <path d="M89 94C104 91 102 78 99 73" stroke="url(#buddy-shell)" strokeWidth="12" strokeLinecap="round" />
          <circle cx="100" cy="69" r="8" fill="#79DBFA" stroke="#C9FCFF" strokeWidth="2" />
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
          <path d="M39 123V129M73 123V129" stroke="#67C4F7" strokeWidth="8" strokeLinecap="round" />
        </svg>
        <span className="cursor-companion__hello">HELLO!</span>
      </div>
    </div>
  );
}
