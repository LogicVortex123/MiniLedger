import 'dotenv/config'; // load .env before db.ts reads DATABASE_URL
import fs from 'fs';
import path from 'path';
import { pool } from './db';

// Reads schema.sql and runs it against the database to create the tables.
async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('Migration complete: tables are ready.');
}

migrate()
  .catch((err) => {
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end()); // close connections so the script can exit
