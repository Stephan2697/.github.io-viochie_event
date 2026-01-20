# 🎉 Viochie Events - Complete Project Documentation

A professional event planning website with full-stack contact form system, email notifications, and production-ready deployment options.

**Status:** ✅ Complete & Ready for Deployment  
**Last Updated:** January 20, 2026  
**Version:** 1.0.0

---

## 📑 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Installation & Setup](#installation--setup)
6. [API Documentation](#api-documentation)
7. [Contact Form Flow](#contact-form-flow)
8. [Configuration](#configuration)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [Documentation Index](#documentation-index)

---

## 🚀 Quick Start

### 5-Minute Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Update .env with your email credentials
# (See Configuration section below)

# 5. Start the server
npm start
```

### For Frontend Development
```bash
# Open in browser
open .github.io-viochie_event-main/index.html
```

---

## 📁 Project Structure

```
viochie-events/
│
├── Frontend (.github.io-viochie_event-main/)
│   ├── index.html                      # Main website
│   ├── css/
│   │   └── Viochie_events.css         # Responsive styling
│   ├── js/
│   │   └── contact.js                  # Form handler + validation
│   └── img/                            # Images and assets
│
├── Backend (backend/)
│   ├── server.js                       # Express server + middleware
│   ├── package.json                    # Dependencies (Express, Nodemailer, etc.)
│   ├── config/
│   │   ├── email.js                    # Email transporter setup
│   │   └── database.js                 # Database configuration (optional)
│   ├── controllers/
│   │   └── contactController.js        # Business logic
│   ├── models/
│   │   └── contactSubmission.js        # Data schema
│   ├── routes/
│   │   └── contactRoutes.js            # API endpoints
│   ├── .env.example                    # Configuration template
│   ├── .gitignore                      # Git ignore rules
│   ├── README.md                       # Backend-specific docs
│   └── EXAMPLES.js                     # Code examples & extensions
│
├── Documentation
│   ├── README.md                       # This file
│   ├── ARCHITECTURE.md                 # System diagrams
│   ├── BACKEND_SETUP.md                # Backend quick reference
│   ├── DEPLOYMENT_GUIDE.md             # Production deployment
│   ├── FORM_HANDLING_GUIDE.md          # Form features overview
│   ├── TESTING_GUIDE.md                # Testing procedures
│   └── INDEX.md                        # Full documentation index
│
└── LICENSE                             # ISC License
```

---

## ✨ Features

### Frontend Features
✅ Responsive, mobile-first design  
✅ Smooth scrolling navigation  
✅ Hero banner with call-to-action  
✅ About Us, Services, Portfolio sections  
✅ Testimonials showcase  
✅ Contact form with real-time validation  
✅ Error message feedback  
✅ Success notifications  
✅ Font Awesome icons integration  

### Backend API Features
✅ Express.js REST API  
✅ Contact form submission endpoint  
✅ Email notifications (admin + user)  
✅ Real-time input validation  
✅ Data sanitization  
✅ CORS configuration  
✅ Health check endpoint  
✅ Error handling with clear messages  
✅ Hot reload in development (nodemon)  

### Email Features
✅ Admin notification emails  
✅ User confirmation emails  
✅ HTML formatted templates  
✅ Gmail support  
✅ Outlook/Yahoo support  
✅ Custom SMTP support  

### Security Features
✅ Frontend + backend validation  
✅ Input sanitization  
✅ CORS protection  
✅ Environment variables for secrets  
✅ .gitignore for sensitive files  
✅ HTTPS ready  

---

## 🛠 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | HTML5 | Latest | Markup |
| | CSS3 | Latest | Styling |
| | JavaScript | ES6+ | Form handling |
| **Backend** | Node.js | 16+ | Runtime |
| | Express.js | 4.18+ | Web framework |
| | Nodemailer | 6.9+ | Email sending |
| | express-validator | 7.0+ | Input validation |
| | cors | 2.8+ | Cross-origin support |
| | dotenv | 16.3+ | Environment config |
| **Development** | nodemon | 3.0+ | Auto reload |

---

## 💻 Installation & Setup

### Prerequisites
- **Node.js** 16+ (https://nodejs.org)
- **npm** (comes with Node.js)
- **Git** (for version control)
- Valid **email account** (Gmail, Outlook, Yahoo, etc.)

### Step 1: Clone/Download Project

```bash
# If using git
git clone <repository-url>
cd github.io-viochie_event-main

# Or simply navigate to existing folder
cd backend
```

### Step 2: Install Backend Dependencies

```bash
npm install
```

This installs:
- express - Web framework
- nodemailer - Email service
- express-validator - Input validation
- cors - Cross-origin support
- dotenv - Environment configuration
- nodemon - Development auto-reload

### Step 3: Configure Email (Required)

#### For Gmail Users:
1. Go to your Google Account: https://myaccount.google.com
2. Enable **2-Factor Authentication** (if not already enabled)
3. Generate **App Password**: https://myaccount.google.com/apppasswords
4. Copy the 16-character password

#### For Other Email Services:
Check backend/README.md for Outlook, Yahoo, or custom SMTP setup.

### Step 4: Create .env File

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server
PORT=5000
NODE_ENV=development

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=info@viochieevents.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Step 5: Start the Backend Server

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

Expected output:
```
Server is running on http://localhost:5000
```

### Step 6: Open Frontend in Browser

```bash
# Option 1: Direct file path
open ../.github.io-viochie_event-main/index.html

# Option 2: Drag and drop the file into your browser

# Option 3: Use live server (VS Code extension)
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### 1. Submit Contact Form

**Endpoint:** `POST /api/contact/submit`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Event Inquiry",
  "message": "I would like to discuss event planning services..."
}
```

**Validation Rules:**
- `name`: 2-100 characters, required
- `email`: Valid email format, required
- `subject`: 0-200 characters, optional
- `message`: 10-5000 characters, required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your message has been sent successfully!"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 2. Get Contact Information

**Endpoint:** `GET /api/contact/info`

**Response:**
```json
{
  "address": "123 Event Street, City, State 10001",
  "phone": "(555) 123-4567",
  "email": "info@viochieevents.com",
  "hours": "Mon-Fri 9AM-6PM"
}
```

### 3. Health Check

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2026-01-20T10:30:00Z"
}
```

---

## 📊 Contact Form Flow

```
┌─────────────────────────────────────────────────────┐
│  1. User fills contact form on website              │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  2. Frontend (contact.js) validates:                │
│     ✓ Name not empty (2-100 chars)                  │
│     ✓ Valid email format                            │
│     ✓ Message not empty (10-5000 chars)             │
└─────────────────┬───────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼ (Valid)           ▼ (Invalid)
    ┌────────┐          ┌──────────┐
    │ SEND   │          │ SHOW     │
    │ DATA   │          │ ERROR    │
    └────┬───┘          └──────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  3. POST /api/contact/submit to backend             │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  4. Backend validation + sanitization               │
│     ✓ Express-validator checks all fields           │
│     ✓ Data sanitized                                │
└─────────────────┬───────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼ (Valid)           ▼ (Invalid)
    ┌────────┐          ┌──────────┐
    │ SEND   │          │ RETURN   │
    │ EMAILS │          │ ERROR    │
    └────┬───┘          └──────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  5. Send 2 emails via Nodemailer:                   │
│     • Email 1: Admin notification                   │
│     • Email 2: User confirmation                    │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  6. Return success response to frontend             │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  7. Frontend shows success notification             │
│     • Success message displayed                     │
│     • Form cleared automatically                    │
└─────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuration

### Email Configuration

#### Gmail Setup (Recommended)
1. Enable 2-Factor Authentication on your Google Account
2. Visit: https://myaccount.google.com/apppasswords
3. Generate an App Password for "Mail" and "Windows Computer"
4. Copy the 16-character password
5. Paste into `.env`:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

#### Outlook Setup
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

#### Yahoo Mail Setup
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

#### Custom SMTP
```env
EMAIL_SERVICE=custom
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASSWORD=password
```

### CORS Configuration

Edit `backend/server.js` to allow your frontend domain:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',        // Local development
    'http://localhost',              // Local
    'https://yourdomain.com',        // Production
    'https://www.yourdomain.com'     // Production www
  ],
  credentials: true
}));
```

### Environment Variables

All configuration is done through `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Email Service Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=info@viochieevents.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Database (Optional for future features)
MONGODB_URI=mongodb://localhost:27017/viochie-events
```

---

## 🧪 Testing

### Method 1: Using Browser Console

```javascript
fetch('http://localhost:5000/api/contact/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'This is a test message for testing the form.'
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

### Method 2: Using cURL

```bash
curl -X POST http://localhost:5000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "This is a test message for the form."
  }'
```

### Method 3: Using Postman

1. Open Postman
2. Create new POST request
3. URL: `http://localhost:5000/api/contact/submit`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "subject": "Test Subject",
  "message": "This is a test message for testing the form."
}
```
6. Click Send

### Method 4: Using the Website Form

1. Fill out the contact form on the website
2. Click Submit
3. Check console for errors (F12)
4. Check email inbox for confirmation

---

## 🚀 Deployment

### Pre-Deployment Checklist

- [ ] Backend works locally (`npm start`)
- [ ] Email service configured and tested
- [ ] All validations working correctly
- [ ] Frontend updated with production API URL
- [ ] CORS origins configured for production domain
- [ ] `.env` is in `.gitignore` (never commit secrets!)
- [ ] No sensitive data in code
- [ ] Dependencies installed (`npm install`)
- [ ] Package.json has correct start script

### Option 1: Heroku (Easiest)

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set PORT=5000
heroku config:set NODE_ENV=production
heroku config:set EMAIL_SERVICE=gmail
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set ADMIN_EMAIL=info@viochieevents.com

# Deploy
git push heroku main

# Check logs
heroku logs --tail

# Test
curl https://your-app-name.herokuapp.com/api/health
```

