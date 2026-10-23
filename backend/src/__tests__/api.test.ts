import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';

// None of these tests reach the database: each request is rejected
// (or answered from memory) before any SQL runs.

process.env.JWT_SECRET = 'test-secret';

// A real, correctly signed token for user 1, used to get past requireAuth.
const validToken = jwt.sign({ userId: 1 }, 'test-secret');

// Hide the "[MOCK OTP]" logs so the test output stays clean.
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

describe('Auth', () => {
  it('rejects an invalid phone number with 400', async () => {
    const res = await request(app).post('/api/auth/request-otp').send({ phone: '12345' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('sends an OTP for a valid phone number with 200', async () => {
    const res = await request(app).post('/api/auth/request-otp').send({ phone: '9876543210' });
    expect(res.status).toBe(200);
  });

  it('rejects a wrong OTP with 401', async () => {
    await request(app).post('/api/auth/request-otp').send({ phone: '9876543211' });
    // Real OTPs are 100000-999999, so 000000 can never be correct.
    const res = await request(app)
      .post('/api/auth/verify-otp')
      .send({ phone: '9876543211', otp: '000000' });
    expect(res.status).toBe(401);
  });
});

describe('Loans', () => {
  it('rejects a request without a token with 401', async () => {
    const res = await request(app).get('/api/loans');
    expect(res.status).toBe(401);
  });

  it('rejects a fake token with 401', async () => {
    const res = await request(app).get('/api/loans').set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });

  it('rejects a negative amount with 400', async () => {
    const res = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ friendName: 'Rahul', amount: -500, dueDate: '2026-12-01' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/greater than 0/);
  });

  it('rejects a badly formatted due date with 400', async () => {
    const res = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ friendName: 'Rahul', amount: 500, dueDate: '01-12-2026' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/YYYY-MM-DD/);
  });
});
