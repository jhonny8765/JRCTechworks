"use client";

import { useEffect, useRef, useState } from "react";
import { generateCashQuestion, pesos, type CashQuestion } from "@/lib/arcade/cashier";
import { useBestScore } from "./use-best-score";

type Phase = "ready" | "playing" | "over";
type Feedback = { choice: number; correct: boolean } | null;

export default function CashierGame() {
  const [question, setQuestion] = useState<CashQuestion>(() => generateCashQuestion());
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(60);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [served, setServed] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const advance = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { best, record } = useBestScore("cashier");

  useEffect(() => { record(score); }, [score, record]);
  useEffect(() => {
    if (phase !== "playing") return;
    const timer = window.setInterval(() => setSeconds((remaining) => Math.max(0, remaining - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [phase]);
  useEffect(() => { if (seconds === 0 && phase === "playing") setPhase("over"); }, [seconds, phase]);
  useEffect(() => () => { if (advance.current) clearTimeout(advance.current); }, []);

  function start() {
    if (advance.current) clearTimeout(advance.current);
    advance.current = null;
    setQuestion(generateCashQuestion());
    setScore(0);
    setSeconds(60);
    setLives(3);
    setStreak(0);
    setServed(0);
    setFeedback(null);
    setPhase("playing");
  }

  function answer(choice: number) {
    if (phase !== "playing" || feedback) return;
    const correct = choice === question.change;
    const nextLives = lives - (correct ? 0 : 1);
    setFeedback({ choice, correct });
    if (correct) { setScore((current) => current + 100 + streak * 20); setStreak((current) => current + 1); setServed((current) => current + 1); }
    else { setLives(nextLives); setStreak(0); }
    advance.current = setTimeout(() => {
      if (nextLives <= 0) setPhase("over");
      else setQuestion(generateCashQuestion());
      setFeedback(null);
      advance.current = null;
    }, 800);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
      if (phase !== "playing" || feedback) return;
      const index = Number(event.key) - 1;
      if (index >= 0 && index < 4) { event.preventDefault(); answer(question.choices[index]); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, feedback, question, lives, streak]);

  return (
    <div className="arcade-game arcade-cashier">
      <div className="arcade-game-stats"><span>SALES <strong>{served}</strong></span><span>SCORE <strong>{score}</strong></span><span>BEST <strong>{best}</strong></span><span>TIME <strong className={seconds < 11 ? "is-urgent" : undefined}>{seconds}s</strong></span><span>LIVES <strong aria-label={`${lives} remaining`}>{"♥".repeat(lives)}{"♡".repeat(3 - lives)}</strong></span></div>
      <div className="arcade-board-wrap">
        <div className="cashier-terminal">
          <div className="cashier-terminal-bar"><span><i /> JRC MINI POS</span><span>TRANSACTION {String(served + 1).padStart(2, "0")}</span></div>
          <div className="cashier-receipt"><div className="cashier-receipt-title"><span>JRC TECHWORKS</span><span>OFFICIAL GAME RECEIPT</span></div><h3>Next customer, please.</h3>{question.items.map((item) => <div className="cashier-item" key={item.name}><span>{item.quantity}× {item.name}</span><strong>{pesos(item.quantity * item.price)}</strong></div>)}<div className="cashier-total"><span>TOTAL DUE</span><strong>{pesos(question.total)}</strong></div><div className="cashier-paid"><span>CUSTOMER PAID</span><strong>{pesos(question.tendered)}</strong></div></div>
          <div className="cashier-question"><p>MAGKANO ANG SUKLI?</p><h3>Give the correct change.</h3><div className="cashier-options">{question.choices.map((choice, index) => <button type="button" key={choice} disabled={phase !== "playing" || feedback !== null} className={(feedback?.choice === choice ? feedback.correct ? "is-correct" : "is-wrong" : "") + (feedback && choice === question.change ? " is-answer" : "")} onClick={() => answer(choice)}><small>{index + 1}</small>{pesos(choice)}</button>)}</div><p className={`cashier-feedback${feedback?.correct ? " is-correct" : ""}`} aria-live="polite">{feedback ? feedback.correct ? "+ Great job! Tamang sukli." : `Oops! Correct change: ${pesos(question.change)}` : "Choose the correct amount to earn points."}</p></div>
        </div>
        {phase !== "playing" && <div className="arcade-game-overlay"><span className="arcade-overlay-mark" aria-hidden="true">₱</span><h3>{phase === "ready" ? "Welcome to Cashier Rush" : "Shift complete!"}</h3><p>{phase === "ready" ? "Solve quick peso-change questions in 60 seconds. Three mistakes and your shift ends." : `You served ${served} customers and earned ${score} points. Nice shift!`}</p><button type="button" className="arcade-action" onClick={start}>{phase === "ready" ? "Start your shift" : "New shift"} <span aria-hidden="true">↗</span></button></div>}
      </div>
      <div className="arcade-controls-row"><p className="arcade-start-hint">Get a streak for bonus points.</p><button className="arcade-secondary" type="button" onClick={start}>Restart shift</button></div>
      <p className="arcade-instructions">TAP AN AMOUNT OR PRESS 1–4 <span>·</span> PRACTICE MAKING CHANGE IN PESOS</p>
    </div>
  );
}
