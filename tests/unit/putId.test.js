const request = require('supertest');
const app = require('../../src/app');

describe('PUT v1/fragments', () => {
  test('Unauthenticated requests are denied', () => request(app).put('/v1/fragments').expect(401));

  test('Authenticated request, no fragments ID found', async () => {
    const res = await request(app)
      .put('/v1/fragments/randomID')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('Hello-World');
    expect(res.statusCode).toBe(404);
  });

  test('Authenticated user update an existing fragment but not the same type', async () => {
    const data = {
      hello: 'Hi',
      name: 'Ethan',
      age: 22,
    };

    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('Hello-World');

    const res2 = await request(app)
      .put(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'application/json')
      .send(JSON.stringify(data));

    expect(res2.statusCode).toBe(400);
  });

  test('Authenticated user update an existing fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('Hello-World');

    const res2 = await request(app)
      .put(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('Hello-World 2');

    expect(res2.statusCode).toBe(200);
    expect(res2.body.status).toBe('ok');
    expect(res2.body.fragment.id).toEqual(res.body.fragment.id);
  });
});
