# Viochie Events - Complete Project

A professional event planning website with backend API for contact form submissions.

## Project Structure

```
github.io-viochie_event-main/
├── .github.io-viochie_event-main/      # Frontend (Website)
│   ├── index.html                      # Main HTML file
│   ├── js/
│   │   └── contact.js                  # Contact form handler
│   ├── css/
│   │   └── Viochie_events.css         # Styles
│   └── img/                            # Images
│
├── backend/                            # Backend API
│   ├── config/
│   │   └── email.js                    # Email configuration
│   ├── controllers/
│   │   └── contactController.js        # Contact form logic
│   ├── routes/
│   │   └── contactRoutes.js            # API routes
│   ├── server.js                       # Express server
│   ├── package.json                    # Dependencies
│   ├── .env.example                    # Environment template
│   ├── .gitignore                      # Git ignore
│   └── README.md                       # Backend setup guide
│
└── README.md                           # This file
```

## Getting Started

### Frontend (Website)

Open the website by opening `/.github.io-viochie_event-main/index.html` in your browser.

**Features:**
- Home section with hero banner
- About Us section
- Services showcase
- Portfolio gallery
- Testimonials
- Contact form

### Backend (API)

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your email settings in `.env`

5. Start the server:
   ```bash
   npm start      # Production
   npm run dev    # Development
   ```

The API will run on `http://localhost:5000`

## Features

### Frontend
- Responsive design
- Mobile-friendly navigation
- Smooth scrolling sections
- Contact form with real-time validation
- Social media integration ready

### Backend API
- Contact form submission endpoint
- Email notifications (to admin and user)
- Input validation and sanitization
- CORS support
- RESTful API design

## API Endpoints

```
POST   /api/contact/submit     # Submit contact form
GET    /api/contact/info       # Get contact information
GET    /api/health             # Health check
```

## Environment Setup

Create `.env` file in the backend folder:

```env
PORT=5000
NODE_ENV=development
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=info@viochieevents.com
```

## Contact Form Flow

1. User fills out form on website
2. Frontend validates input
3. Form data sent to backend API (`POST /api/contact/submit`)
4. Backend validates and sanitizes data
5. Admin receives notification email
6. User receives confirmation email
7. Success/error notification shown to user

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- Nodemailer
- Express-validator
- CORS

## Deployment Guide

### Frontend
- Host on GitHub Pages, Vercel, Netlify, or any static hosting

### Backend
- Deploy to Heroku, AWS, DigitalOcean, or similar
- Set environment variables in hosting platform
- Update CORS origins for production domain

## Configuration

### Email Configuration (Gmail)

1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password in `.env`

### CORS Configuration

Edit `backend/server.js` to add your frontend URL:

```javascript
origin: ['http://localhost:3000', 'https://your-domain.com']
```

## Security Notes

- Never commit `.env` file
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement rate limiting for production
- Validate all inputs on both frontend and backend

## Support & Contact

- Website: https://viochieevents.com (when deployed)
- Email: info@viochieevents.com
- Phone: (555) 123-4567

## License

ISC

---

**Last Updated:** January 2026
