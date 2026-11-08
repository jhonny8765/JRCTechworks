"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const greeting: ChatMessage = {
  role: "assistant",
  content: "Hi! 👋 I'm the JRC Techworks assistant. May business problem ka bang gustong gawing mas simple? Ask me about websites, POS, inventory, apps, or automation. No pressure!",
};
const MAX_QUESTIONS = 7;
const leadEmail = "jhonreyc2002@gmail.com";

export default function AssistantChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([greeting]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");
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

  const transcript = messages.map((message) => `${message.role === "user" ? "Visitor" : "JRC assistant"}: ${message.content}`).join("\n\n");
  const emailLink = `mailto:${leadEmail}?subject=${encodeURIComponent("Project inquiry from JRC website chat")}&body=${encodeURIComponent(`Hello JRC Techworks,\n\nHere's my chat and project inquiry:\n\n${transcript}\n\nPlease contact me about a quote.\n\nMy name: \nPreferred contact: `)}`;

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
          <p>Send your chat to JRC. The admin will review your details, answer follow-up questions, and give a price quote. This opens an email draft for you to send.</p>
          <a className="jrc-chat__send" href={emailLink}>Email JRC my inquiry ↗</a>
          <button type="button" className="jrc-chat__secondary" onClick={() => { setMessages([greeting]); setDraft(""); setFinished(false); setError(""); }}>Start new chat</button>
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
