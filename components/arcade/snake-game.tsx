"use client";

import { useEffect, useRef, useState } from "react";
import { useBestScore } from "./use-best-score";

const SIZE = 16;
type Point = { x: number; y: number };
type Heading = "up" | "down" | "left" | "right";
type Phase = "ready" | "playing" | "paused" | "over" | "won";
type SnakeRound = { snake: Point[]; food: Point; heading: Heading; pending: Heading; score: number; phase: Phase };
const offsets: Record<Heading, Point> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
const opposite: Record<Heading, Heading> = { up: "down", down: "up", left: "right", right: "left" };
const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

function foodFor(snake: readonly Point[]): Point {
  const empty: Point[] = [];
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (!snake.some((part) => part.x === x && part.y === y)) empty.push({ x, y });
    }
  }
  return empty[Math.floor(Math.random() * empty.length)] ?? snake[0];
}

function newRound(phase: Phase = "ready"): SnakeRound {
  const snake = [{ x: 7, y: 8 }, { x: 6, y: 8 }, { x: 5, y: 8 }];
  return { snake, food: foodFor(snake), heading: "right", pending: "right", score: 0, phase };
}

function tick(round: SnakeRound): SnakeRound {
  if (round.phase !== "playing") return round;
  const heading = round.pending;
  const delta = offsets[heading];
  const head = { x: round.snake[0].x + delta.x, y: round.snake[0].y + delta.y };
  const ate = same(head, round.food);
  const body = ate ? round.snake : round.snake.slice(0, -1);
  if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE || body.some((part) => same(part, head))) {
    return { ...round, phase: "over" };
  }
  const snake = [head, ...body];
  const score = round.score + (ate ? 10 : 0);
  if (snake.length === SIZE * SIZE) return { ...round, snake, score, heading, pending: heading, phase: "won" };
  return { ...round, snake, food: ate ? foodFor(snake) : round.food, heading, pending: heading, score };
}

export default function SnakeGame() {
  const [round, setRound] = useState<SnakeRound>(() => newRound());
  const { best, record } = useBestScore("snake");
  const touch = useRef<Point | null>(null);

  useEffect(() => { record(round.score); }, [round.score, record]);
  useEffect(() => {
    if (round.phase !== "playing") return;
    const timer = window.setInterval(() => setRound((current) => tick(current)), Math.max(95, 158 - Math.floor(round.score / 50) * 9));
    return () => window.clearInterval(timer);
  }, [round.phase, round.score]);
  useEffect(() => {
    const onHidden = () => { if (document.hidden) setRound((current) => current.phase === "playing" ? { ...current, phase: "paused" } : current); };
    document.addEventListener("visibilitychange", onHidden);
    return () => document.removeEventListener("visibilitychange", onHidden);
  }, []);

  function turn(next: Heading) {
    setRound((current) => current.phase === "playing" && next !== opposite[current.heading]
      ? { ...current, pending: next }
      : current);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
      const direction: Record<string, Heading> = { ArrowUp: "up", w: "up", ArrowDown: "down", s: "down", ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right" };
      const next = direction[event.key];
      if (next) { event.preventDefault(); turn(next); }
      if (event.code === "Space") { event.preventDefault(); setRound((current) => current.phase === "playing" ? { ...current, phase: "paused" } : current.phase === "paused" ? { ...current, phase: "playing" } : current); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const occupied = new Set(round.snake.map((part) => `${part.x}-${part.y}`));
  const head = `${round.snake[0].x}-${round.snake[0].y}`;
  const overlayText = round.phase === "ready" ? "Ready, player one?" : round.phase === "paused" ? "Taking a breather" : round.phase === "won" ? "You filled the board!" : "Oops, game over";
  return (
    <div className="arcade-game arcade-snake">
      <div className="arcade-game-stats"><span>SCORE <strong>{round.score}</strong></span><span>BEST <strong>{best}</strong></span><span>SPEED <strong>{Math.min(9, 1 + Math.floor(round.score / 50))}</strong></span></div>
      <div className="arcade-board-wrap">
        <div className="snake-board" role="img" aria-label={`Snake game. Score ${round.score}. Use arrow keys, WASD, swipes, or direction buttons.`}
          onTouchStart={(event) => { const t = event.changedTouches[0]; touch.current = { x: t.clientX, y: t.clientY }; }}
          onTouchEnd={(event) => { if (!touch.current) return; const t = event.changedTouches[0]; const dx = t.clientX - touch.current.x; const dy = t.clientY - touch.current.y; touch.current = null; if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return; turn(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? "right" : "left" : dy > 0 ? "down" : "up"); }}>
          {Array.from({ length: SIZE * SIZE }, (_, index) => {
            const position = `${index % SIZE}-${Math.floor(index / SIZE)}`;
            const kind = position === head ? "head" : occupied.has(position) ? "body" : position === `${round.food.x}-${round.food.y}` ? "food" : "empty";
            return <span className={`snake-cell is-${kind}`} key={index} aria-hidden="true" />;
          })}
        </div>
        {round.phase !== "playing" && <div className="arcade-game-overlay"><span className="arcade-overlay-mark" aria-hidden="true">{round.phase === "over" ? "↻" : "✦"}</span><h3>{overlayText}</h3><p>{round.phase === "ready" ? "Collect the glowing dots. Avoid the walls and your own tail." : round.phase === "paused" ? "Your score is safe. Pick up where you left off." : `You scored ${round.score} points. Give it another go!`}</p><button type="button" className="arcade-action" onClick={() => setRound((current) => current.phase === "paused" ? { ...current, phase: "playing" } : newRound("playing"))}>{round.phase === "paused" ? "Resume game" : round.phase === "ready" ? "Start game" : "Play again"} <span aria-hidden="true">↗</span></button></div>}
      </div>
      <div className="arcade-controls-row"><div className="arcade-directions" aria-label="Snake direction controls"><button type="button" aria-label="Move left" onClick={() => turn("left")}>←</button><button type="button" aria-label="Move up" onClick={() => turn("up")}>↑</button><button type="button" aria-label="Move down" onClick={() => turn("down")}>↓</button><button type="button" aria-label="Move right" onClick={() => turn("right")}>→</button></div><button type="button" className="arcade-secondary" onClick={() => setRound((current) => current.phase === "playing" ? { ...current, phase: "paused" } : current.phase === "paused" ? { ...current, phase: "playing" } : newRound("playing"))}>{round.phase === "playing" ? "Pause" : round.phase === "paused" ? "Resume" : "Restart"}</button></div>
      <p className="arcade-instructions">DESKTOP: ARROW KEYS / WASD / SPACE TO PAUSE <span>·</span> MOBILE: SWIPE OR TAP DIRECTIONS</p>
    </div>
  );
}
