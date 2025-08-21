const querystring = require('querystring');
const fetch = require('node-fetch');

// Simple in-memory rate limiter per IP
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

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const ip = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
  const data = querystring.parse(event.body);
  const errors = [];

  const captchaToken = data['h-captcha-response'];
  const needsCaptcha = checkRateLimit(ip);

  if (needsCaptcha) {
    if (!captchaToken) {
      return {
        statusCode: 429,
        body: JSON.stringify({ message: 'CAPTCHA required', captcha_required: true }),
      };
    }
    const validCaptcha = await verifyCaptcha(captchaToken);
    if (!validCaptcha) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid CAPTCHA' }),
      };
    }
  }

  if (data['bot-field']) {
    errors.push('Spam detected');
  }

  ['name', 'email', 'message'].forEach((field) => {
    if (!data[field]) {
      errors.push(`Missing ${field}`);
    }
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push('Invalid email');
  }

  if (errors.length > 0) {
    console.warn('Invalid contact attempt', { errors, data });
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid submission', errors }),
    };
  }

  console.log('Contact submission accepted', { name: data.name, email: data.email });

  return {
    statusCode: 303,
    headers: { Location: '/thanks.html' },
    body: ''
  };
};
