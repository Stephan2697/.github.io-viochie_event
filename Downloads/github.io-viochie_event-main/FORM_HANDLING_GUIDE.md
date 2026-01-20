# Form Handling Setup Guide

This guide walks you through the complete form handling implementation with validation, file uploads, and database storage.

## What's Been Implemented

### 1. **Client-Side Enhancements** (contact.js)
- ✅ Real-time field validation
- ✅ Custom error messages with visual feedback
- ✅ File upload support (PDF, DOC, DOCX, JPG, PNG - up to 5MB)
- ✅ Production-ready API endpoint detection
- ✅ Improved loading states and notifications
- ✅ Comprehensive error handling

### 2. **Server-Side Improvements** (server.js & controllers)
- ✅ Multer middleware for file uploads
- ✅ File validation and size limits
- ✅ Automatic uploads directory creation
- ✅ Static file serving for uploaded files

### 3. **Database Integration** (MongoDB)
- ✅ ContactSubmission schema with validation
- ✅ Automatic timestamp tracking
- ✅ Indexed queries for performance
- ✅ File metadata storage
- ✅ IP and user-agent logging

### 4. **Enhanced Email Handling**
- ✅ File attachments support
- ✅ Submission reference IDs
- ✅ Both admin and user confirmations
- ✅ Better formatted HTML emails

## Installation & Setup

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

This will install:
- `mongoose` - MongoDB connection and schemas
- `multer` - File upload handling
- All other existing dependencies

### Step 2: Configure Database

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Verify connection on `mongodb://localhost:27017`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `.env` file with your connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/viochie-events?retryWrites=true&w=majority
   ```

### Step 3: Configure Email

Update `.env` file:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@viochieevents.com
```

#### For Gmail Users:
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password in EMAIL_PASSWORD

#### For Other Email Services:
Update EMAIL_SERVICE and add email configuration as needed

### Step 4: Update Frontend URL (Optional)
```
FRONTEND_URL=http://your-domain.com
```

### Step 5: Start the Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` and display:
```
Server is running on http://localhost:5000
API endpoint: http://localhost:5000/api/contact/submit
```

## Testing the Form

### Using the Website
1. Navigate to the Contact section
2. Fill in the form fields
3. Optionally attach a file
4. Click "Send Message"
5. See real-time validation feedback
6. Watch for success/error notifications

### Using cURL (Command Line)
```bash
# Simple test
curl -X POST http://localhost:5000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Event Inquiry",
    "message": "I would like to know more about your services."
  }'

# With file upload
curl -X POST http://localhost:5000/api/contact/submit \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "subject=Event Inquiry" \
  -F "message=I would like to know more about your services." \
  -F "file=@/path/to/file.pdf"
```

## Form Features

### Real-Time Validation
- **Name**: 2-100 characters, letters/spaces/hyphens/apostrophes only
- **Email**: Valid email format
- **Subject**: Optional, max 200 characters
- **Message**: 10-5000 characters
- **File**: PDF, DOC, DOCX, JPG, PNG - max 5MB

### Validation Feedback
- Red border on invalid fields
- Error message below field
- Visual loading state during submission
- Success/error notifications at top-right

### File Upload
- Accepts: PDF, Word documents, Images
- Max size: 5MB
- Files stored in `backend/uploads/`
- File metadata saved to database

## Database Schema

### ContactSubmission Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  subject: String,
  message: String,
  file: {
    filename: String,
    path: String,
    mimeType: String,
    size: Number
  },
  status: String, // 'new', 'read', 'responded'
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Submit Contact Form
```
POST /api/contact/submit
Content-Type: multipart/form-data

Response:
{
  success: true/false,
  message: "...",
  submissionId: "..." // MongoDB _id
}
```

### Health Check
```
GET /api/health

Response:
{
  status: "Server is running"
}
```

## Troubleshooting

### Form Not Submitting
1. Check browser console for errors (F12)
2. Verify backend is running: `curl http://localhost:5000/api/health`
3. Check CORS settings in server.js
4. Verify API endpoint in contact.js matches your server URL

### Emails Not Sending
1. Verify EMAIL_USER and EMAIL_PASSWORD in .env
2. For Gmail: Enable "Less secure app access" or use App Password
3. Check backend logs for email errors
4. Test with a simpler email first

### Database Not Connecting
1. Verify MongoDB is running
2. Check MONGODB_URI in .env
3. For Atlas: Check IP whitelist settings
4. Check backend logs for connection errors

### File Upload Issues
1. Verify file size < 5MB
2. Ensure file type is allowed (PDF, DOC, DOCX, JPG, PNG)
3. Check `backend/uploads/` directory exists and is writable

## Production Deployment

### Before Deploying
1. Change NODE_ENV to "production"
2. Use strong, unique EMAIL_PASSWORD
3. Set FRONTEND_URL to your actual domain
4. Use MongoDB Atlas instead of local database
5. Add HTTPS/SSL certificate
6. Update CORS origins

### Deploy Backend to Heroku
```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy Frontend
- Build the static files
- Deploy to GitHub Pages, Vercel, or Netlify

## Need Help?

Check the logs in three places:
1. **Browser Console**: Developer Tools > Console
2. **Backend Terminal**: Where you ran `npm run dev`
3. **MongoDB**: Check collections in MongoDB Compass or Atlas

## Summary

You now have a **production-ready contact form** with:
✅ Real-time validation
✅ File upload capability
✅ Database persistence
✅ Email notifications
✅ Error handling
✅ Security considerations
✅ Scalability for growth
