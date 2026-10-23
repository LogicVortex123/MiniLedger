import 'dotenv/config'; // load .env first, before anything reads process.env
import app from './app';

const PORT = Number(process.env.PORT) || 4000;

// Stop early with a clear message instead of failing on the first request.
if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  console.error('DATABASE_URL and JWT_SECRET must be set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

// '0.0.0.0' accepts connections from other devices on the Wi-Fi (your phone),
// not only from this laptop.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`MiniLedger API running on http://localhost:${PORT}`);
});
