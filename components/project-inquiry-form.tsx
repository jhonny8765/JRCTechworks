"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import ArrowIcon from "@/components/arrow-icon";
import { contactEmail } from "@/lib/contact";
import { services } from "@/lib/services";

const serviceNames = services.map((service) => service.title);

const timelines = [
  "As soon as possible",
  "Within 1–3 months",
  "Still exploring",
  "Not sure yet",
] as const;

export default function ProjectInquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [timeline, setTimeline] = useState("Not sure yet");
  const [details, setDetails] = useState("");
  const [feedback, setFeedback] = useState("");
  const [manualBrief, setManualBrief] = useState("");
  const [copied, setCopied] = useState(false);
  const [emailOptionsOpen, setEmailOptionsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 4500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get("service");
    if (requestedService && serviceNames.some((option) => option === requestedService)) {
      setService(requestedService);
    }

    function onServiceChange(event: Event) {
      if (event instanceof CustomEvent && typeof event.detail === "string" && serviceNames.some((option) => option === event.detail)) {
        setService(event.detail);
      }
    }

    window.addEventListener("jrc:servicechange", onServiceChange);
    return () => window.removeEventListener("jrc:servicechange", onServiceChange);
  }, []);

  function briefText() {
    return [
      "Hello JRC Techworks,",
      "",
      "I'd like to talk about a project.",
      "",
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `What I need: ${service}`,
      `Timeline: ${timeline}`,
      "",
      "Project overview:",
      details.trim(),
      "",
      "Looking forward to hearing from you!",
    ].join("\n");
  }

  function toggleEmailOptions() {
    if (emailOptionsOpen) {
      setEmailOptionsOpen(false);
      return;
    }

    if (!formRef.current?.reportValidity()) {
      setFeedback("Complete the required fields above to prepare an email draft.");
      return;
    }

    setFeedback("");
    setEmailOptionsOpen(true);
  }

  const emailSubject = encodeURIComponent(`Project inquiry — ${service} | JRC Techworks`);
  const emailBody = encodeURIComponent(briefText());
  const emailTo = encodeURIComponent(contactEmail);
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailTo}&su=${emailSubject}&body=${emailBody}`;
  const outlookHref = `https://outlook.office.com/mail/deeplink/compose?to=${emailTo}&subject=${emailSubject}&body=${emailBody}`;
  const mailAppHref = `mailto:${contactEmail}?subject=${emailSubject}&body=${emailBody}`;

  async function copyBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Keep the confirmation in view instead of leaving an unnecessary
    // expanded provider menu beneath it.
    setEmailOptionsOpen(false);
    const fullBrief = `To: ${contactEmail}\nSubject: Project inquiry — ${service} | JRC Techworks\n\n${briefText()}`;

    try {
      await navigator.clipboard.writeText(fullBrief);
      setCopied(true);
      setManualBrief("");
      setFeedback(`Copied! Paste your brief into an email to ${contactEmail}, then send it. No message has been sent yet.`);
    } catch {
      setCopied(false);
      setManualBrief(fullBrief);
      setFeedback("Automatic copying isn't available here. Select the brief below and copy it manually into an email.");
    }
  }

  return (
    <div className="inquiry-card">
      <div className="inquiry-heading">
        <span className="inquiry-heading-label"><span aria-hidden="true" className="contact-console-light" /> PROJECT BRIEF</span>
        <span className="inquiry-heading-step">01 / TELL US</span>
      </div>
      <form ref={formRef} className="inquiry-form" onSubmit={copyBrief} onChange={() => { setEmailOptionsOpen(false); setCopied(false); }} onInvalid={() => setFeedback("Please complete the required fields above first.")}>
        <p className="inquiry-intro">A few details help us start the right conversation. Copy your brief or choose where to compose your email.</p>
        <div className="inquiry-field-row">
          <div className="inquiry-field">
            <label htmlFor="inquiry-name">Your name <span>*</span></label>
            <input id="inquiry-name" name="name" type="text" autoComplete="name" placeholder="What should we call you?" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required />
          </div>
          <div className="inquiry-field">
            <label htmlFor="inquiry-email">Email address <span>*</span></label>
            <input id="inquiry-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={160} required />
          </div>
        </div>
        <div className="inquiry-field-row">
          <div className="inquiry-field">
            <label htmlFor="inquiry-service">What do you need? <span>*</span></label>
            <select id="inquiry-service" name="service" value={service} onChange={(event) => setService(event.target.value)} required>
              <option value="" disabled>Choose a service</option>
              {serviceNames.map((option) => <option value={option} key={option}>{option}</option>)}
              <option value="Something else">Something else</option>
            </select>
          </div>
          <div className="inquiry-field">
            <label htmlFor="inquiry-timeline">Ideal timing</label>
            <select id="inquiry-timeline" name="timeline" value={timeline} onChange={(event) => setTimeline(event.target.value)}>
              {timelines.map((option) => <option value={option} key={option}>{option}</option>)}
            </select>
          </div>
        </div>
        <div className="inquiry-field">
          <label htmlFor="inquiry-details">Tell us about your idea <span>*</span></label>
          <textarea id="inquiry-details" name="details" placeholder="What problem are you solving? Who would use the website, system, or app?" rows={4} value={details} onChange={(event) => setDetails(event.target.value)} minLength={15} maxLength={800} required />
        </div>
        <div className="inquiry-actions">
          <button className={"button primary-button inquiry-submit" + (copied ? " is-copied" : "")} type="submit">{copied ? "✓ Brief copied" : "Copy project brief"} <ArrowIcon /></button>
          <button className="inquiry-copy" type="button" aria-controls="inquiry-send-options" aria-expanded={emailOptionsOpen} onClick={toggleEmailOptions}>
            {emailOptionsOpen ? "Hide email options" : "Compose email"} <ArrowIcon diagonal />
          </button>
        </div>
        {emailOptionsOpen && (
          <div id="inquiry-send-options" className="inquiry-send-options" role="group" aria-label="Choose where to compose your email">
            <p className="inquiry-send-title">CHOOSE YOUR EMAIL SERVICE</p>
            <div className="inquiry-send-links">
              <a href={gmailHref} target="_blank" rel="noopener noreferrer" onClick={() => setFeedback("Gmail opened in a new tab. Review your draft and press Send there. You may need to sign in.")}>Gmail (web) <ArrowIcon diagonal /></a>
              <a href={outlookHref} target="_blank" rel="noopener noreferrer" onClick={() => setFeedback("Outlook opened in a new tab. Review your draft and press Send there. You may need to sign in.")}>Outlook (web) <ArrowIcon diagonal /></a>
              <a href={mailAppHref} onClick={() => setFeedback("This option needs an email app configured on your device. If nothing opens, try Gmail or Outlook, or copy your brief.")}>Installed mail app <ArrowIcon diagonal /></a>
            </div>
            <p className="inquiry-send-help">Webmail opens a new tab with your details filled in. Nothing is sent until you review and press Send.</p>
          </div>
        )}
        <p className="inquiry-privacy">No account needed. This form prepares a brief; it does not send messages automatically.</p>
        <p className="inquiry-feedback" role="status" aria-live="polite">{feedback}</p>
        {manualBrief && <textarea className="inquiry-manual-brief" aria-label="Your project brief for manual copying" readOnly value={manualBrief} rows={5} onFocus={(event) => event.currentTarget.select()} />}
      </form>
    </div>
  );
}
