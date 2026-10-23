import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { pool } from '../db';

const router = Router();

// phone -> the OTP we sent and when it expires.
// Kept in memory because this is a mock: it is cleared when the server restarts.
const otpStore = new Map<string, { otp: string; expiresAt: number }>();
const OTP_VALID_FOR_MS = 5 * 60 * 1000; // 5 minutes

// Indian mobile number: exactly 10 digits, starting with 6, 7, 8 or 9.
const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number');

const requestOtpSchema = z.object({ phone: phoneSchema });

const verifyOtpSchema = z.object({
  phone: phoneSchema,
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

// POST /api/auth/request-otp  { phone }
router.post('/request-otp', (req, res) => {
  const parsed = requestOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const { phone } = parsed.data;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // always 6 digits
  otpStore.set(phone, { otp, expiresAt: Date.now() + OTP_VALID_FOR_MS });

  // Mock SMS: the OTP is printed in the server terminal instead of being texted.
  console.log(`[MOCK OTP] ${phone} -> ${otp}`);

  res.json({ message: 'OTP sent' });
});

// POST /api/auth/verify-otp  { phone, otp }  ->  { token }
router.post('/verify-otp', async (req, res) => {
  const parsed = verifyOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const { phone, otp } = parsed.data;
  const saved = otpStore.get(phone);

  if (!saved || saved.otp !== otp || saved.expiresAt < Date.now()) {
    res.status(401).json({ error: 'Invalid or expired OTP' });
    return;
  }

  otpStore.delete(phone); // an OTP can only be used once

  // Create the user on first login; on later logins just return the existing id.
  // The "DO UPDATE" is a no-op that makes RETURNING give back the id in both cases.
  const result = await pool.query<{ id: number }>(
    `INSERT INTO users (phone) VALUES ($1)
     ON CONFLICT (phone) DO UPDATE SET phone = EXCLUDED.phone
     RETURNING id`,
    [phone]
  );

  const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });

  res.json({ token });
});

export default router;
