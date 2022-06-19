// tests/unit/getIdInfo.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  test('Unauthenticated requests are denied', () =>
    request(app).get(`/v1/fragments/randomID/info`).expect(401));

  test('Authenticated user with invalid ID', async () => {
    const res = await request(app)
      .get(`/v1/fragments/randomID/info`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(404);
  });

  test('Authenticated user with valid ID', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('Hello-World');

    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}/info`)
      .auth('user1@email.com', 'password1');

    expect(res2.fragment).toBe(res.fragment);
  });
});
