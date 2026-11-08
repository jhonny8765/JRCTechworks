"use client";

import { useEffect, useRef, useState } from "react";
import { addRandomTile, canMerge, moveTiles, newMergeBoard, type MergeDirection } from "@/lib/arcade/merge";
import { useBestScore } from "./use-best-score";

type Phase = "ready" | "playing" | "won" | "over";
type Round = { board: number[]; score: number; phase: Phase; reached2048: boolean };
const newRound = (phase: Phase = "ready"): Round => ({ board: newMergeBoard(), score: 0, phase, reached2048: false });

export default function MergeGame() {
  const [round, setRound] = useState<Round>(() => newRound());
  const { best, record } = useBestScore("2048");
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => { record(round.score); }, [round.score, record]);
  function move(direction: MergeDirection) {
    setRound((current) => {
      if (current.phase !== "playing") return current;
      const next = moveTiles(current.board, direction);
      if (!next.changed) return current;
      const board = addRandomTile(next.board);
      const reached2048 = current.reached2048 || board.some((value) => value >= 2048);
      const phase = !current.reached2048 && reached2048 ? "won" : !canMerge(board) ? "over" : "playing";
      return { board, score: current.score + next.gained, reached2048, phase };
    });
  }
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
      const direction: Record<string, MergeDirection> = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
      if (direction[event.key]) { event.preventDefault(); move(direction[event.key]); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="arcade-game arcade-merge">
      <div className="arcade-game-stats"><span>SCORE <strong>{round.score}</strong></span><span>BEST <strong>{best}</strong></span><span>GOAL <strong>2048</strong></span></div>
      <div className="arcade-board-wrap">
        <div className="merge-board" role="img" aria-label={`2048 number puzzle, score ${round.score}. Swipe or use arrow keys to merge equal tiles.`}
          onTouchStart={(event) => { const t = event.changedTouches[0]; touch.current = { x: t.clientX, y: t.clientY }; }}
          onTouchEnd={(event) => { if (!touch.current) return; const t = event.changedTouches[0]; const dx = t.clientX - touch.current.x; const dy = t.clientY - touch.current.y; touch.current = null; if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return; move(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? "right" : "left" : dy > 0 ? "down" : "up"); }}>
          {round.board.map((value, index) => <div className="merge-cell" data-value={value || undefined} key={index} aria-hidden="true">{value || ""}</div>)}
        </div>
        {round.phase !== "playing" && <div className="arcade-game-overlay"><span className="arcade-overlay-mark" aria-hidden="true">{round.phase === "won" ? "★" : "↗"}</span><h3>{round.phase === "ready" ? "Make the numbers grow" : round.phase === "won" ? "2048 unlocked!" : "No more moves"}</h3><p>{round.phase === "ready" ? "Slide tiles together. Matching numbers combine into one." : round.phase === "won" ? "Amazing! Keep going or start a fresh puzzle." : `Final score: ${round.score}. Ready for a rematch?`}</p><button type="button" className="arcade-action" onClick={() => setRound((current) => current.phase === "won" ? { ...current, phase: "playing" } : newRound("playing"))}>{round.phase === "ready" ? "Start puzzle" : round.phase === "won" ? "Keep playing" : "Try again"} <span aria-hidden="true">↗</span></button></div>}
      </div>
      <div className="arcade-controls-row"><div className="arcade-directions" aria-label="2048 direction controls"><button type="button" aria-label="Slide left" onClick={() => move("left")}>←</button><button type="button" aria-label="Slide up" onClick={() => move("up")}>↑</button><button type="button" aria-label="Slide down" onClick={() => move("down")}>↓</button><button type="button" aria-label="Slide right" onClick={() => move("right")}>→</button></div><button type="button" className="arcade-secondary" onClick={() => setRound(newRound("playing"))}>New game</button></div>
      <p className="arcade-instructions">MATCH EQUAL TILES TO REACH 2048 <span>·</span> KEYBOARD ARROWS OR SWIPE</p>
    </div>
  );
}
