CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  event TEXT NOT NULL,
  page TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  referrer TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_event ON events(event);
