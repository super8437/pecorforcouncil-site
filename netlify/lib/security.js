const fetch = require('node-fetch');

// Shared in-memory rate limiter
const rateLimitMap = new Map();
const RATE_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '5', 10);

function checkRateLimit(ip) {
  const now = Date.now();
  let entry = rateLimitMap.get(ip);
  if (!entry || entry.expires < now) {
    entry = { count: 0, expires: now + RATE_WINDOW_MS };
  }
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX;
}

async function verifyCaptcha(token) {
  const secret = process.env.HCAPTCHA_SECRET;
  if (!secret || !token) return false;
  const params = new URLSearchParams({ response: token, secret });
  try {
    const res = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    console.error('Captcha verification failed', err);
    return false;
  }
}

module.exports = {
  checkRateLimit,
  verifyCaptcha
};
