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
  test('Authenticated request, text type, fragment data found', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('Hello-World');

    //No extension
    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    //Text extension
    const res3 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.txt`)
      .auth('user1@email.com', 'password1');

    //No supported extension
    const res4 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.json`)
      .auth('user1@email.com', 'password1');

    expect(res2.text).toBe('Hello-World');
    expect(res3.text).toBe('Hello-World');
    expect(res4.statusCode).toBe(415);
  });

  //MARKDOWN
  test('Authenticated request, markdown type, fragment data found', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/markdown')
      .send('# Hello-World');

    //No extension
    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    //Markdown extension
    const res3 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.md`)
      .auth('user1@email.com', 'password1');

    //Html extension
    const res4 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.html`)
      .auth('user1@email.com', 'password1');

    //Text extension
    const res5 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.txt`)
      .auth('user1@email.com', 'password1');

    //No supported extension
    const res6 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.png`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res3.statusCode).toBe(200);
    expect(res4.statusCode).toBe(200);
    expect(res5.statusCode).toBe(200);
    expect(res6.statusCode).toBe(415);
  });

  //TEXT/HTML
  test('Authenticated request, html type, fragment data found', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/html')
      .send('<h1>Hello-World</h1>');

    //No extension
    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    //html extension
    const res3 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.html`)
      .auth('user1@email.com', 'password1');

    //txt extension
    const res4 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.txt`)
      .auth('user1@email.com', 'password1');

    //No supported extension
    const res5 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.md`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res3.statusCode).toBe(200);
    expect(res4.statusCode).toBe(200);
    expect(res5.statusCode).toBe(415);
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

    //No extension
    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    //.json extension
    const res3 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.json`)
      .auth('user1@email.com', 'password1');

    //.txt extension
    const res4 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.txt`)
      .auth('user1@email.com', 'password1');

    //Unsupported extension
    const res5 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.png`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(200);
    expect(res3.statusCode).toBe(200);
    expect(res4.statusCode).toBe(200);
    expect(res5.statusCode).toBe(415);
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
