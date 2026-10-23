import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { z } from 'zod';
import { pool } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Every loan route needs a logged-in user.
router.use(requireAuth);

// ---------- Receipt upload (Multer) ----------

// Save files to the "uploads" folder (relative to the backend folder, where the server runs)
// with a unique name so two uploads can never overwrite each other.
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
      return;
    }
    // Reuse MulterError so the error handler in app.ts answers with 400.
    const error = new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname);
    error.message = 'Receipt must be an image';
    cb(error);
  },
});

// ---------- Validation (Zod) ----------

// Checks that a 'YYYY-MM-DD' string is a real calendar date (rejects 2025-02-30).
function isRealDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const createLoanSchema = z.object({
  friendName: z.string().trim().min(1, 'Friend name is required').max(100, 'Friend name is too long'),
  // Form uploads send every field as text, so coerce "500" -> 500.
  amount: z.coerce
    .number({ message: 'Amount must be a number' })
    .positive('Amount must be greater than 0')
    .max(9999999999.99, 'Amount is too large'),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
    .refine(isRealDate, 'Due date is not a real date'),
});

// ---------- SQL helpers ----------

// Columns returned for a loan, renamed to camelCase for the app.
// isOverdue is computed on every read, never stored, so it can never go stale.
// (This is a fixed string written by us, not user input, so putting it in the SQL is safe.)
const LOAN_COLUMNS = `
  id,
  friend_name AS "friendName",
  amount,
  due_date    AS "dueDate",
  is_repaid   AS "isRepaid",
  repaid_at   AS "repaidAt",
  receipt_url AS "receiptUrl",
  created_at  AS "createdAt",
  (NOT is_repaid AND due_date < CURRENT_DATE) AS "isOverdue"`;

// ---------- Routes ----------

// GET /api/loans -> all loans of the logged-in user, unpaid first, earliest due date first.
router.get('/', async (req: AuthRequest, res) => {
  const result = await pool.query(
    `SELECT ${LOAN_COLUMNS}
     FROM loans
     WHERE user_id = $1
     ORDER BY is_repaid, due_date`,
    [req.userId]
  );
  res.json(result.rows);
});

// GET /api/loans/summary -> all four totals in a single query.
// FILTER (WHERE ...) adds up only the matching rows; COALESCE turns "no rows" (NULL) into 0.
router.get('/summary', async (req: AuthRequest, res) => {
  const result = await pool.query(
    `SELECT
       COALESCE(SUM(amount), 0)                                                  AS "totalLent",
       COALESCE(SUM(amount) FILTER (WHERE is_repaid), 0)                         AS "totalRepaid",
       COALESCE(SUM(amount) FILTER (WHERE NOT is_repaid), 0)                     AS "outstanding",
       COALESCE(SUM(amount) FILTER (WHERE NOT is_repaid AND due_date < CURRENT_DATE), 0) AS "overdueAmount"
     FROM loans
     WHERE user_id = $1`,
    [req.userId]
  );
  res.json(result.rows[0]);
});

// POST /api/loans -> add a loan. Accepts JSON, or multipart form data with an optional "receipt" image.
router.post('/', upload.single('receipt'), async (req: AuthRequest, res) => {
  const parsed = createLoanSchema.safeParse(req.body);

  if (!parsed.success) {
    // Don't keep a receipt file for a loan that was never saved.
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const { friendName, amount, dueDate } = parsed.data;
  // Store a relative path; the app adds the server address in front of it.
  const receiptUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const result = await pool.query(
    `INSERT INTO loans (user_id, friend_name, amount, due_date, receipt_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${LOAN_COLUMNS}`,
    [req.userId, friendName, amount, dueDate, receiptUrl]
  );

  res.status(201).json(result.rows[0]);
});

// PATCH /api/loans/:id/repay -> mark a loan as repaid.
router.patch('/:id/repay', async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Invalid loan id' });
    return;
  }

  // The WHERE clause makes sure the loan belongs to this user and is not already repaid.
  const result = await pool.query(
    `UPDATE loans
     SET is_repaid = TRUE, repaid_at = NOW()
     WHERE id = $1 AND user_id = $2 AND is_repaid = FALSE
     RETURNING ${LOAN_COLUMNS}`,
    [id, req.userId]
  );

  if (result.rowCount === 0) {
    res.status(404).json({ error: 'Loan not found or already repaid' });
    return;
  }

  res.json(result.rows[0]);
});

export default router;
