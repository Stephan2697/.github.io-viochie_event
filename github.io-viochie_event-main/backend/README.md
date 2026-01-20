# Viochie Events Backend - Contact Form API

A Node.js/Express backend API for handling contact form submissions from the Viochie Events website.

## Features

- ✅ RESTful API endpoint for contact form submissions
- ✅ Email validation using express-validator
- ✅ Automatic email notifications (to admin and user)
- ✅ CORS support for frontend communication
- ✅ Error handling and validation
- ✅ Environment-based configuration

## Project Structure

```
backend/
├── config/
│   └── email.js          # Email transporter configuration
├── controllers/
│   └── contactController.js  # Contact form logic
├── routes/
│   └── contactRoutes.js   # API routes
├── server.js             # Express server setup
├── package.json          # Dependencies
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory by copying `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your email configuration:

```env
PORT=5000
NODE_ENV=development
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=info@viochieevents.com
```

#### Email Configuration Options

**For Gmail:**
1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated 16-character password in `EMAIL_PASSWORD`

**For Other Services:**
- Gmail: `service: "gmail"`
- Outlook: `service: "outlook"`
- Yahoo: `service: "yahoo"`
- Custom SMTP:
  ```env
  EMAIL_HOST=smtp.your-service.com
  EMAIL_PORT=587
  EMAIL_USER=your-email@your-service.com
  EMAIL_PASSWORD=your-password
  ```

### 3. Start the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### POST `/api/contact/submit`

Submit a contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Event Inquiry",
  "message": "I'm interested in planning my wedding with Viochie Events."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your message has been sent successfully! We will contact you soon."
}
```

**Error Response (400):**
```json
{
  "success": false,
  "errors": [
    {
      "param": "email",
      "msg": "Valid email is required"
    }
  ]
}
```

### GET `/api/contact/info`

Get contact information.

**Response:**
```json
{
  "address": "123 Event Street, City, State 10001",
  "phone": "(555) 123-4567",
  "email": "info@viochieevents.com"
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "Server is running"
}
```

## Validation Rules

- **name**: Required, 2-100 characters
- **email**: Required, valid email format
- **subject**: Optional, max 200 characters
- **message**: Required, 10-5000 characters

## Frontend Integration

The frontend is already configured with [js/contact.js](../frontend/js/contact.js) which:

1. Intercepts the contact form submission
2. Validates data on client-side
3. Sends POST request to `/api/contact/submit`
4. Displays success/error notifications
5. Resets the form on successful submission

## CORS Configuration

The server accepts requests from:
- `http://localhost:3000`
- `http://localhost:8000`
- Environment variable `FRONTEND_URL`

To add more origins, edit `server.js`:
```javascript
origin: ['http://localhost:3000', 'http://localhost:8000', 'http://your-domain.com']
```

## Security Considerations

1. **Input Validation**: All inputs are validated using express-validator
2. **Email Verification**: Emails are normalized and validated
3. **Rate Limiting**: Consider adding rate limiting in production
4. **HTTPS**: Use HTTPS in production
5. **Environment Variables**: Never commit `.env` file to git

## Deployment

### Heroku

1. Create a Heroku account and install Heroku CLI
2. Create an app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set EMAIL_USER=...`
4. Deploy: `git push heroku main`

### Other Platforms

Follow your hosting provider's Node.js deployment guide.

## Troubleshooting

### "Email failed to send"
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- For Gmail, ensure App Password is used (not regular password)
- Check firewall/antivirus settings

### CORS Error
- Ensure frontend URL is added to CORS origins in server.js
- Check that frontend is making requests to correct API endpoint

### Port Already in Use
- Change PORT in .env to an available port
- Or kill process on port 5000: `lsof -ti:5000 | xargs kill -9` (macOS/Linux)

## Dependencies

- **express**: Web framework
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment variable management
- **nodemailer**: Email sending
- **express-validator**: Input validation
- **nodemon**: Development server with auto-reload

## License

ISC

## Support

For issues or questions, contact: info@viochieevents.com
