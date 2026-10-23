import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// A normal Express request, plus the id of the logged-in user.
export interface AuthRequest extends Request {
  userId?: number;
}

// The data we put inside the token at login (see routes/auth.ts).
interface TokenPayload {
  userId: number;
}

// Lets the request through only if it carries a valid "Authorization: Bearer <token>" header.
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Please log in first' });
    return;
  }

  const token = header.slice('Bearer '.length);

  try {
    // verify() checks the signature and expiry, and throws if either is wrong.
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Session expired, please log in again' });
  }
}
