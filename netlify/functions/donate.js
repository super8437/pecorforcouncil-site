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

  // Honeypot to deter bots
  if (data['bot-field']) {
    errors.push('Spam detected');
  }

  // Validate amount between 1 and 600
  const amount = parseFloat(data.amount);
  if (isNaN(amount) || amount < 1 || amount > 600) {
    errors.push('Invalid amount');
  }

  const requiredFields = ['first_name', 'last_name', 'email', 'addr1', 'city', 'state', 'zip', 'affirm_citizen', 'affirm_ownfunds'];
  requiredFields.forEach((field) => {
    if (!data[field]) {
      errors.push(`Missing ${field}`);
    }
  });

  // Employer and occupation required when amount > 50
  if (amount > 50) {
    if (!data.employer) errors.push('Missing employer');
    if (!data.occupation) errors.push('Missing occupation');
  }

  // Basic pattern checks
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push('Invalid email');
  }

  if (data.state && !/^[A-Za-z]{2}$/.test(data.state)) {
    errors.push('Invalid state');
  }

  if (data.zip && !/^\d{5}(-\d{4})?$/.test(data.zip)) {
    errors.push('Invalid ZIP');
  }

  if (errors.length > 0) {
    console.warn('Invalid donation attempt', { errors, data });
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid submission', errors }),
    };
  }

  console.log('Donation submission accepted', { amount, email: data.email });

  return {
    statusCode: 303,
    headers: { Location: '/thanks.html' },
    body: ''
  };
};
