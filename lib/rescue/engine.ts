import { createLevel, GROUND_Y, LEVEL_COUNT, PLAYER_H, PLAYER_W, VIEW_H, VIEW_W, WORLD_W, type Box, type Level } from "./world";

export type GameMode = "menu" | "playing" | "paused" | "transition" | "won" | "over";
export type GameEvent = "jump" | "doubleJump" | "dash" | "hurt" | "pickup" | "repair" | "enemy" | "checkpoint" | "level" | "win" | "gameover" | "locked";
export type InputFrame = { left: boolean; right: boolean; jump: boolean; jumpPressed: boolean; dashPressed: boolean; interactPressed: boolean };
export type Player = {
  x: number; y: number; vx: number; vy: number; facing: number;
  onGround: boolean; canDoubleJump: boolean; coyote: number; jumpBuffer: number;
  dashTime: number; dashCooldown: number; invuln: number;
};
export type RescueGame = {
  mode: GameMode; levelIndex: number; level: Level; player: Player;
  score: number; health: number; elapsed: number; camera: number; gameClock: number;
  viewWidth: number;
  checkpointX: number; repaired: number; levelDelay: number; prompt: string;
  shake: number; deathCount: number; reason: string;
};

function rectOverlap(ax: number, ay: number, aw: number, ah: number, b: Box) {
  return ax < b.x + b.w && ax + aw > b.x && ay < b.y + b.h && ay + ah > b.y;
}

function playerAt(x = 74, y = GROUND_Y - PLAYER_H): Player {
  return { x, y, vx: 0, vy: 0, facing: 1, onGround: false, canDoubleJump: true, coyote: 0.08, jumpBuffer: 0, dashTime: 0, dashCooldown: 0, invuln: 0 };
}

export function createGame(): RescueGame {
  return {
    mode: "menu", levelIndex: 0, level: createLevel(0), player: playerAt(), score: 0, health: 4,
    elapsed: 0, camera: 0, gameClock: 0, viewWidth: VIEW_W, checkpointX: 74, repaired: 0, levelDelay: 0,
    prompt: "", shake: 0, deathCount: 0, reason: "",
  };
}

export function startGame(game: RescueGame) {
  const width = game.viewWidth;
  const reset = createGame();
  Object.assign(game, reset);
  game.viewWidth = width;
  game.mode = "playing";
}

function moveToLevel(game: RescueGame, next: number) {
  game.levelIndex = next;
  game.level = createLevel(next);
  game.player = playerAt();
  game.checkpointX = 74;
  game.repaired = 0;
  game.camera = 0;
  game.health = Math.min(4, game.health + 1);
  game.prompt = "";
  game.mode = "playing";
}

function hurt(game: RescueGame, events: GameEvent[], reason: string) {
  const player = game.player;
  if (player.invuln > 0 || game.mode !== "playing") return;
  game.health -= 1;
  game.shake = 12;
  game.deathCount += 1;
  game.reason = reason;
  events.push("hurt");
  if (game.health <= 0) {
    game.mode = "over";
    events.push("gameover");
  } else {
    game.player = playerAt(game.checkpointX, GROUND_Y - PLAYER_H - 3);
    game.player.invuln = 1.5;
  }
}

