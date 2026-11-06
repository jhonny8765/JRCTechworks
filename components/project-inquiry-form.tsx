"use client";

import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
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

  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get("service");
    if (requestedService && serviceNames.some((option) => option === requestedService)) {
      setService(requestedService);
    }
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

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = `Project inquiry — ${service} | JRC Techworks`;
    const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(briefText())}`;
    setFeedback("Your email app should open with your project brief. Please review it and press Send there; this website has not sent a message.");
    window.location.href = mailto;
  }

  async function copyBrief(event: MouseEvent<HTMLButtonElement>) {
    if (!event.currentTarget.form?.reportValidity()) return;

    try {
      await navigator.clipboard.writeText(
        `To: ${contactEmail}\nSubject: Project inquiry — ${service} | JRC Techworks\n\n${briefText()}`,
      );
      setFeedback("Project brief copied. Paste it into an email or message and send it to us.");
    } catch {
      setFeedback(`Copy isn't available in this browser. You can still use the email button or write to ${contactEmail}.`);
    }
  }

  return (
    <div className="inquiry-card">
      <div className="inquiry-heading">
        <span className="inquiry-heading-label"><span aria-hidden="true" className="contact-console-light" /> PROJECT BRIEF</span>
        <span className="inquiry-heading-step">01 / TELL US</span>
      </div>
      <form className="inquiry-form" onSubmit={prepareEmail}>
        <p className="inquiry-intro">A few details help us start the right conversation.</p>
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
          <button className="button primary-button inquiry-submit" type="submit">Open email draft <ArrowIcon diagonal /></button>
          <button className="inquiry-copy" type="button" onClick={copyBrief}>Copy brief instead</button>
        </div>
        <p className="inquiry-privacy">No account needed. Your details stay in this browser until you choose to send them through your email app.</p>
        <p className="inquiry-feedback" role="status" aria-live="polite">{feedback}</p>
      </form>
    </div>
  );
}
