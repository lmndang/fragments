const request = require('supertest');

const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('Unauthenticated requests are denied', () =>
    request(app).delete(`/v1/fragments/randomID`).expect(401));

  test('Authenticated request, no fragments ID found', async () => {
    const res = await request(app)
      .delete('/v1/fragments/randomID')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });

  test('Authenticated request, fragments ID found, delete the fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('Hello-World');

    const res2 = await request(app)
      .delete(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
  });
});