### Option 2: AWS EC2

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed AWS setup instructions.

### Option 3: Other Options

- **DigitalOcean** - Simple and affordable
- **Railway.app** - Modern, easy deployment
- **Render.com** - Free tier available
- **Docker** - Containerized deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete deployment options.

### Frontend Deployment

- **GitHub Pages** - Free hosting for static sites
- **Vercel** - Optimized for frontend projects
- **Netlify** - Simple deployment with CI/CD
- **Firebase Hosting** - Google's static hosting

---

## 🆘 Troubleshooting

### Email Not Sending

**Problem:** "Cannot find module 'nodemailer'"  
**Solution:** Run `npm install` in backend folder

**Problem:** "Invalid login" error  
**Solution:** 
- Verify EMAIL_SERVICE in .env
- Check email credentials
- For Gmail, ensure App Password is 16 characters
- Verify 2-Factor Authentication is enabled

### Port Already in Use

**Problem:** "Address already in use :5000"  
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### CORS Errors

**Problem:** "Access to XMLHttpRequest has been blocked by CORS policy"  
**Solution:**
- Add frontend URL to CORS origins in `backend/server.js`
- Ensure backend server is running
- Check that API URL in contact.js matches backend URL

### Form Not Submitting

**Problem:** Form submission fails silently  
**Solution:**
1. Check browser console (F12) for errors
2. Verify backend is running (`npm start`)
3. Check CORS configuration
4. Verify environment variables in .env
5. Test API directly with curl/Postman

