// tests/unit/getId.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:Id', () => {
  //const ownerId = '11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a';

  test('Unauthenticated requests are denied', () =>
    request(app).get(`/v1/fragments/randomID`).expect(401));

  test('Authenticated request, not supported file', async () => {
    const res = await request(app)
      .get('/v1/fragments/randomID.json')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
  });

  test('Authenticated request, supported file, no fragments found', async () => {
    const res = await request(app)
      .get('/v1/fragments/randomID')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });

  test('Authenticated request, supported file, fragment data found, return html', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('Hello-World');

    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.html`)
      .auth('user1@email.com', 'password1');
    expect(res2.text).toBe('<h1>Hello-World</h1>');
  });

  test('Authenticated request, supported file, fragment data found, return text', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('Hello-World');

    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(res2.text).toBe('Hello-World');
  });

  test('Authenticated request, supported file, fragment data found, return markdown', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('Hello-World');

    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.md`)
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
  });

  test('Authenticated request, supported file, fragment data found, return json', async () => {
    const data = {
      hello: 'Hi',
      name: 'Ethan',
      age: 22,
    };

    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'application/json')
      .send(JSON.stringify(data));

    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
  });

  test('Authenticated request, supported file, fragment data found, return image', async () => {
    const filePath = '../integration/amazon.png';

    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'image/png')
      .send(filePath);

    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
  });
});
