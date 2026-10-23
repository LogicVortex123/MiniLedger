# MiniLedger

A small app to keep track of money you lend to friends.

- Log in with your phone number and a one-time password (OTP)
- Add an entry: friend's name, amount, due date and an optional receipt photo
- See every entry, with **overdue** ones highlighted in red and **repaid** ones in green
- Mark an entry as repaid with one tap
- A summary card shows total lent, total repaid, outstanding and overdue amounts

## Screenshots

| Login | Home | Add entry |
| --- | --- | --- |
| ![Login](docs/login.png) | ![Home](docs/home.png) | ![Add entry](docs/add.png) |

## Demo video

▶️ [Watch the 2–3 minute demo](https://link-to-your-video)

## Tech stack

| Part | Technology |
| --- | --- |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL with the `pg` driver (raw parameterised SQL, no ORM) |
| Validation | Zod |
| Auth | Mock OTP + JWT (`jsonwebtoken`, 7-day expiry) |
| File upload | Multer (receipt images saved to `backend/uploads/`) |
| Tests | Jest, ts-jest, Supertest |
| App | React Native with Expo (TypeScript), `expo-image-picker` |

## Project structure

```
MiniLedger/
├── backend/
│   ├── src/
│   │   ├── server.ts            starts the server
│   │   ├── app.ts               Express app: middleware, routes, error handler
│   │   ├── db.ts                PostgreSQL connection pool
│   │   ├── schema.sql           tables
│   │   ├── migrate.ts           runs schema.sql
│   │   ├── middleware/auth.ts   checks the login token
│   │   ├── routes/auth.ts       OTP login
│   │   ├── routes/loans.ts      loan entries and summary
│   │   └── __tests__/api.test.ts
│   └── .env.example
└── mobile/
    ├── App.tsx                  chooses which screen to show
    └── src/
        ├── api.ts               API address, types, request helper
        ├── styles.ts            shared styles
        └── screens/             Login, Home, AddEntry
```

## Run the backend

You need **Node.js 20+** and **PostgreSQL** installed.

1. Create the database (in a terminal, or use pgAdmin):

   ```
   psql -U postgres -c "CREATE DATABASE miniledger"
   ```

2. Install packages and set up the environment file:

   ```
   cd backend
   npm install
   copy .env.example .env
   ```

   Open `.env` and set your Postgres password in `DATABASE_URL` and a long random `JWT_SECRET`.

3. Create the tables and start the server:

   ```
   npm run migrate
   npm run dev
   ```

   You should see `MiniLedger API running on http://localhost:4000`.
   Check it in a browser: http://localhost:4000/health → `{"status":"ok"}`

4. Run the tests (they don't need the database):

   ```
   npm test
   ```

## Run the app

1. Find your laptop's IP address: run `ipconfig` and copy the **IPv4 Address** under your Wi-Fi adapter.
2. Put it in `mobile/src/api.ts`:

   ```ts
   export const API_URL = 'http://<your-ip>:4000';
   ```

3. Start the app:

   ```
   cd mobile
   npm install
   npx expo start
   ```

4. Install **Expo Go** on your phone (same Wi-Fi as the laptop) and scan the QR code.
5. Log in with any valid Indian mobile number. **The OTP is printed in the backend terminal** as `[MOCK OTP] 98xxxxxxxx -> 123456`.

**If the app can't reach the server:** check that the phone and laptop are on the same Wi-Fi, that `API_URL` matches the current IP, and that Windows Firewall allows Node.js on private networks.

## API

All `/api/loans` routes need the header `Authorization: Bearer <token>`.

| Method | Path | Body | Response |
| --- | --- | --- | --- |
| GET | `/health` | – | `200 { status: "ok" }` |
| POST | `/api/auth/request-otp` | `{ phone }` | `200`, OTP printed in the server log · `400` invalid phone |
| POST | `/api/auth/verify-otp` | `{ phone, otp }` | `200 { token }` · `400` bad input · `401` wrong/expired OTP |
| GET | `/api/loans` | – | `200` list of loans (each with computed `isOverdue`) |
| GET | `/api/loans/summary` | – | `200 { totalLent, totalRepaid, outstanding, overdueAmount }` |
| POST | `/api/loans` | JSON or multipart: `friendName`, `amount`, `dueDate` (YYYY-MM-DD), optional `receipt` image (max 5 MB) | `201` the new loan · `400` validation error |
| PATCH | `/api/loans/:id/repay` | – | `200` the updated loan · `404` not found or already repaid |

Errors always look like `{ "error": "message" }`. Status codes used: 200, 201, 400, 401, 404, 500.

## Design decisions

- **Overdue is computed, never stored.** `isOverdue = NOT is_repaid AND due_date < CURRENT_DATE` is calculated in every query, so it can never be out of date.
- **One query for the summary.** `SUM(...) FILTER (WHERE ...)` gives all four totals in a single pass; `COALESCE(..., 0)` returns 0 instead of `null` when there are no loans.
- **Dates stay as text.** Postgres `DATE` values are returned as `'YYYY-MM-DD'` strings. The default conversion to a JavaScript `Date` shifts the date by a day in India (UTC+5:30).
- **Money is `NUMERIC(12,2)`**, never a floating-point column, so amounts are stored exactly.
- **Every loan query filters by `user_id`** taken from the verified token, so users can only see and change their own entries.
- **Parameterised SQL (`$1`, `$2`)** everywhere, so user input can never change a query (no SQL injection).
- **Validation on both sides:** the app checks input for instant feedback, and the server checks again with Zod because it can't trust the client.
- **`app.ts` is separate from `server.ts`** so tests can call the app with Supertest without opening a port or touching the database.
- **No navigation library:** with only three screens, a single `screen` state in `App.tsx` is simpler.

## What I'd improve

- Send real SMS OTPs (e.g. via an SMS provider) and limit how often an OTP can be requested
- Store OTPs in Redis or the database so they survive a server restart
- Save the login token on the phone (e.g. `expo-secure-store`) so users stay logged in
- A proper date picker instead of typing `YYYY-MM-DD`
- Store receipts in cloud storage (e.g. S3) instead of the server's disk
- Edit and delete entries, and partial repayments
- Integration tests against a test database
