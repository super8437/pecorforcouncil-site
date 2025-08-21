const querystring = require('querystring');
const { checkRateLimit, verifyCaptcha } = require('../lib/security');

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
