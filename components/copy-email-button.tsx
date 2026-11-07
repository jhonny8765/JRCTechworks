"use client";

import { useState } from "react";
import { contactEmail } from "@/lib/contact";

export default function CopyEmailButton() {
  const [status, setStatus] = useState("");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setStatus("Email address copied. Paste it into your preferred email app.");
    } catch {
      setStatus(`Please select and copy the address: ${contactEmail}`);
    }
  }

  return (
    <div className="contact-email-tools">
      <button type="button" className="contact-copy-email" onClick={copyEmail}>
        Copy email address
      </button>
      <span className="contact-email-feedback" role="status" aria-live="polite">{status}</span>
    </div>
  );
}
