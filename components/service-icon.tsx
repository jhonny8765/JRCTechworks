import type { services } from "@/lib/services";

type IconName = (typeof services)[number]["icon"];

export default function ServiceIcon({ name }: { name: IconName }) {
  const common = { stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (name) {
    case "code":
      return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...common}><path d="m11.5 9-6.5 7 6.5 7M20.5 9l6.5 7-6.5 7M18.5 6l-5 20" /></svg>;
    case "globe":
      return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...common}><circle cx="16" cy="16" r="11.5" /><path d="M4.5 16h23M16 4.5c-4 3.3-6 7.2-6 11.5s2 8.2 6 11.5M16 4.5c4 3.3 6 7.2 6 11.5s-2 8.2-6 11.5" /></svg>;
    case "terminal":
      return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...common}><rect x="4.5" y="6.5" width="23" height="19" rx="3" /><path d="m9 12 4 4-4 4M16 21h7" /></svg>;
    case "boxes":
      return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...common}><path d="m16 3.5 10 5.5v12L16 27l-10-6V9L16 3.5Z"/><path d="M6 9l10 6 10-6M16 15v12M11 6.2l10 6" /></svg>;
    case "workflow":
      return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...common}><rect x="4" y="5" width="9" height="8" rx="2"/><rect x="19" y="19" width="9" height="8" rx="2"/><path d="M13 9h6a5 5 0 0 1 5 5v5M19 23h-6a5 5 0 0 1-5-5v-5M20.5 16l3.5 3 3.5-3"/></svg>;
    case "mobile":
      return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...common}><rect x="9" y="3.5" width="14" height="25" rx="3"/><path d="M13 7h6M15 24.5h2" /></svg>;
  }
}
