const request = require('supertest');
const app = require('../../src/app');

describe('POST v1/fragments', () => {
  test('Unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));
});