/** Fixed-step, deterministic world update. No network work or React renders in the loop. */
export function stepGame(game: RescueGame, input: InputFrame, dt = 1 / 60): GameEvent[] {
  const events: GameEvent[] = [];
  if (game.mode === "transition") {
    game.levelDelay -= dt;
    if (game.levelDelay <= 0) {
      if (game.levelIndex === LEVEL_COUNT - 1) { game.mode = "won"; events.push("win"); }
      else moveToLevel(game, game.levelIndex + 1);
    }
    return events;
  }
  if (game.mode !== "playing") return events;

  const p = game.player;
  game.elapsed += dt;
  game.gameClock += dt;
  game.shake = Math.max(0, game.shake - dt * 28);
  p.invuln = Math.max(0, p.invuln - dt);
  p.dashCooldown = Math.max(0, p.dashCooldown - dt);
  p.coyote = p.onGround ? 0.12 : Math.max(0, p.coyote - dt);
  p.jumpBuffer = input.jumpPressed ? 0.15 : Math.max(0, p.jumpBuffer - dt);

  if (p.jumpBuffer > 0 && (p.coyote > 0 || p.canDoubleJump)) {
    const firstJump = p.coyote > 0;
    if (!firstJump) p.canDoubleJump = false;
    p.vy = firstJump ? -555 : -520;
    p.onGround = false;
    p.coyote = 0;
    p.jumpBuffer = 0;
    events.push(firstJump ? "jump" : "doubleJump");
  }
  if (input.dashPressed && p.dashCooldown <= 0) {
    p.dashTime = 0.17;
    p.dashCooldown = 0.86;
    p.invuln = Math.max(p.invuln, 0.24);
    p.vy = 0;
    events.push("dash");
  }

  const moving = Number(input.right) - Number(input.left);
  if (moving) p.facing = moving;
  const dashing = p.dashTime > 0;
  if (dashing) {
    p.vx = p.facing * 820;
    p.dashTime = Math.max(0, p.dashTime - dt);
  } else {
    const desired = moving * 275;
    p.vx += (desired - p.vx) * Math.min(1, dt * (p.onGround ? 19 : 12));
    p.vy = Math.min(p.vy + 1430 * dt, 950);
    if (!input.jump && p.vy < -110) p.vy += 1250 * dt;
  }

  // Horizontal and vertical collision are separate, avoiding camera-related jitter.
  p.x = Math.max(0, Math.min(WORLD_W - PLAYER_W, p.x + p.vx * dt));
  for (const box of game.level.platforms) {
    if (!rectOverlap(p.x, p.y, PLAYER_W, PLAYER_H, box)) continue;
    if (p.vx > 0) p.x = box.x - PLAYER_W;
    else if (p.vx < 0) p.x = box.x + box.w;
    p.vx = 0;
  }
  const formerBottom = p.y + PLAYER_H;
  const formerTop = p.y;
  p.y += p.vy * dt;
  p.onGround = false;
  for (const box of game.level.platforms) {
    if (!rectOverlap(p.x, p.y, PLAYER_W, PLAYER_H, box)) continue;
    if (p.vy >= 0 && formerBottom <= box.y + 15) {
      p.y = box.y - PLAYER_H;
      p.vy = 0;
      p.onGround = true;
      p.canDoubleJump = true;
    } else if (p.vy < 0 && formerTop >= box.y + box.h - 12) {
      p.y = box.y + box.h;
      p.vy = 0;
    }
  }
  if (p.y > VIEW_H + 140) { hurt(game, events, "A missing platform caught you."); return events; }

  for (const trap of game.level.spikes) {
    if (rectOverlap(p.x + 6, p.y + 10, PLAYER_W - 12, PLAYER_H - 10, trap)) {
      hurt(game, events, "A glitch trap interrupted the run.");
      return events;
    }
  }

  for (const enemy of game.level.glitches) {
    if (!enemy.alive) continue;
    enemy.x = enemy.originX + Math.sin(game.gameClock * enemy.speed * 1.65 + enemy.phase) * enemy.range;
    if (!rectOverlap(p.x, p.y, PLAYER_W, PLAYER_H, { x: enemy.x - 17, y: enemy.y - 25, w: 34, h: 33 })) continue;
    if (dashing) {
      enemy.alive = false;
      game.score += 130;
      events.push("enemy");
    } else {
      hurt(game, events, "A roaming software bug caught you.");
      return events;
    }
  }

  for (const bit of game.level.bits) {
    if (bit.taken || Math.hypot(p.x + PLAYER_W / 2 - bit.x, p.y + PLAYER_H / 2 - bit.y) > 30) continue;
    bit.taken = true;
    if (bit.kind === "heart") game.health = Math.min(4, game.health + 1);
    else game.score += 75;
    events.push("pickup");
  }

  const centerX = p.x + PLAYER_W / 2;
  const centerY = p.y + PLAYER_H / 2;
  game.prompt = "";
  for (const terminal of game.level.terminals) {
    if (terminal.fixed || Math.hypot(centerX - terminal.x, centerY - terminal.y) > 100) continue;
    game.prompt = `REPAIR ${terminal.label}`;
    if (input.interactPressed) {
      terminal.fixed = true;
      game.repaired++;
      game.score += 350;
      game.shake = 3;
      game.prompt = "SYSTEM RESTORED";
      events.push("repair");
    }
    break;
  }

  for (const mark of game.level.checkpoints) {
    if (centerX > mark && game.checkpointX < mark) {
      game.checkpointX = mark;
      events.push("checkpoint");
    }
  }

  if (centerX > WORLD_W - 120) {
    if (game.repaired < game.level.terminals.length) {
      game.prompt = `RESTORE ${game.level.terminals.length - game.repaired} MORE SYSTEM${game.level.terminals.length - game.repaired > 1 ? "S" : ""}`;
      if (input.interactPressed) events.push("locked");
    } else {
      game.score += 850 + Math.max(0, 350 - Math.floor(game.elapsed / 3));
      game.mode = "transition";
      game.levelDelay = 1.55;
      events.push("level");
    }
  }

  const targetCamera = Math.max(0, Math.min(WORLD_W - game.viewWidth, centerX - game.viewWidth * 0.36));
  game.camera += (targetCamera - game.camera) * Math.min(1, dt * 6.8);
  return events;
}

export function formatClock(seconds: number) {
  return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
}
