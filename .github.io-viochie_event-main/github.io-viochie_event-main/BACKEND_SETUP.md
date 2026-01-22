# Backend Development Setup - Quick Reference

## ✅ What's Been Created

### Backend Infrastructure
- **server.js** - Express server with CORS, middleware, and error handling
- **package.json** - All dependencies for the project
- **config/email.js** - Nodemailer email transporter setup
- **controllers/contactController.js** - Contact form submission logic
- **routes/contactRoutes.js** - API routes with validation
- **.env.example** - Environment variables template
- **.gitignore** - Git configuration
- **README.md** - Complete backend documentation

### Frontend Integration
- **js/contact.js** - Contact form handler with notifications
- **index.html** - Updated with contact.js script reference

### Documentation
- **README.md** (root) - Project overview
- **backend/README.md** - Detailed backend setup guide

## 🚀 Quick Start

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Email
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your email credentials:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

   **For Gmail:**
   - Enable 2FA on Google Account
   - Go to https://myaccount.google.com/apppasswords
   - Generate App Password (16 characters)
   - Paste in EMAIL_PASSWORD

### Step 3: Start the Server
```bash
npm start
```

Server runs at: `http://localhost:5000`

## 📋 API Documentation

### Submit Contact Form
```
POST /api/contact/submit

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "Your message here..."
}

Response:
{
  "success": true,
  "message": "Your message has been sent successfully!"
}
```

### Get Contact Info
```
GET /api/contact/info

Response:
{
  "address": "123 Event Street, City, State 10001",
  "phone": "(555) 123-4567",
  "email": "info@viochieevents.com"
}
```

### Health Check
```
GET /api/health

Response:
{
  "status": "Server is running"
}
```

## 🔧 Technologies Used

- **Express.js** - Web framework
- **Nodemailer** - Email sending
- **express-validator** - Input validation
- **CORS** - Cross-origin support
- **dotenv** - Environment variables

## 📧 Email Flow

1. **Form Submission** (Frontend)
   - User submits contact form
   - JavaScript validates and sends to API

2. **Backend Processing**
   - Express validates data
   - Creates email message
   - Sends two emails:
     - Admin notification (new submission)
     - User confirmation (receipt)

3. **User Feedback**
   - Success/error notification shown
   - Form clears on success

## 🛡️ Validation Rules

- **Name**: 2-100 characters, required
- **Email**: Valid email format, required
- **Subject**: Max 200 characters, optional
- **Message**: 10-5000 characters, required

## 🌐 CORS Configuration

Currently allows requests from:
- `http://localhost:3000`
- `http://localhost:8000`

To add more origins (production domain), edit `backend/server.js`:
```javascript
origin: ['http://localhost:3000', 'https://yourdomain.com']
```

## 🚨 Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Email (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Admin
ADMIN_EMAIL=info@viochieevents.com

# Optional: For other email services
# EMAIL_HOST=smtp.service.com
# EMAIL_PORT=587
```

## 📁 Project Structure

```
backend/
├── config/email.js              # Email transporter
├── controllers/contactController.js  # Form logic
├── routes/contactRoutes.js      # API endpoints
├── server.js                    # Main server file
├── package.json                 # Dependencies
├── .env.example                 # Template
├── .env                         # Actual config (not in git)
└── README.md                    # Full documentation
```

## 🔍 Testing the API

### Using curl:
```bash
curl -X POST http://localhost:5000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "This is a test message with more than 10 characters"
  }'
```

### Using Postman:
1. Create new POST request
2. URL: `http://localhost:5000/api/contact/submit`
3. Set header: `Content-Type: application/json`
4. Add JSON body (see curl example above)
5. Send and check response

## 🐛 Troubleshooting

### "Cannot find module 'nodemailer'"
```bash
npm install
```

### "Email failed to send"
- Check EMAIL_USER and EMAIL_PASSWORD are correct
- For Gmail, use App Password (not regular password)
- Ensure 2FA is enabled on Google Account

### "CORS error"
- Check that your frontend is making requests to `http://localhost:5000`
- Add your domain to CORS origins in server.js

### "Port 5000 already in use"
- Change PORT in .env to different port (5001, 5002, etc.)

## 📱 Frontend Integration

The frontend (`js/contact.js`) automatically:
1. Intercepts form submission
2. Validates data
3. Sends to backend API
4. Shows success/error messages
5. Resets form on success

No additional frontend setup needed!

## 🚀 Production Deployment

### Backend Deployment (Heroku example):
```bash
heroku create your-app-name
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
git push heroku main
```

### Frontend Deployment:
- Use GitHub Pages, Vercel, or Netlify
- Update CORS origins to match frontend domain

## 📞 Support

For issues or questions:
- Check backend/README.md for detailed docs
- Review .env.example for configuration options
- Test API endpoints with curl or Postman

---

**Backend successfully created! Ready for development.** ✨