For more troubleshooting, see [BACKEND_SETUP.md](backend/README.md).

---

## 📚 Documentation Index

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [BACKEND_SETUP.md](BACKEND_SETUP.md) | Backend quick reference | 5 min |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System diagrams & flows | 10 min |
| [FORM_HANDLING_GUIDE.md](FORM_HANDLING_GUIDE.md) | Form features overview | 10 min |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Production deployment | 20 min |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | Testing procedures | 15 min |
| [INDEX.md](INDEX.md) | Full documentation index | 5 min |
| [backend/README.md](backend/README.md) | Backend-specific docs | 20 min |
| [backend/EXAMPLES.js](backend/EXAMPLES.js) | Code examples | 10 min |

---

## 📞 Support & Contact

- **Website:** https://viochieevents.com (when deployed)
- **Email:** info@viochieevents.com
- **Phone:** (555) 123-4567

For technical issues, refer to:
1. [TROUBLESHOOTING](#troubleshooting) section above
2. [BACKEND_SETUP.md](BACKEND_SETUP.md) troubleshooting
3. Check error messages in console

---

## 📄 License

ISC License - Feel free to use this project for personal and commercial purposes.

---

## ✅ Project Status

- [x] Frontend website created
- [x] Backend API implemented
- [x] Email notifications configured
- [x] Input validation implemented
- [x] Security measures added
- [x] Comprehensive documentation created
- [x] Ready for production deployment
- [ ] Deployed to production (when you're ready!)

---

**Questions? Check the [documentation index](#documentation-index) above for detailed guides on specific topics.**

**Ready to deploy? Follow the [Deployment](#deployment) section above.**

**Need help? Check [Troubleshooting](#troubleshooting) for common issues.**

---

**Created:** January 2026  
**Last Updated:** January 20, 2026  
**Version:** 1.0.0
