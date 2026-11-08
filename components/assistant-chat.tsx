"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { contactEmail } from "@/lib/contact";

type ChatMessage = { role: "user" | "assistant"; content: string };

const greeting: ChatMessage = {
  role: "assistant",
  content: "Hi! 👋 I'm the JRC Techworks assistant. May business problem ka bang gustong gawing mas simple? Ask me about websites, POS, inventory, apps, or automation. No pressure!",
};
const MAX_QUESTIONS = 7;
const leadEmail = contactEmail;

export default function AssistantChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([greeting]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadContact, setLeadContact] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [manualBrief, setManualBrief] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const userTurns = messages.filter((message) => message.role === "user").length;

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, loading, open, finished]);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const finish = () => {
    controllerRef.current?.abort();
    setLoading(false);
    setError("");
    setFinished(true);
  };

  const send = async (raw: string) => {
    const content = raw.trim();
    if (!content || content.length > 500 || loading || finished || userTurns >= MAX_QUESTIONS) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    // A clear goodbye ends the conversation locally. No extra AI credit is used.
    if (/^(done|that's all|that's it|thank you|thanks|salamat|yun lang|iyon lang|okay na|ok na|tapos na|finished|end chat)[.!\s]*$/i.test(content)) {
      setMessages([...nextMessages, { role: "assistant", content: "Salamat sa pag-chat! 😊 Please tap ‘Email JRC my inquiry’ below so the admin can review your details, answer any remaining questions, and prepare your price quote." }]);
      setDraft("");
      setError("");
      setFinished(true);
      return;
    }
    setMessages(nextMessages);
    setDraft("");
    setLoading(true);
    setError("");
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(1) }),
        signal: controller.signal,
        cache: "no-store",
      });
      const data: { reply?: unknown; error?: unknown } = await response.json();
      if (!response.ok || typeof data.reply !== "string") {
        throw new Error(typeof data.error === "string" ? data.error : "Assistant temporarily unavailable.");
      }
      setMessages((current) => [...current, { role: "assistant", content: data.reply as string }]);
      if (userTurns + 1 >= MAX_QUESTIONS) setFinished(true);
    } catch (reason) {
      if (!controller.signal.aborted || !finished) {
        setError(reason instanceof Error && reason.name !== "AbortError" ? reason.message : "That took too long. Please try again or contact JRC.");
      }
    } finally {
      window.clearTimeout(timeout);
      if (controllerRef.current === controller) controllerRef.current = null;
      setLoading(false);
    }
  };

  const sendFromForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void send(draft);
  };

  // Webmail links work without an installed default mail application. Include
  // visitor answers (not every assistant reply) to keep the URL manageable.
  const inquiry = messages.filter((message) => message.role === "user")
    .map((message, index) => `${index + 1}. ${message.content.slice(0, 420)}`).join("\n");
  const emailSubject = "Project inquiry from JRC website chat";
  const emailText = [
    "Hello JRC Techworks,",
    "",
    "I would like to ask for a project quotation or follow-up.",
    `Name: ${leadName.trim() || "Not provided"}`,
    `Preferred contact: ${leadContact.trim() || "Reply to this email"}`,
    "",
    "My questions and project details:",
    inquiry || "I'd like to discuss a project.",
    "",
    "Thank you!",
  ].join("\n");
  const encodedTo = encodeURIComponent(leadEmail);
  const encodedSubject = encodeURIComponent(emailSubject);
  const encodedBody = encodeURIComponent(emailText);
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
  const outlookLink = `https://outlook.office.com/mail/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;

  const copyInquiry = async () => {
    const fullText = `To: ${leadEmail}\nSubject: ${emailSubject}\n\n${emailText}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setManualBrief("");
      setCopyStatus("Copied! Paste into your email or Messenger, then press Send.");
    } catch {
      setManualBrief(fullText);
      setCopyStatus("Copy the prepared message below and paste it into your email.");
    }
  };

  if (!open) return null;

  return (
    <section className="jrc-chat" id="jrc-assistant-chat" role="dialog" aria-label="JRC assistant chat">
      <header className="jrc-chat__header">
        <span className="jrc-chat__badge" aria-hidden="true">✦</span>
        <span className="jrc-chat__heading"><strong>Ask JRC</strong><small>Business ideas, explained simply</small></span>
        <button type="button" className="jrc-chat__close" onClick={onClose} aria-label="Close chat">×</button>
      </header>
      <div className="jrc-chat__messages" aria-live="polite" aria-relevant="additions text">
        {messages.map((message, index) => (
          <p className={`jrc-chat__message jrc-chat__message--${message.role}`} key={`${index}-${message.role}`}>{message.content}</p>
        ))}
        {loading && <p className="jrc-chat__message jrc-chat__message--assistant jrc-chat__thinking">Thinking…</p>}
        <div ref={bottomRef} />
      </div>
      {error && <p className="jrc-chat__error" role="alert">{error}</p>}
      {finished ? (
        <div className="jrc-chat__finish">
          <strong>Salamat! Ready for the next step?</strong>
          <p>Para makapagbigay kami ng quotation, add your contact details. Open a webmail draft and press Send there—the admin will review your inquiry.</p>
          <div className="jrc-chat__lead-fields">
            <label htmlFor="jrc-lead-name">Your name (optional)<input id="jrc-lead-name" type="text" autoComplete="name" maxLength={80} placeholder="Your name" value={leadName} onChange={(event) => setLeadName(event.target.value)} /></label>
            <label htmlFor="jrc-lead-contact">Email or phone (optional)<input id="jrc-lead-contact" type="text" autoComplete="email" maxLength={120} placeholder="Where can we reach you?" value={leadContact} onChange={(event) => setLeadContact(event.target.value)} /></label>
          </div>
          <a className="jrc-chat__send" href={gmailLink} target="_blank" rel="noopener noreferrer" onClick={() => setCopyStatus("Gmail opens in a new tab. Review your message and press Send. You may need to sign in.")}>Open Gmail draft ↗</a>
          <div className="jrc-chat__other-actions">
            <a href={outlookLink} target="_blank" rel="noopener noreferrer" onClick={() => setCopyStatus("Outlook opens in a new tab. Review your message and press Send.")}>Use Outlook ↗</a>
            <button type="button" onClick={() => void copyInquiry()}>Copy inquiry</button>
          </div>
          {copyStatus && <p className="jrc-chat__copy-status" role="status">{copyStatus}</p>}
          {manualBrief && <textarea className="jrc-chat__manual-brief" readOnly aria-label="Prepared inquiry text to copy" value={manualBrief} rows={4} onFocus={(event) => event.target.select()} />}
          <button type="button" className="jrc-chat__secondary" onClick={() => { setMessages([greeting]); setDraft(""); setFinished(false); setError(""); setCopyStatus(""); setManualBrief(""); setLeadName(""); setLeadContact(""); }}>Start new chat</button>
        </div>
      ) : (
        <>
          {userTurns === 0 && (
            <div className="jrc-chat__suggestions">
              {["Website for my business", "POS / inventory system", "Automate repetitive work"].map((suggestion) => (
                <button type="button" key={suggestion} onClick={() => void send(suggestion)} disabled={loading}>{suggestion}</button>
              ))}
            </div>
          )}
          <form className="jrc-chat__form" onSubmit={sendFromForm}>
            <label htmlFor="jrc-chat-input" className="sr-only">Your question</label>
            <textarea id="jrc-chat-input" ref={inputRef} placeholder="Type your question…" rows={2} maxLength={500} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} disabled={loading} />
            <button type="submit" disabled={!draft.trim() || loading} aria-label="Send message">Send ↗</button>
          </form>
          <div className="jrc-chat__footer"><span>{Math.max(0, MAX_QUESTIONS - userTurns)} messages left · Don't share passwords</span><button type="button" onClick={finish}>Finish & contact JRC</button></div>
        </>
      )}
    </section>
  );
}
