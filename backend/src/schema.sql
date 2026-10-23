-- MiniLedger database schema.
-- "IF NOT EXISTS" makes it safe to run the migration more than once.

CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  phone      VARCHAR(15) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loans (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_name VARCHAR(100) NOT NULL,
  amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  due_date    DATE NOT NULL,
  is_repaid   BOOLEAN NOT NULL DEFAULT FALSE,
  repaid_at   TIMESTAMPTZ,
  receipt_url TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Every loan query filters by user_id, so index it.
CREATE INDEX IF NOT EXISTS idx_loans_user_id ON loans(user_id);
