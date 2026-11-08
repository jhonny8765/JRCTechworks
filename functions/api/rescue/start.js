// A short-lived, single-use run ticket reduces casual forged leaderboard submissions.
// Player identity is random per browser and is not an authentication credential.
const json = (payload, status = 200) => new Response(JSON.stringify(payload), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" } });

export async function onRequestPost({ request, env }) {
  if (!env.RESCUE_DB) return json({ error: "Leaderboard not configured" }, 503);
  const origin = request.headers.get("origin");
  if (origin !== new URL(request.url).origin || !request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Invalid origin or content type" }, 403);
  if (Number(request.headers.get("content-length") || 0) > 1024) return json({ error: "Payload too large" }, 413);

  let body;
  try { const raw = await request.text(); if (raw.length > 1024) return json({ error: "Payload too large" }, 413); body = JSON.parse(raw); } catch { return json({ error: "Invalid JSON" }, 400); }
  const playerId = body?.playerId;
  if (typeof playerId !== "string" || !/^[\w-]{8,80}$/.test(playerId)) return json({ error: "Invalid player ID" }, 400);
  const now = Math.floor(Date.now() / 1000);
  try {
    const existing = await env.RESCUE_DB.prepare("SELECT COUNT(*) AS count FROM rescue_runs WHERE player_id = ? AND started_at > ?").bind(playerId, now - 90).first();
    if (Number(existing?.count || 0) >= 3) return json({ error: "Too many runs. Try again soon." }, 429);
    const runId = crypto.randomUUID();
    await env.RESCUE_DB.prepare("INSERT INTO rescue_runs(id, player_id, started_at) VALUES(?, ?, ?)").bind(runId, playerId, now).run();
    // Cheap probabilistic pruning: avoid unbounded single-use ticket storage.
    if (Math.random() < 0.025) await env.RESCUE_DB.prepare("DELETE FROM rescue_runs WHERE started_at < ?").bind(now - 86400).run();
    return json({ runId });
  } catch { return json({ error: "Score service temporarily unavailable" }, 503); }
}

export function onRequest() { return json({ error: "Method not allowed" }, 405); }
