// This endpoint is only called when a player explicitly opens the leaderboard.
const headers = { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=20, s-maxage=20", "x-content-type-options": "nosniff" };
export async function onRequestGet({ env }) {
  if (!env.RESCUE_DB) return new Response(JSON.stringify({ error: "Leaderboard not configured" }), { status: 503, headers });
  try {
    const result = await env.RESCUE_DB.prepare("SELECT name, score, seconds, updated_at AS reached_at FROM rescue_scores ORDER BY score DESC, seconds ASC LIMIT 10").all();
    return new Response(JSON.stringify({ leaders: result.results || [] }), { headers });
  } catch { return new Response(JSON.stringify({ error: "Leaderboard temporarily unavailable" }), { status: 503, headers }); }
}
export function onRequest() { return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers }); }
