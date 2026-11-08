"use client";

import { useEffect, useRef, useState } from "react";
import { useBestScore } from "./use-best-score";

const symbols = ["💻", "📦", "⚡", "🧾", "🔐", "📈"] as const;
type Phase = "ready" | "playing" | "won";

function deck() {
  const cards = [...symbols, ...symbols];
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const chosen = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[chosen]] = [cards[chosen], cards[index]];
  }
  return cards;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<string[]>(() => deck());
  const [first, setFirst] = useState<number | null>(null);
  const [second, setSecond] = useState<number | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { best, record } = useBestScore("memory");

  useEffect(() => {
    if (phase !== "playing") return;
    const timer = window.setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, [phase]);
  useEffect(() => {
    if (matched.length !== symbols.length || phase !== "playing") return;
    setPhase("won");
    record(Math.max(100, 1600 - moves * 35 - seconds * 4));
  }, [matched, moves, seconds, phase, record]);
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); }, []);

  function reset() {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = null;
    setCards(deck());
    setFirst(null);
    setSecond(null);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setPhase("ready");
  }

  function flip(index: number) {
    if (phase === "won" || second !== null || first === index || matched.includes(cards[index])) return;
    if (phase === "ready") setPhase("playing");
    if (first === null) { setFirst(index); return; }
    setSecond(index);
    setMoves((count) => count + 1);
    if (cards[first] === cards[index]) {
      setMatched((current) => [...current, cards[index]]);
      setFirst(null);
      setSecond(null);
    } else {
      timeout.current = setTimeout(() => { setFirst(null); setSecond(null); timeout.current = null; }, 800);
    }
  }

  return (
    <div className="arcade-game arcade-memory">
      <div className="arcade-game-stats"><span>PAIRS <strong>{matched.length} / 6</strong></span><span>FLIPS <strong>{moves}</strong></span><span>TIME <strong>{seconds}s</strong></span><span>BEST <strong>{best || "—"}</strong></span></div>
      <div className="arcade-board-wrap">
        <div className="memory-board" aria-label="Memory match cards, select two cards to find matching technology icons">
          {cards.map((symbol, index) => {
            const visible = first === index || second === index || matched.includes(symbol);
            const found = matched.includes(symbol);
            return <button type="button" key={index} className={`memory-card${visible ? " is-flipped" : ""}${found ? " is-matched" : ""}`} onClick={() => flip(index)} disabled={found || phase === "won"} aria-label={visible ? `${symbol}, ${found ? "matched" : "revealed"}` : `Hidden card ${index + 1}`}><span className="memory-card-back" aria-hidden="true">J</span><span className="memory-card-face" aria-hidden="true">{symbol}</span></button>;
          })}
        </div>
        {phase === "won" && <div className="arcade-game-overlay"><span className="arcade-overlay-mark" aria-hidden="true">★</span><h3>Perfect match!</h3><p>All six pairs found in {moves} tries and {seconds} seconds. Your final score is {Math.max(100, 1600 - moves * 35 - seconds * 4)}.</p><button type="button" className="arcade-action" onClick={reset}>New shuffle <span aria-hidden="true">↗</span></button></div>}
      </div>
      <div className="arcade-controls-row"><p className="arcade-start-hint">{phase === "ready" ? "Flip a card to start!" : phase === "won" ? "Nice work, sharp memory." : "Find all six matching pairs."}</p><button className="arcade-secondary" type="button" onClick={reset}>Shuffle again</button></div>
      <p className="arcade-instructions">TAP TWO CARDS TO FLIP <span>·</span> MATCH THE TECHNOLOGY ICONS</p>
    </div>
  );
}
