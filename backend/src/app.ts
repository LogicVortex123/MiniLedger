import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { MulterError } from 'multer';
import authRoutes from './routes/auth';
import loanRoutes from './routes/loans';

// The app is created here and started in server.ts,
// so tests can use it without opening a real network port.
const app = express();

app.use(cors()); // allow requests from the mobile app
app.use(express.json()); // read JSON request bodies into req.body
app.use('/uploads', express.static('uploads')); // serve receipt images

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);

// Any other URL
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler: Express 5 sends errors thrown in async routes here automatically.
// It must have 4 parameters so Express knows it is an error handler.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Receipt must be 5 MB or smaller' : err.message;
    res.status(400).json({ error: message });
    return;
  }

  // express.json() throws a SyntaxError when the body is not valid JSON.
  if (err instanceof SyntaxError) {
    res.status(400).json({ error: 'Request body is not valid JSON' });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

export default app;
