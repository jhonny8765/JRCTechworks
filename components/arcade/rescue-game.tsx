"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createGame, formatClock, startGame, stepGame, type GameEvent, type GameMode, type InputFrame, type RescueGame } from "@/lib/rescue/engine";
import { PLAYER_H, PLAYER_W, VIEW_H } from "@/lib/rescue/world";
import { advanceSparks, renderRescue, spawnSparks, type Spark } from "./rescue-renderer";

type Profile = { id: string; name: string };
type Leader = { name: string; score: number; seconds: number; reached_at: number };
type UiState = { level: number; score: number; health: number; repaired: number; elapsed: number; prompt: string; dash: number; mode: GameMode; levelName: string };

const PROFILE_KEY = "jrc_system_rescue_profile_v1";
const BEST_KEY = "jrc_system_rescue_personal_best_v1";
const SOUND_KEY = "jrc_system_rescue_sound_v1";
const baseInput = (): InputFrame => ({ left: false, right: false, jump: false, jumpPressed: false, dashPressed: false, interactPressed: false });
const sanitizeName = (value: string) => value.replace(/[^\p{L}\p{N} _.\-]/gu, "").replace(/\s+/g, " ").slice(0, 18);
const initialHud = (game: RescueGame): UiState => ({ level: game.level.number, score: game.score, health: game.health, repaired: game.repaired, elapsed: game.elapsed, prompt: game.prompt, dash: game.player.dashCooldown, mode: game.mode, levelName: game.level.name });

function idFromBrowser() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `device-${Date.now()}-${Math.floor(Math.random() * 1e8)}`;
}

function readProfile(): Profile {
  try {
    const value = localStorage.getItem(PROFILE_KEY);
    if (value) {
      const parsed = JSON.parse(value);
      if (typeof parsed.id === "string" && /^[\w-]{8,80}$/.test(parsed.id) && typeof parsed.name === "string") {
        return { id: parsed.id, name: sanitizeName(parsed.name) || "JRC Player" };
      }
    }
  } catch { /* local storage can be blocked in private sessions */ }
  const profile = { id: idFromBrowser(), name: `JRC Player ${Math.floor(1000 + Math.random() * 9000)}` };
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch { /* playable offline */ }
  return profile;
}

function saveProfile(profile: Profile) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch { /* storage unavailable */ }
}

function audioCue(context: AudioContext | null, event: GameEvent) {
  if (!context) return;
  const tone = {
    jump: [480, 610, .11], doubleJump: [610, 850, .13], dash: [240, 90, .16],
    pickup: [860, 1160, .10], repair: [520, 1050, .29], checkpoint: [630, 810, .19],
    hurt: [220, 90, .22], enemy: [240, 920, .18], level: [630, 1400, .35],
    win: [690, 1500, .45], gameover: [300, 110, .38], locked: [160, 125, .12],
  }[event];
  const start = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = event === "dash" || event === "hurt" ? "sawtooth" : "sine";
  oscillator.frequency.setValueAtTime(tone[0], start);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, tone[1]), start + tone[2]);
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(.055, start + .015);
  gain.gain.exponentialRampToValueAtTime(.0001, start + tone[2]);
  oscillator.connect(gain); gain.connect(context.destination);
  oscillator.start(start); oscillator.stop(start + tone[2] + .02);
}

