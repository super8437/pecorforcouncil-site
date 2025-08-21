process.env.RATE_LIMIT_MAX = '1';
const contact = require('../netlify/functions/contact');

test('requires captcha after rate limit exceeded', async () => {
  const event = {
    httpMethod: 'POST',
    body: 'name=Sam&email=sam%40example.com&message=Hi',
    headers: { 'x-forwarded-for': '127.0.0.1' }
  };
  const first = await contact.handler(event);
  expect(first.statusCode).toBe(303);
  const second = await contact.handler(event);
  expect(second.statusCode).toBe(429);
  const body = JSON.parse(second.body);
  expect(body.captcha_required).toBe(true);
});
