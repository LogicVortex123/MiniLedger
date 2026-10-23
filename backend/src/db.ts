import { Pool, types } from 'pg';

// DATE columns (type id 1082): keep them as plain 'YYYY-MM-DD' strings.
// By default pg turns a DATE into a JS Date at local midnight. In India (UTC+5:30)
// that becomes the previous day once it is sent as UTC JSON, e.g. 2025-06-10 -> 2025-06-09T18:30:00Z.
types.setTypeParser(1082, (value) => value);

// NUMERIC columns (type id 1700): pg returns them as strings so no precision is lost.
// Our amounts have at most 2 decimals, so a normal JS number is safe and easier to use.
types.setTypeParser(1700, (value) => parseFloat(value));

// A pool keeps a few database connections open and reuses them across requests.
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
