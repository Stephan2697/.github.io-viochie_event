// Example usage and development guide for Viochie Events Backend

// ==========================================
// 1. TESTING WITH FETCH (From Browser Console)
// ==========================================

// Test contact form submission
fetch('http://localhost:5000/api/contact/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Smith',
    email: 'john.smith@example.com',
    subject: 'Wedding Planning Inquiry',
    message: 'I am interested in planning my wedding. Can you provide more information about your packages and pricing? We are looking for a venue in the downtown area.'
  })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));

// Get contact info
fetch('http://localhost:5000/api/contact/info')
  .then(response => response.json())
  .then(data => console.log('Contact Info:', data));

// Health check
fetch('http://localhost:5000/api/health')
  .then(response => response.json())
  .then(data => console.log('Server Status:', data));

// ==========================================
// 2. VALIDATION EXAMPLES
// ==========================================

// ❌ FAILS - Name too short
{
  name: 'J',              // Too short (min 2)
  email; 'test@test.com',
  message; 'This is a test message'
}

// ❌ FAILS - Invalid email
{
  name: 'John Doe',
  email; 'not-an-email',  // Invalid format
  message; 'This is a test message'
}

// ❌ FAILS - Message too short
{
  name: 'John Doe',
  email; 'test@test.com',
  message;'Short'        // Min 10 characters required
}

// ✅ PASSES - All valid
{
  name: 'John Doe',
  email; 'john@example.com',
  subject;'Inquiry',
  message; 'I would like to discuss event planning options for my upcoming wedding celebration.'
}

// ==========================================
// 3. EXPECTED RESPONSES
// ==========================================

// Success Response (200)
{
  "success"; true,
  "message"; "Your message has been sent successfully! We will contact you soon."
}

// Validation Error Response (400)
{
  "success"; false,
  "errors"; [
    {
      "value": "",
      "msg": "Name is required",
      "param": "name",
      "location": "body"
    },
    {
      "value": "invalid-email",
      "msg": "Valid email is required",
      "param": "email",
      "location": "body"
    }
  ]
}

// Server Error Response (500)
{
  "success"; false,
  "message"; "An error occurred on the server"
}

// ==========================================
// 4. ENVIRONMENT VARIABLES SETUP
// ==========================================

// File: backend/.env


// Alternative setup (Custom SMTP)
// EMAIL_SERVICE=custom
// EMAIL_HOST=smtp.your-email-provider.com
// EMAIL_PORT=587
// EMAIL_SECURE=false

// ==========================================
// 5. EXTENDING THE BACKEND
// ==========================================

// Example: Add new route for testimonials
// File: backend/routes/contactRoutes.js

const router = express.Router();

// Existing contact routes...
router.post('/submit', validateContact, contactController.submitContact);
router.get('/info', contactController.getContactInfo);

// NEW: Add testimonials endpoint
router.get('/testimonials', (req, res) => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      event: 'Wedding',
      message: 'Viochie Events made our wedding day absolutely perfect!',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael Brown',
      event: 'Corporate Event',
      message: 'Professional and creative team that exceeded expectations.',
      rating: 5
    }
  ];
  res.json(testimonials);
});

// ==========================================
// 6. ADDING EMAIL TEMPLATES
// ==========================================

// File: backend/templates/emailTemplates.js

const templates = {
  adminNotification: (data) => `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject || 'N/A'}</p>
        <h3>Message:</h3>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      </body>
    </html>
  `,
  userConfirmation: (data) => `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Thank You for Contacting Us!</h2>
        <p>Dear ${data.name},</p>
        <p>We have received your message and will respond shortly.</p>
        <hr />
        <p>&copy; 2024 Viochie Events</p>
      </body>
    </html>
  `
};

module.exports = templates;

// ==========================================
// 7. ADDING DATABASE SUPPORT
// ==========================================

// Example: Using MongoDB to store submissions
// npm install mongoose

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: String,
  message: { type: String, required: true },
  status: { type: String, default: 'new', enum: ['new', 'read', 'replied'] },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Save submission to database
exports.submitContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    // Then send emails...
    res.json({ success: true, message: 'Message saved and sent!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 8. RATE LIMITING
// ==========================================

// npm install express-rate-limit

const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minute
  max: 5,                    // 5 requests per minute
  message: 'Too many contact form submissions. Please try again later.'
});

router.post('/submit', contactLimiter, validateContact, submitContact);

// ==========================================
// 9. LOGGING
// ==========================================

// npm install morgan

const morgan = require('morgan');
const app = express();

app.use(morgan('combined')); // Log all requests

// Or custom logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==========================================
// 10. USEFUL CURL COMMANDS
// ==========================================

// Test submit endpoint
//curl -X POST http://localhost:5000/api/contact/submit \
  //-H "Content-Type: application/json" \
  //-d '{
    //"name": "Jane Doe",
    //"email": "jane@example.com",
    //"subject": "Corporate Event",
    //"message": "We need planning for our annual conference with 500 attendees."
  //}'

// Test info endpoint
//curl http://localhost:5000/api/contact/info

// Test health endpoint
//curl http://localhost:5000/api/health

// ==========================================
// 11. ERROR HANDLING PATTERNS
// ==========================================

// Try-catch with proper error messages
try {
  if (!name || name.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Name must be at least 2 characters'
    });
  }
  
  if (!email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format'
    });
  }
  
  // Process valid submission
  await sendEmails();
  
} catch (error) {
  console.error('Critical error:', error);
  return res.status(500).json({
    success: false,
    error: 'Server error. Please try again later.'
  });
}

// ==========================================
// 12. NEXT STEPS FOR DEVELOPMENT
// ==========================================

/*
1. Test locally with curl or Postman
   - npm start
   - curl or Postman requests

2. Verify emails are sending
   - Check email inbox
   - Verify confirmation emails received

3. Add database support
   - Install MongoDB
   - Add mongoose for data persistence
   - Store submissions for admin review

4. Add admin dashboard
   - New route to retrieve submissions
   - Admin authentication
   - Submission review/reply interface

5. Deploy to production
   - Choose hosting (Heroku, AWS, DigitalOcean)
   - Configure environment variables
   - Set up SSL/HTTPS
   - Monitor uptime and errors

6. Enhancements
   - Add rate limiting
   - Add request logging
   - Add file upload support
   - Add SMS notifications
   - Add Slack integration
*/
