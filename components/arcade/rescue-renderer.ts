import { GROUND_Y, PLAYER_H, PLAYER_W, VIEW_H, WORLD_W } from "@/lib/rescue/world";
import type { RescueGame } from "@/lib/rescue/engine";

export type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number };

const TAU = Math.PI * 2;

function rounded(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function glowText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, size = 13) {
  ctx.save();
  ctx.font = `800 ${size}px ui-monospace, SFMono-Regular, Consolas, monospace`;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 9;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D, g: RescueGame, t: number) {
  const c = g.level.color;
  const viewWidth = g.viewWidth;
  const sky = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  sky.addColorStop(0, g.level.backdrop);
  sky.addColorStop(0.7, "#080f20");
  sky.addColorStop(1, "#0e1525");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, viewWidth, VIEW_H);

  // Parallax city and tiny stars use deterministic positions, no assets or texture downloads.
  ctx.globalAlpha = 0.17;
  for (let i = 0; i < 70; i++) {
    const x = ((i * 173.7 - g.camera * .085) % 1240 + 1240) % 1240 - 30;
    const y = 40 + ((i * 71) % 295);
    ctx.fillStyle = i % 6 === 0 ? c : "#b1cae9";
    ctx.fillRect(x, y, i % 7 === 0 ? 3 : 1.5, i % 7 === 0 ? 3 : 1.5);
  }
  ctx.globalAlpha = 1;
  const horizon = ctx.createRadialGradient(550, 330, 40, 550, 330, 630);
  horizon.addColorStop(0, `${c}20`);
  horizon.addColorStop(1, "#02091600");
  ctx.fillStyle = horizon;
  ctx.fillRect(0, 0, viewWidth, VIEW_H);

  for (let layer = 0; layer < 3; layer++) {
    const speed = .12 + layer * .08;
    const shift = g.camera * speed;
    const base = 443 + layer * 23;
    for (let i = 0; i < 24; i++) {
      const x = i * 80 - (shift % 80);
      const height = 68 + ((i * 53 + layer * 47) % 122);
      ctx.fillStyle = layer === 0 ? "#132039" : layer === 1 ? "#17253d" : "#1a2b41";
      ctx.fillRect(x, base - height, 60 + ((i * 13) % 20), height + 50);
      ctx.fillStyle = layer === 0 ? `${c}16` : `${c}22`;
      for (let wy = base - height + 14; wy < base - 8; wy += 21) {
        for (let wx = x + 12; wx < x + 52; wx += 19) {
          if ((i + wy + wx) % 4 > 1) ctx.fillRect(wx, wy, 4, 7);
        }
      }
    }
  }
  ctx.strokeStyle = `${c}1c`;
  ctx.lineWidth = 1;
  for (let x = -g.camera % 55; x < viewWidth; x += 55) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, VIEW_H); ctx.stroke();
  }
  for (let y = 0; y < VIEW_H; y += 55) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(viewWidth, y); ctx.stroke();
  }
  ctx.globalAlpha = .09 + Math.sin(t * 1.1) * .025;
  ctx.strokeStyle = c;
  for (let y = 0; y < VIEW_H; y += 4) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(viewWidth, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawWorld(ctx: CanvasRenderingContext2D, g: RescueGame, t: number) {
  const theme = g.level;
  ctx.save();
  ctx.translate(-Math.floor(g.camera), 0);

  for (const p of theme.platforms) {
    if (p.x + p.w < g.camera - 80 || p.x > g.camera + g.viewWidth + 80) continue;
    ctx.fillStyle = p.y >= GROUND_Y ? "#101d2e" : "#182f43";
    ctx.strokeStyle = `${theme.color}70`;
    ctx.lineWidth = 2;
    rounded(ctx, p.x, p.y, p.w, p.h + 8, p.y >= GROUND_Y ? 4 : 6);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = theme.color;
    ctx.globalAlpha = .54;
    ctx.fillRect(p.x + 5, p.y + 1, p.w - 10, 3);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#263d52";
    for (let ix = p.x + 20; ix < p.x + p.w - 8; ix += 44) {
      if (p.y < GROUND_Y) ctx.fillRect(ix, p.y + 10, 16, 3);
      else ctx.fillRect(ix, p.y + 22, 19, 30);
    }
  }

  // Checkpoint pylons are deliberately visible before reaching them.
  for (const checkpoint of theme.checkpoints.slice(1)) {
    const lit = checkpoint <= g.checkpointX;
    ctx.fillStyle = lit ? `${theme.color}2b` : "#25354b";
    rounded(ctx, checkpoint - 15, GROUND_Y - 72, 30, 72, 6); ctx.fill();
    ctx.fillStyle = lit ? theme.color : "#7389a1";
    rounded(ctx, checkpoint - 11, GROUND_Y - 65, 22, 16, 4); ctx.fill();
    glowText(ctx, "SAVE", checkpoint - 18, GROUND_Y - 86, lit ? theme.color : "#7891aa", 11);
  }

  for (const trap of theme.spikes) {
    ctx.fillStyle = `${theme.secondary}bc`;
    for (let x = trap.x; x < trap.x + trap.w; x += 15) {
      ctx.beginPath(); ctx.moveTo(x, trap.y + trap.h); ctx.lineTo(x + 7.5, trap.y - 3 - 2 * Math.sin(t * 4 + x)); ctx.lineTo(x + 15, trap.y + trap.h); ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = theme.secondary;
    ctx.beginPath(); ctx.moveTo(trap.x, trap.y + trap.h); ctx.lineTo(trap.x + trap.w, trap.y + trap.h); ctx.stroke();
  }

  for (const bit of theme.bits) {
    if (bit.taken) continue;
    const wave = Math.sin(t * 4 + bit.x) * 5;
    ctx.save(); ctx.translate(bit.x, bit.y + wave); ctx.rotate(t * 1.4);
    ctx.fillStyle = theme.color;
    ctx.shadowColor = theme.color; ctx.shadowBlur = 17;
    ctx.beginPath(); ctx.moveTo(0, -11); ctx.lineTo(9, 0); ctx.lineTo(0, 11); ctx.lineTo(-9, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.fillRect(-2, -3, 4, 6);
    ctx.restore();
  }

  for (const terminal of theme.terminals) {
    const active = terminal.fixed;
    const blink = Math.sin(t * 3 + terminal.x) * 2;
    ctx.save(); ctx.translate(terminal.x, terminal.y);
    ctx.shadowColor = active ? "#51f1bc" : theme.color;
    ctx.shadowBlur = active ? 20 : 12;
    ctx.fillStyle = active ? "#173d3a" : "#122c40";
    ctx.strokeStyle = active ? "#60f3bc" : theme.color;
    ctx.lineWidth = 2.5;
    rounded(ctx, -29, -44, 58, 68, 8); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#061c2a"; rounded(ctx, -21, -34, 42, 35, 5); ctx.fill();
    ctx.fillStyle = active ? "#6bf3c5" : theme.color;
    ctx.fillRect(-14, -23, 28, 3);
    if (active) { ctx.fillRect(-11, -14, 22, 4); ctx.fillRect(-8, -7, 16, 3); }
    else { ctx.fillRect(-12, -14 + blink, 9, 4); ctx.fillRect(2, -14 - blink, 10, 4); }
    ctx.fillStyle = active ? "#68ffc1" : theme.secondary;
    ctx.fillRect(-18, 9, 36, 5);
    glowText(ctx, active ? "FIXED ✓" : "! REPAIR", -32, -56, active ? "#6bf3c5" : theme.color, 10);
    ctx.restore();
  }

  for (const enemy of theme.glitches) {
    if (!enemy.alive) continue;
    const bob = Math.sin(t * 6 + enemy.phase) * 4;
    ctx.save(); ctx.translate(enemy.x, enemy.y + bob);
    ctx.shadowColor = theme.secondary; ctx.shadowBlur = 13;
    ctx.fillStyle = "#7b4eca";
    ctx.strokeStyle = "#e3a8ff";
    ctx.lineWidth = 2.5;
    rounded(ctx, -21, -25, 42, 35, 10); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#120e28";
    ctx.fillRect(-12, -13, 8, 8); ctx.fillRect(5, -13, 8, 8);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-11, -12, 3, 3); ctx.fillRect(7, -12, 3, 3);
    ctx.strokeStyle = "#ffc9f7"; ctx.beginPath(); ctx.moveTo(-7, 3); ctx.lineTo(8, 3); ctx.stroke();
    ctx.restore();
  }

  // Exit only unlocks when all three workstations have been repaired.
  const clear = g.repaired === theme.terminals.length;
  const exitX = WORLD_W - 94;
  ctx.save(); ctx.translate(exitX, 461);
  ctx.shadowColor = clear ? theme.color : "#596a85";
  ctx.shadowBlur = clear ? 32 : 9;
  ctx.strokeStyle = clear ? theme.color : "#77819c";
  ctx.lineWidth = 7;
  ctx.beginPath(); ctx.ellipse(0, 0, 37, 70, 0, 0, TAU); ctx.stroke();
  ctx.strokeStyle = clear ? `${theme.secondary}cc` : "#374559";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(0, 0, 24 + Math.sin(t * 4) * 3, 56, 0, 0, TAU); ctx.stroke();
  ctx.fillStyle = clear ? `${theme.color}30` : "#121b2a";
  ctx.beginPath(); ctx.ellipse(0, 0, 22, 54, 0, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0;
  glowText(ctx, clear ? "EXIT OPEN" : "LOCKED", -39, -89, clear ? theme.color : "#7f8b9a", 12);
  ctx.restore();

  drawRobot(ctx, g, t);
  ctx.restore();
}

function drawRobot(ctx: CanvasRenderingContext2D, game: RescueGame, t: number) {
  const p = game.player;
  if (p.invuln > 0 && Math.floor(p.invuln * 14) % 2 === 1) ctx.globalAlpha = .37;
  const moving = Math.abs(p.vx) > 25;
  const dash = p.dashTime > 0;
  const bob = p.onGround && moving ? Math.sin(t * 17) * 2.5 : Math.sin(t * 3) * .6;
  const x = p.x + PLAYER_W / 2, y = p.y + PLAYER_H / 2 + bob;
  ctx.save(); ctx.translate(x, y); ctx.scale(p.facing, 1);
  if (dash) {
    ctx.shadowColor = game.level.color; ctx.shadowBlur = 26;
    ctx.fillStyle = `${game.level.color}5c`;
    for (let i = 1; i < 4; i++) rounded(ctx, -14 - i * 16, -14, 28, 33, 8), ctx.fill();
  }
  ctx.fillStyle = "#6cb6ed";
  rounded(ctx, -16, -5, 32, 27, 9); ctx.fill();
  ctx.fillStyle = "#0e3560";
  rounded(ctx, -11, 2, 22, 13, 6); ctx.fill();
  ctx.fillStyle = "#b8ffff";
  ctx.font = "bold 8px system-ui"; ctx.textAlign = "center"; ctx.fillText("JRC", 0, 11);
  const legStep = p.onGround && moving ? Math.sin(t * 17) * 6 : 0;
  ctx.fillStyle = "#8be2fd";
  rounded(ctx, -13, 18 + legStep, 10, 10, 3); ctx.fill();
  rounded(ctx, 4, 18 - legStep, 10, 10, 3); ctx.fill();
  ctx.fillStyle = "#48b9ec";
  rounded(ctx, -20, -3, 8, 16, 4); ctx.fill();
  rounded(ctx, 12, -3, 8, 16, 4); ctx.fill();
  ctx.fillStyle = "#8ff2ff";
  ctx.shadowColor = game.level.color; ctx.shadowBlur = dash ? 20 : 10;
  rounded(ctx, -20, -27, 40, 31, 12); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#0b233d";
  rounded(ctx, -15, -22, 30, 21, 10); ctx.fill();
  ctx.fillStyle = "#f6ffff";
  ctx.beginPath(); ctx.ellipse(-7, -13, 5.7, 6, 0, 0, TAU); ctx.ellipse(7, -13, 5.7, 6, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = "#153f6b";
  ctx.fillRect(-6, -13, 3, 4); ctx.fillRect(8, -13, 3, 4);
  ctx.strokeStyle = "#5cf4f7"; ctx.lineWidth = 1.7;
  ctx.beginPath(); ctx.arc(0, -10, 5, .3, Math.PI - .3); ctx.stroke();
  ctx.strokeStyle = "#d9ffff"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, -27); ctx.lineTo(0, -34); ctx.stroke();
  ctx.fillStyle = "#75ffff"; ctx.beginPath(); ctx.arc(0, -36, 3.8, 0, TAU); ctx.fill();
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawSparks(ctx: CanvasRenderingContext2D, sparks: Spark[], camera: number) {
  ctx.save(); ctx.translate(-camera, 0);
  for (const p of sparks) {
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.restore(); ctx.globalAlpha = 1;
}

export function renderRescue(ctx: CanvasRenderingContext2D, game: RescueGame, sparks: Spark[]) {
  const t = game.gameClock;
  ctx.save();
  if (game.shake > 0) ctx.translate(Math.sin(t * 93) * game.shake * .55, Math.cos(t * 81) * game.shake * .35);
  drawBackground(ctx, game, t);
  drawWorld(ctx, game, t);
  drawSparks(ctx, sparks, game.camera);
  if (game.mode === "transition") {
    ctx.fillStyle = "#051122ba"; ctx.fillRect(0, 0, game.viewWidth, VIEW_H);
    ctx.fillStyle = game.level.color;
    ctx.font = "900 45px ui-sans-serif,system-ui"; ctx.textAlign = "center";
    ctx.fillText(game.levelIndex === 2 ? "ALL SYSTEMS RESTORED" : "SYSTEM RESTORED", game.viewWidth / 2, 280);
    ctx.fillStyle = "#a5c7dc"; ctx.font = "700 17px ui-monospace,monospace";
    ctx.fillText(game.levelIndex === 2 ? "JRC BOT SAVED THE DAY" : "LOADING NEXT DISTRICT...", game.viewWidth / 2, 325);
  }
  ctx.restore();
}

export function spawnSparks(sparks: Spark[], x: number, y: number, color: string, count: number) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * TAU, speed = 40 + Math.random() * 190, life = .24 + Math.random() * .58;
    sparks.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, life, max: life, color, size: 2 + Math.random() * 3 });
  }
  if (sparks.length > 125) sparks.splice(0, sparks.length - 125);
}

export function advanceSparks(sparks: Spark[], dt: number) {
  for (let i = sparks.length - 1; i >= 0; i--) {
    const p = sparks[i]; p.life -= dt;
    if (p.life <= 0) { sparks.splice(i, 1); continue; }
    p.x += p.vx * dt; p.y += p.vy * dt; p.vy += dt * 190;
  }
}
