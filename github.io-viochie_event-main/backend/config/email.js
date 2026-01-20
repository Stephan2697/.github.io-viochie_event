const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify transporter connection (non-blocking, warning only)
transporter.verify(function(error, success) {
  if (error) {
    console.warn('⚠️  Email configuration issue:', error.message);
    console.warn('   Please update .env with valid email credentials');
    console.warn('   Reference: FORM_HANDLING_GUIDE.md for setup instructions');
  } else {
    console.log('✓ Email transporter ready');
  }
});

module.exports = transporter;
