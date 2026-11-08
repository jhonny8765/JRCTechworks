"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const SnakeGame = dynamic(() => import("./snake-game"), { ssr: false, loading: () => <GameLoading /> });
const MergeGame = dynamic(() => import("./merge-game"), { ssr: false, loading: () => <GameLoading /> });
const MemoryGame = dynamic(() => import("./memory-game"), { ssr: false, loading: () => <GameLoading /> });
const CashierGame = dynamic(() => import("./cashier-game"), { ssr: false, loading: () => <GameLoading /> });

type GameId = "snake" | "2048" | "memory" | "cashier";
type GameInfo = { id: GameId; index: string; title: string; tag: string; description: string; how: string; accent: string };

const games: GameInfo[] = [
  { id: "snake", index: "01", title: "Neon Snake", tag: "CLASSIC / REFLEX", description: "The classic chase, rewired for JRC. Eat the glow, keep growing, don't bite your tail.", how: "Arrow keys, WASD, swipes, or on-screen directions", accent: "mint" },
  { id: "2048", index: "02", title: "2048 Challenge", tag: "PUZZLE / STRATEGY", description: "A deceptively simple puzzle. Combine equal numbers and work your way to 2048.", how: "Swipe, use arrow keys, or tap direction buttons", accent: "violet" },
  { id: "memory", index: "03", title: "Memory Match", tag: "PUZZLE / FOCUS", description: "Six pairs. Twelve mystery cards. How quickly can you find every match?", how: "Tap two cards at a time and remember what you saw", accent: "pink" },
  { id: "cashier", index: "04", title: "Cashier Rush", tag: "JRC ORIGINAL / BUSINESS", description: "A fast-paced mini POS shift. Give the right sukli, keep your streak, beat the clock.", how: "Tap the right amount in pesos or press 1–4", accent: "gold" },
];

function GameLoading() { return <div className="arcade-loading" role="status"><span className="arcade-loading-spinner" /> Loading your game...</div>; }

function Cover({ id }: { id: GameId }) {
  if (id === "snake") return <div className="arcade-cover arcade-cover-snake" aria-hidden="true"><i /><i /><i /><i /><i /><i /><b /></div>;
  if (id === "2048") return <div className="arcade-cover arcade-cover-merge" aria-hidden="true"><span>2</span><span>4</span><span>8</span><span>16</span></div>;
  if (id === "memory") return <div className="arcade-cover arcade-cover-memory" aria-hidden="true"><span>✦</span><span>?</span><span>?</span><span>✦</span></div>;
  return <div className="arcade-cover arcade-cover-cashier" aria-hidden="true"><span>₱</span><b>JRC POS</b><i>•••• ••••</i></div>;
}

export default function ArcadeExperience() {
  const [selected, setSelected] = useState<GameId>("snake");
  const [roundKey, setRoundKey] = useState(0);
  const current = games.find((game) => game.id === selected)!;

  function chooseGame(game: GameId) {
    if (selected !== game) { setSelected(game); setRoundKey((key) => key + 1); }
  }

  return (
    <>
      <div className="arcade-game-list" role="tablist" aria-label="Choose a JRC Arcade game">
        {games.map((game) => <button key={game.id} type="button" id={`arcade-tab-${game.id}`} role="tab" aria-selected={selected === game.id} aria-controls="arcade-game-panel" className={`arcade-select-card accent-${game.accent}${selected === game.id ? " is-selected" : ""}`} onClick={() => chooseGame(game.id)}>
          <div className="arcade-select-top"><span>{game.index} / {game.tag}</span><span className="arcade-select-indicator" aria-hidden="true">{selected === game.id ? "●" : "↗"}</span></div>
          <Cover id={game.id} />
          <div className="arcade-select-bottom"><div><strong>{game.title}</strong><small>{selected === game.id ? "NOW PLAYING" : "TAP TO PLAY"}</small></div><span aria-hidden="true">↗</span></div>
        </button>)}
      </div>
      <div className="arcade-stage" role="tabpanel" id="arcade-game-panel" aria-labelledby={`arcade-tab-${selected}`}>
        <div className="arcade-stage-info"><div className="arcade-stage-eyebrow"><span className="arcade-live-dot" /> {current.tag} <span> / </span> GAME {current.index}</div><h2>{current.title}<span>.</span></h2><p>{current.description}</p><div className="arcade-play-help"><span className="arcade-help-icon" aria-hidden="true">⌘</span><div><strong>HOW TO PLAY</strong><small>{current.how}</small></div></div><div className="arcade-stage-notes"><span>✓ NO LOGIN</span><span>✓ PLAY IN BROWSER</span><span>✓ LOCAL HIGH SCORES</span></div></div>
        <div className="arcade-stage-game" key={`${selected}-${roundKey}`}>
          {selected === "snake" ? <SnakeGame /> : selected === "2048" ? <MergeGame /> : selected === "memory" ? <MemoryGame /> : <CashierGame />}
        </div>
      </div>
    </>
  );
}
