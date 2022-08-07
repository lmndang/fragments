// tests/unit/getId.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:Id', () => {
  //const ownerId = '11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a';

  test('Unauthenticated requests are denied', () =>
    request(app).get(`/v1/fragments/randomID`).expect(401));

  test('Authenticated request, no fragments found', async () => {
    const res = await request(app)
      .get('/v1/fragments/randomID')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });

  //TEXT
  test('Authenticated request, text type, fragment data found, no extension', async () => {
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

  test('Authenticated request, text type, .txt extension', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('Hello-World');

    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.txt`)
      .auth('user1@email.com', 'password1');
    expect(res2.text).toBe('Hello-World');
  });

  test('Authenticated request, text type, not supported file', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('Hello-World');

    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.json`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(415);
  });

  //MARKDOWN
  test('Authenticated request, markdown type, fragment data found, no extension', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/markdown')
      .send('# Hello-World');

    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
  });

  test('Authenticated request, markdown type, fragment data found, return markdown', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/markdown')
      .send('# Hello-World');

    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.md`)
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
  });

  test('Authenticated request, markdown type, fragment data found, return html', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/markdown')
      .send('# Hello-World');

    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.html`)
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
  });

  test('Authenticated request, markdown type, fragment data found, return txt', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/markdown')
      .send('# Hello-World');

    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.txt`)
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
  });

  test('Authenticated request, markdown type, fragment data found, not supported type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/markdown')
      .send('# Hello-World');

    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.png`)
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(415);
  });

  //JSON
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

  //IMAGE
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
