"use client";

import { useEffect, useState } from "react";
import { contactEmail } from "@/lib/contact";

export default function CopyEmailButton() {
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 4500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      setStatus("Email address copied. Paste it into your preferred email app.");
    } catch {
      setCopied(false);
      setStatus(`Please select and copy the address: ${contactEmail}`);
    }
  }

  return (
    <div className="contact-email-tools">
      <button type="button" className={"contact-copy-email" + (copied ? " is-copied" : "")} onClick={copyEmail}>
        {copied ? "✓ Email copied" : "Copy email address"}
      </button>
      <span className="contact-email-feedback" role="status" aria-live="polite">{status}</span>
    </div>
  );
}
