// tests/unit/app.test.js
const request = require('supertest');

// Get Express app object
const app = require('../../src/app');

//Testing
describe('/ not found page', () => {
  test('should return 404 response', async () => {
    const res = await request(app).get('/routeNotExist');
    expect(res.statusCode).toBe(404);
  });
});
