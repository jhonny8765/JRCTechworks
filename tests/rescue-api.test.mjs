import test from "node:test";
import assert from "node:assert/strict";
import { onRequestPost as start } from "../functions/api/rescue/start.js";
import { onRequestPost as finish } from "../functions/api/rescue/score.js";
import { onRequestGet as board } from "../functions/api/rescue/leaderboard.js";

const location = "https://jrc-techworks.pages.dev/api/rescue/start";
const request = (path, body, options = {}) => new Request(`https://jrc-techworks.pages.dev/api/rescue/${path}`, {
  method: "POST", headers: { "content-type": "application/json", origin: options.origin || "https://jrc-techworks.pages.dev" }, body: JSON.stringify(body),
});
const playerId = "a9c48a94-0d88-42bf-b9d8-d28859e939bd";

test("API does not reveal data or accept cross-origin writes", async () => {
  const missing = await start({ request: request("start", { playerId }), env: {} });
  assert.equal(missing.status, 503);
  const foreign = await start({ request: request("start", { playerId }, { origin: "https://evil.example" }), env: { RESCUE_DB: {} } });
  assert.equal(foreign.status, 403);
  const foreignScore = await finish({ request: request("score", { playerId }, { origin: "https://evil.example" }), env: { RESCUE_DB: {} } });
  assert.equal(foreignScore.status, 403);
});

test("API rejects malformed players and oversized payloads before accessing D1", async () => {
  const fakeDb = { prepare: () => { throw new Error("DB should not be used for bad input"); } };
  assert.equal((await start({ request: request("start", { playerId: "a" }), env: { RESCUE_DB: fakeDb } })).status, 400);
  assert.equal((await start({ request: request("start", { playerId, extra: "z".repeat(1200) }), env: { RESCUE_DB: fakeDb } })).status, 413);
  assert.equal((await finish({ request: request("score", { name: "<script>", score: 0 }), env: { RESCUE_DB: fakeDb } })).status, 400);
});

test("fresh runs get tickets, but a device is limited to 3 starts per 90 seconds", async () => {
  let starts = 0;
  const db = { prepare(sql) { return { bind(...args) { return { async first() { return { count: starts }; }, async run() { if (sql.startsWith("INSERT")) starts += 1; return { meta: { changes: 1 } }; } }; } }; } };
  for (let n = 0; n < 3; n++) {
    const response = await start({ request: request("start", { playerId }), env: { RESCUE_DB: db } });
    assert.equal(response.status, 200);
    assert.match((await response.json()).runId, /^[0-9a-f-]{36}$/);
  }
  const fourth = await start({ request: request("start", { playerId }), env: { RESCUE_DB: db } });
  assert.equal(fourth.status, 429);
});

test("completed scores are sanitized and single-use tickets cannot be replayed", async () => {
  const runId = crypto.randomUUID();
  let used = false;
  let submitted = null;
  const db = { prepare(sql) { return { bind(...args) { return {
    async first() { return { player_id: playerId, started_at: Math.floor(Date.now()/1000) - 160, completed_at: used ? Math.floor(Date.now()/1000) : null }; },
    async run() { if (sql.startsWith("UPDATE")) { if (used) return { meta: { changes: 0 } }; used = true; return { meta: { changes: 1 } }; } submitted = args; return { meta: { changes: 1 } }; },
  }; } }; } };
  const input = { runId, playerId, name: "Sam<script>", score: 4300, seconds: 120, levels: 3 };
  const res = await finish({ request: request("score", input), env: { RESCUE_DB: db } });
  assert.equal(res.status, 200);
  assert.equal(submitted?.[1], "Samscript");
  assert.equal((await finish({ request: request("score", input), env: { RESCUE_DB: db } })).status, 409);
});

test("leaderboard returns public names and scores, no private IDs", async () => {
  const db = { prepare(sql) { assert.match(sql, /LIMIT 10/); return { async all() { return { results: [{ name: "Sam", score: 4500, seconds: 140, reached_at: 1000 }] }; } }; } };
  const res = await board({ env: { RESCUE_DB: db } });
  assert.equal(res.status, 200);
  const result = await res.json();
  assert.equal(result.leaders[0].name, "Sam");
  assert.equal(Object.hasOwn(result.leaders[0], "player_id"), false);
});
