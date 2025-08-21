const querystring = require('querystring');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const data = querystring.parse(event.body);
  const errors = [];

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
