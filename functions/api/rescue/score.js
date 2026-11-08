// No API keys live in client code or in this repository. D1 is a server-only binding.
const json = (payload, status = 200) => new Response(JSON.stringify(payload), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" } });

export async function onRequestPost({ request, env }) {
  if (!env.RESCUE_DB) return json({ error: "Leaderboard not configured" }, 503);
  if (request.headers.get("origin") !== new URL(request.url).origin || !request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Invalid origin or content type" }, 403);
  if (Number(request.headers.get("content-length") || 0) > 1024) return json({ error: "Payload too large" }, 413);

  let body;
  try { const raw = await request.text(); if (raw.length > 1024) return json({ error: "Payload too large" }, 413); body = JSON.parse(raw); } catch { return json({ error: "Invalid JSON" }, 400); }
  const { runId, playerId, score, seconds, levels } = body || {};
  const name = typeof body?.name === "string" ? body.name.replace(/[^\p{L}\p{N} _.\-]/gu, "").trim().replace(/\s+/g, " ").slice(0, 18) : "";
  if (typeof runId !== "string" || !/^[0-9a-f-]{36}$/i.test(runId) || typeof playerId !== "string" || !/^[\w-]{8,80}$/.test(playerId) || !name || !Number.isInteger(score) || score < 1000 || score > 20000 || !Number.isInteger(seconds) || seconds < 50 || seconds > 3600 || levels !== 3) return json({ error: "Invalid game result" }, 400);

  const now = Math.floor(Date.now() / 1000);
  try {
    const run = await env.RESCUE_DB.prepare("SELECT player_id, started_at, completed_at FROM rescue_runs WHERE id = ?").bind(runId).first();
    if (!run || run.player_id !== playerId || run.completed_at != null) return json({ error: "Run ticket missing or already submitted" }, 409);
    const wallClock = now - Number(run.started_at);
    if (wallClock < 45 || wallClock > 7200 || seconds > wallClock + 15) return json({ error: "Unverifiable run duration" }, 422);

    // Claim ticket atomically before changing the public scores; a replay cannot claim it twice.
    const claimed = await env.RESCUE_DB.prepare("UPDATE rescue_runs SET completed_at = ? WHERE id = ? AND player_id = ? AND completed_at IS NULL").bind(now, runId, playerId).run();
    if (!Number(claimed.meta?.changes)) return json({ error: "Run already submitted" }, 409);
    await env.RESCUE_DB.prepare("INSERT INTO rescue_scores(player_id, name, score, seconds, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(player_id) DO UPDATE SET name = excluded.name, score = excluded.score, seconds = excluded.seconds, updated_at = excluded.updated_at WHERE excluded.score > rescue_scores.score OR (excluded.score = rescue_scores.score AND excluded.seconds < rescue_scores.seconds)").bind(playerId, name, score, seconds, now).run();
    return json({ saved: true });
  } catch { return json({ error: "Could not record score" }, 503); }
}

export function onRequest() { return json({ error: "Method not allowed" }, 405); }
