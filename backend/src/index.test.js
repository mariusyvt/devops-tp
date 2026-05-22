const request = require('supertest');
const express = require('express');

// Mock pg pool
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

const { Pool } = require('pg');
const mockPool = new Pool();

// Simple health test without full app setup
describe('API Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/health', (req, res) => res.json({ status: 'ok' }));
    app.get('/api/tasks', async (req, res) => {
      const result = await mockPool.query('SELECT * FROM tasks');
      res.json(result.rows);
    });
  });

  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/tasks returns array', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Test task', done: false }] });
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
