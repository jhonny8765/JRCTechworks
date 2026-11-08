-- JRC Bot: System Rescue. D1 stores completed-run tickets and one best score per player.
-- The game, player profile, and rendering remain browser-side, without D1 reads per frame.
CREATE TABLE IF NOT EXISTS rescue_runs (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  completed_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_rescue_runs_player_time ON rescue_runs(player_id, started_at);

CREATE TABLE IF NOT EXISTS rescue_scores (
  player_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 20000),
  seconds INTEGER NOT NULL CHECK (seconds > 0),
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rescue_scores_ranking ON rescue_scores(score DESC, seconds ASC);
