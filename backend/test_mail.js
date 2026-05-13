require('dotenv').config();

const nodemailer = require('nodemailer');

async function test(fromValue) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: fromValue,
      to: 'phirawit.main@gmail.com',
      subject: 'Debug: Test ' + fromValue,
      html: '<h1>Debug</h1>',
    });
    console.log('Success with "' + fromValue + '":', info.messageId);
  } catch (err) {
    console.error('Error with "' + fromValue + '":', err.message);
  }
}

async function runTests() {
  await test('RGA Verification');
  await test('RGA Verification <phirawit.main@gmail.com>');
}

runTests();
