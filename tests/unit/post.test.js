const request = require('supertest');
const app = require('../../src/app');

describe('POST v1/fragments', () => {
  test('Unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  test('Authenticated user can create a fragment', async () => {
    const hashedEmail = '11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a';

    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('Hello-World');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.ownerId).toEqual(hashedEmail);
    expect(res.body.fragment.size).toEqual(11);
  });

  test('Authenticated user create unsupported content type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'application/json')
      .send({ Hello: 'World' });

    expect(res.statusCode).toBe(415);
  });
});