export default function RescueGame() {
  const gameRef = useRef<RescueGame>(createGame());
  const inputsRef = useRef<InputFrame>(baseInput());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const soundRef = useRef<AudioContext | null>(null);
  const profileRef = useRef<Profile | null>(null);
  const runIdRef = useRef<string | null>(null);
  const wonRef = useRef<((game: RescueGame) => void) | null>(null);
  const [hud, setHud] = useState<UiState>(() => initialHud(gameRef.current));
  const [mode, setMode] = useState<GameMode>("menu");
  const [name, setName] = useState("");
  const [profileReady, setProfileReady] = useState(false);
  const [personalBest, setPersonalBest] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [online, setOnline] = useState<"checking" | "ready" | "offline">("checking");
  const [scoreStatus, setScoreStatus] = useState("");
  const [boardOpen, setBoardOpen] = useState(false);
  const [boardLoading, setBoardLoading] = useState(false);
  const [board, setBoard] = useState<Leader[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const profile = readProfile();
    profileRef.current = profile;
    setName(profile.name);
    try { setPersonalBest(Number(localStorage.getItem(BEST_KEY)) || 0); setSoundOn(localStorage.getItem(SOUND_KEY) === "on"); }
    catch { /* best score and sound still work for the current session */ }
    setProfileReady(true);
  }, []);

  const loadBoard = useCallback(async () => {
    setBoardOpen(true);
    setBoardLoading(true);
    try {
      const res = await fetch("/api/rescue/leaderboard", { cache: "no-store" });
      if (!res.ok) throw new Error("Leaderboard unavailable");
      const data = await res.json();
      if (!Array.isArray(data.leaders)) throw new Error("Invalid scores");
      setBoard(data.leaders.slice(0, 10));
      setOnline("ready");
    } catch {
      setOnline("offline");
      setBoard([]);
    } finally { setBoardLoading(false); }
  }, []);

  const handleVictory = useCallback(async (game: RescueGame) => {
    const score = game.score;
    setPersonalBest((best) => {
      const next = Math.max(best, score);
      try { localStorage.setItem(BEST_KEY, String(next)); } catch { /* optional local storage */ }
      return next;
    });
    const profile = profileRef.current;
    const runId = runIdRef.current;
    if (!profile || !runId) {
      setScoreStatus("Saved on this device. Online ranking was unavailable for this run.");
      return;
    }
    setScoreStatus("Uploading your completed rescue...");
    try {
      const response = await fetch("/api/rescue/score", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId, playerId: profile.id, name: profile.name, score, seconds: Math.floor(game.elapsed), levels: 3 }),
      });
      if (!response.ok) throw new Error("Score rejected");
      setScoreStatus("Your score is on the JRC leaderboard!");
      setOnline("ready");
      await loadBoard();
    } catch {
      setScoreStatus("Personal best saved here. Online score could not be verified—try another run later.");
      setOnline("offline");
    }
  }, [loadBoard]);
  wonRef.current = handleVictory;

  const enableAudio = () => {
    if (!soundOn || soundRef.current) return;
    try { soundRef.current = new AudioContext(); }
    catch { /* audio is optional */ }
  };

  const begin = () => {
    const playerName = sanitizeName(name.trim()) || "JRC Player";
    const profile = { id: profileRef.current?.id || idFromBrowser(), name: playerName };
    profileRef.current = profile;
    setName(playerName);
    saveProfile(profile);
    if (soundOn) enableAudio();
    startGame(gameRef.current);
    sparksRef.current = [];
    inputsRef.current = baseInput();
    runIdRef.current = null;
    setMode("playing");
    setHud(initialHud(gameRef.current));
    setScoreStatus("");
    setBoardOpen(false);
    // Start ticket is only for the online leaderboard; a network failure never blocks play.
    void fetch("/api/rescue/start", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: profile.id }),
    }).then(async (res) => {
      if (!res.ok) throw new Error("Offline run");
      const data = await res.json();
      if (typeof data.runId !== "string") throw new Error("Invalid run");
      runIdRef.current = data.runId;
      setOnline("ready");
    }).catch(() => setOnline("offline"));
  };

  const togglePause = useCallback(() => {
    const game = gameRef.current;
    if (game.mode === "playing") { game.mode = "paused"; setMode("paused"); }
    else if (game.mode === "paused") { game.mode = "playing"; setMode("playing"); }
    inputsRef.current = baseInput();
  }, []);

  useEffect(() => {
    const handleDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest("input,textarea,select,[contenteditable=true]")) return;
      const input = inputsRef.current;
      const k = event.key.toLowerCase();
      if (["arrowleft", "arrowright", "arrowup", " ", "shift", "arrowdown"].includes(k)) event.preventDefault();
      if (k === "arrowleft" || k === "a") input.left = true;
      if (k === "arrowright" || k === "d") input.right = true;
      if (k === " " || k === "arrowup" || k === "w") { if (!input.jump) input.jumpPressed = true; input.jump = true; }
      if ((k === "shift" || k === "x") && !event.repeat) input.dashPressed = true;
      if ((k === "e" || k === "f") && !event.repeat) input.interactPressed = true;
      if ((k === "p" || k === "escape") && !event.repeat) {
        const game = gameRef.current;
        if (game.mode === "playing") { game.mode = "paused"; setMode("paused"); }
        else if (game.mode === "paused") { game.mode = "playing"; setMode("playing"); }
        inputsRef.current = baseInput();
      }
    };
    const handleUp = (event: KeyboardEvent) => {
      const k = event.key.toLowerCase();
      if (k === "arrowleft" || k === "a") inputsRef.current.left = false;
      if (k === "arrowright" || k === "d") inputsRef.current.right = false;
      if (k === " " || k === "arrowup" || k === "w") inputsRef.current.jump = false;
    };
    const handleBlur = () => {
      const game = gameRef.current;
      if (game.mode === "playing") { game.mode = "paused"; setMode("paused"); }
      inputsRef.current = baseInput();
    };
    const handleHidden = () => { if (document.hidden) handleBlur(); };
    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleHidden);
    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleHidden);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const viewport = canvas?.parentElement;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !viewport || !context) return;
    let frame = 0, previous = 0, accumulator = 0, lastUi = 0;
    let lastMode: GameMode = gameRef.current.mode;

    const resize = () => {
      const rect = viewport.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      gameRef.current.viewWidth = rect.width / Math.max(.1, rect.height / VIEW_H);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);

    const animate = (now: number) => {
      if (!previous) previous = now;
      const elapsed = Math.min((now - previous) / 1000, .05);
      previous = now;
      accumulator = Math.min(accumulator + elapsed, .15);
      const game = gameRef.current;
      const sparks = sparksRef.current;
      while (accumulator >= 1 / 60) {
        const events = stepGame(game, inputsRef.current, 1 / 60);
        inputsRef.current.jumpPressed = false;
        inputsRef.current.dashPressed = false;
        inputsRef.current.interactPressed = false;
        if (game.mode !== "playing" && game.mode !== "transition") game.gameClock += 1 / 60;
        for (const event of events) {
          if (soundRef.current) audioCue(soundRef.current, event);
          if (["pickup", "repair", "dash", "enemy", "checkpoint", "hurt", "level", "win"].includes(event)) {
            spawnSparks(sparks, game.player.x + PLAYER_W / 2, game.player.y + PLAYER_H / 2, event === "hurt" ? "#fb78a2" : game.level.color, event === "repair" || event === "level" ? 35 : 13);
          }
        }
        advanceSparks(sparks, 1 / 60);
        if (lastMode !== game.mode) {
          lastMode = game.mode;
          setMode(game.mode);
          if (game.mode === "won") wonRef.current?.(game);
        }
        accumulator -= 1 / 60;
      }

      const scale = canvas.height / VIEW_H;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.clearRect(0, 0, game.viewWidth, VIEW_H);
      renderRescue(context, game, sparks);
      if (now - lastUi >= 100) { setHud(initialHud(game)); lastUi = now; }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => { observer.disconnect(); window.cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => () => { void soundRef.current?.close(); }, []);

  const touchDown = (key: "left" | "right" | "jump" | "dash" | "interact") => (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const input = inputsRef.current;
    if (key === "left" || key === "right") input[key] = true;
    if (key === "jump") { if (!input.jump) input.jumpPressed = true; input.jump = true; }
    if (key === "dash") input.dashPressed = true;
    if (key === "interact") input.interactPressed = true;
  };
  const touchUp = (key: "left" | "right" | "jump" | "dash" | "interact") => () => {
    if (key === "left" || key === "right" || key === "jump") inputsRef.current[key] = false;
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    try { localStorage.setItem(SOUND_KEY, next ? "on" : "off"); } catch { /* optional */ }
    if (next && !soundRef.current) {
      try { soundRef.current = new AudioContext(); } catch { /* silent mode */ }
    }
    if (!next && soundRef.current) { void soundRef.current.close(); soundRef.current = null; }
  };

  const requestFullscreen = () => {
    const host = canvasRef.current?.closest<HTMLElement>(".rescue-game-box");
    if (host?.requestFullscreen) void host.requestFullscreen().catch(() => {});
  };

  const saveName = (value: string) => {
    const safe = sanitizeName(value);
    setName(safe);
    if (profileRef.current) {
      profileRef.current = { ...profileRef.current, name: safe || "JRC Player" };
      saveProfile(profileRef.current);
    }
  };

  return <div className="rescue-game-box">
    <div className="rescue-game-topline">
      <div className="rescue-level-indicator"><span className="rescue-live-light" /> LEVEL {String(hud.level).padStart(2, "0")} / 03 <span className="rescue-divider">/</span> <strong>{hud.levelName}</strong></div>
      <div className="rescue-game-utilities"><button type="button" onClick={() => setShowHelp((v) => !v)} aria-expanded={showHelp}>? HELP</button><button type="button" onClick={toggleSound} aria-label={soundOn ? "Mute sound" : "Turn sound on"}>{soundOn ? "♫ SOUND ON" : "♫ SOUND OFF"}</button><button type="button" onClick={requestFullscreen}>⛶ FULLSCREEN</button></div>
    </div>
    {showHelp && <div className="rescue-help-line">MOVE <kbd>←</kbd><kbd>→</kbd> / A D · JUMP <kbd>SPACE</kbd> or W · DOUBLE JUMP twice · DASH <kbd>SHIFT</kbd> or X · REPAIR <kbd>E</kbd> · PAUSE <kbd>P</kbd>. On mobile, use touch buttons.</div>}
    <div className="rescue-hud" aria-live="off">
      <div className="rescue-hud-item"><small>HEALTH</small><strong className="rescue-hearts">{"♥".repeat(hud.health)}<span>{"♡".repeat(4 - hud.health)}</span></strong></div>
      <div className="rescue-hud-item"><small>SYSTEMS FIXED</small><strong>{hud.repaired}<span> / 3</span></strong></div>
      <div className="rescue-hud-item"><small>POINTS</small><strong>{hud.score.toLocaleString()}</strong></div>
      <div className="rescue-hud-item"><small>TIME</small><strong>{formatClock(hud.elapsed)}</strong></div>
      <button type="button" className="rescue-pause-button" onClick={togglePause} disabled={mode !== "playing" && mode !== "paused"}>{mode === "paused" ? "▶ RESUME" : "Ⅱ PAUSE"}</button>
    </div>
    <div className="rescue-canvas-wrap">
      <canvas ref={canvasRef} className="rescue-canvas" role="img" aria-label="Side-scrolling JRC Robot platform game. Use arrow keys and jump to reach three repair terminals in each level." />
      {hud.prompt && mode === "playing" && <div className="rescue-prompt" role="status"><span>✦</span> {hud.prompt} <kbd>E / FIX</kbd></div>}
      {mode === "menu" && <div className="rescue-overlay"><div className="rescue-overlay-card rescue-start-card">
        <span className="rescue-tag">● JRC ORIGINAL · 3 LEVEL ADVENTURE</span>
        <h2>GLITCHES, BE GONE<span>.</span></h2>
        <p>Three Filipino businesses need saving. Jump the gaps, dash through bugs, repair every terminal, and bring the systems back online.</p>
        <label className="rescue-player-input">YOUR PLAYER NAME <input aria-label="Your saved player name" autoComplete="nickname" maxLength={18} value={name} onChange={(e) => saveName(e.target.value)} placeholder="JRC Player" /></label>
        <p className="rescue-save-notice">↳ Your name and personal best stay saved in this browser on this device.</p>
        <button type="button" className="rescue-big-button" onClick={begin} disabled={!profileReady}>START RESCUE <span>↗</span></button>
        <div className="rescue-overlay-stats"><span>3 WORLDS</span><span>DOUBLE JUMP + DASH</span><span>NO DOWNLOADS</span></div>
      </div></div>}
      {mode === "paused" && <div className="rescue-overlay"><div className="rescue-overlay-card rescue-dialog"><span className="rescue-tag">RUN PAUSED</span><h2>Take a breather<span>.</span></h2><p>Your progress is safe while this tab stays open.</p><button type="button" className="rescue-big-button" onClick={togglePause}>RESUME MISSION <span>↗</span></button><button type="button" className="rescue-soft-button" onClick={() => { gameRef.current.mode = "menu"; setMode("menu"); }}>Leave this run</button></div></div>}
      {mode === "over" && <div className="rescue-overlay"><div className="rescue-overlay-card rescue-dialog"><span className="rescue-tag">MISSION INTERRUPTED</span><h2>One more try<span>?</span></h2><p>{gameRef.current.reason} You made it to Level {hud.level} and earned {hud.score.toLocaleString()} points.</p><button type="button" className="rescue-big-button" onClick={begin}>RESTART RESCUE <span>↗</span></button><button type="button" className="rescue-soft-button" onClick={() => { gameRef.current.mode = "menu"; setMode("menu"); }}>Back to briefing</button></div></div>}
      {mode === "won" && <div className="rescue-overlay"><div className="rescue-overlay-card rescue-dialog rescue-victory"><span className="rescue-tag">✓ ALL SYSTEMS ONLINE</span><h2>YOU SAVED THE DAY<span>!</span></h2><p>Great work, {name}. Three businesses are back up and running.</p><div className="rescue-victory-score"><span>FINAL SCORE</span><strong>{hud.score.toLocaleString()}</strong><small>TIME {formatClock(hud.elapsed)}</small></div><p className="rescue-score-status" role="status">{scoreStatus}</p><button type="button" className="rescue-big-button" onClick={begin}>PLAY AGAIN <span>↗</span></button><button type="button" className="rescue-soft-button" onClick={() => void loadBoard()}>View global leaderboard</button></div></div>}
    </div>
    <div className="rescue-touch-controls" aria-label="Game controls for touch devices">
      <div className="rescue-touch-group"><button type="button" aria-label="Move left" onPointerDown={touchDown("left")} onPointerUp={touchUp("left")} onPointerCancel={touchUp("left")}>◀</button><button type="button" aria-label="Move right" onPointerDown={touchDown("right")} onPointerUp={touchUp("right")} onPointerCancel={touchUp("right")}>▶</button></div>
      <div className="rescue-touch-group"><button type="button" aria-label="Repair nearby terminal" onPointerDown={touchDown("interact")} onPointerUp={touchUp("interact")}>FIX</button><button type="button" aria-label="Dash" onPointerDown={touchDown("dash")} onPointerUp={touchUp("dash")}>DASH</button><button type="button" aria-label="Jump" onPointerDown={touchDown("jump")} onPointerUp={touchUp("jump")} onPointerCancel={touchUp("jump")}>JUMP</button></div>
    </div>
    <div className="rescue-game-below">
      <div className="rescue-player-summary"><span>YOUR STATION <strong>{name || "JRC Player"}</strong></span><span>LOCAL BEST <strong>{personalBest.toLocaleString()}</strong></span><span>ONLINE BOARD <strong className={online === "offline" ? "is-offline" : ""}>{online === "ready" ? "CONNECTED" : online === "offline" ? "UNAVAILABLE" : "ON REQUEST"}</strong></span></div>
      <button type="button" className="rescue-leader-trigger" onClick={() => boardOpen ? setBoardOpen(false) : void loadBoard()} aria-expanded={boardOpen}>🏆 {boardOpen ? "HIDE LEADERBOARD" : "GLOBAL LEADERBOARD"} <span>↗</span></button>
    </div>
    {boardOpen && <section className="rescue-leaderboard" aria-label="Global System Rescue leaderboard"><div className="rescue-leaderboard-heading"><div><span className="rescue-tag">WORLDWIDE / TOP 10</span><h3>The Hall of Fixers<span>.</span></h3></div><button type="button" onClick={() => void loadBoard()} disabled={boardLoading}>↻ REFRESH</button></div>
      {boardLoading ? <p className="rescue-board-message">Connecting to the scoreboard...</p> : online === "offline" ? <p className="rescue-board-message">The online scoreboard is temporarily unavailable. Your name and best score remain saved on this device.</p> : board.length === 0 ? <p className="rescue-board-message">No finishers yet. Be the first to rescue all three businesses!</p> : <ol>{board.map((leader, index) => <li key={`${leader.name}-${index}`}><span className="rescue-rank">{String(index + 1).padStart(2, "0")}</span><span className="rescue-leader-name">{leader.name}</span><span>{formatClock(leader.seconds)}</span><strong>{leader.score.toLocaleString()} PTS</strong></li>)}</ol>}
    </section>}
    <p className="rescue-privacy-footnote">Local identity is saved per browser/device, not synced across computers. The public leaderboard stores only a nickname, submitted score, and completion time. No account or payment needed.</p>
  </div>;
}
