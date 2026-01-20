# Testing Guide - Viochie Events Backend

This document provides step-by-step instructions for testing the contact form backend.

## Prerequisites

- Node.js installed
- npm installed
- Backend dependencies installed (`npm install`)
- `.env` file configured with email credentials
- Server running (`npm start`)

---

## Method 1: Browser Console (JavaScript Fetch)

### Step 1: Open Browser
1. Navigate to any page or open DevTools
2. Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
3. Go to "Console" tab

### Step 2: Paste and Run Code

**Test 1: Simple Contact Submission**
```javascript
fetch('http://localhost:5000/api/contact/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Wedding Inquiry',
    message: 'I would like to discuss wedding planning services for my upcoming ceremony.'
  })
})
.then(response => response.json())
.then(data => console.log('Response:', data))
.catch(error => console.error('Error:', error));
```

**Test 2: Get Contact Information**
```javascript
fetch('http://localhost:5000/api/contact/info')
  .then(response => response.json())
  .then(data => console.log('Contact Info:', data))
  .catch(error => console.error('Error:', error));
```

**Test 3: Health Check**
```javascript
fetch('http://localhost:5000/api/health')
  .then(response => response.json())
  .then(data => console.log('Server Status:', data))
  .catch(error => console.error('Error:', error));
```

### Expected Results

**Success (200):**
```javascript
{
  success: true,
  message: "Your message has been sent successfully! We will contact you soon."
}
```

**Error (400 - Validation Failed):**
```javascript
{
  success: false,
  errors: [
    {
      value: "J",
      msg: "Name must be between 2 and 100 characters",
      param: "name",
      location: "body"
    }
  ]
}
```

---

## Method 2: Command Line with cURL

### Test 1: Valid Submission
```bash
curl -X POST http://localhost:5000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "subject": "Corporate Event Planning",
    "message": "We need professional event planning for our annual corporate retreat with 200 participants."
  }'
```

### Test 2: Missing Required Field
```bash
curl -X POST http://localhost:5000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```
**Expected Error:** Missing message field

### Test 3: Invalid Email
```bash
curl -X POST http://localhost:5000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "not-an-email",
    "subject": "Inquiry",
    "message": "This is a test message with sufficient length."
  }'
```
**Expected Error:** Invalid email format

### Test 4: Message Too Short
```bash
curl -X POST http://localhost:5000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Test",
    "message": "Short"
  }'
```
**Expected Error:** Message must be at least 10 characters

### Test 5: Get Contact Info
```bash
curl http://localhost:5000/api/contact/info
```

### Test 6: Health Check
```bash
curl http://localhost:5000/api/health
```

---

## Method 3: Postman (GUI Testing Tool)

### Setup

1. **Download Postman:** https://www.postman.com/downloads/
2. **Install and Open**

### Test Contact Submission

1. Click "Create" or "+" to create new request
2. Set method to **POST**
3. Enter URL: `http://localhost:5000/api/contact/submit`
4. Go to **Headers** tab
   - Add header: `Content-Type: application/json`
5. Go to **Body** tab
   - Select "raw"
   - Paste this JSON:
   ```json
   {
     "name": "Sarah Johnson",
     "email": "sarah@example.com",
     "subject": "Birthday Party Planning",
     "message": "I need help planning my 50th birthday party with about 75 guests. Looking for venue suggestions and catering options."
   }
   ```
6. Click "Send"

### Expected Response
```json
{
  "success": true,
  "message": "Your message has been sent successfully! We will contact you soon."
}
```

---

## Method 4: Frontend Contact Form (Real Test)

### Step 1: Ensure Backend is Running
```bash
cd backend
npm start
```

### Step 2: Open Website
1. Open `/.github.io-viochie_event-main/index.html` in browser
2. Scroll to "Contact Us" section

### Step 3: Fill Out Form
- Name: `Your Name`
- Email: `your-email@example.com`
- Subject: `Test Subject`
- Message: `This is a test message from the contact form on the website.`

### Step 4: Click Send
- Watch browser console (F12) for any errors
- See success/error notification appear
- Check your email for confirmation message

### Step 5: Verify Emails Received
1. **Check Admin Email** (configured in .env as ADMIN_EMAIL)
   - Should see notification about new submission
2. **Check Your Email** (the one you used in form)
   - Should see confirmation receipt

---

## Validation Testing Checklist

### Valid Submissions ✅
- [x] All fields filled correctly
- [x] Name: 2-100 characters
- [x] Email: Valid format (contains @)
- [x] Subject: Optional, max 200 characters
- [x] Message: 10-5000 characters

### Invalid Submissions ❌
- [x] Name too short (1 character)
- [x] Name too long (>100 characters)
- [x] Email invalid format
- [x] Email missing
- [x] Message too short (<10 characters)
- [x] Message too long (>5000 characters)
- [x] Message missing

---

## Error Scenarios & Responses

### 1. Server Not Running
```
Error: Failed to fetch / Connection refused
```
**Fix:** Start server with `npm start`

### 2. CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Fix:** Ensure frontend URL is added to CORS origins in server.js

### 3. Email Not Sending
```json
{
  "success": false,
  "message": "Failed to send your message. Please try again later."
}
```
**Fix:** 
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Verify Gmail App Password is used
- Check email service is configured correctly

### 4. Validation Error
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
**Fix:** Correct the validation error mentioned in response

---

## Performance Testing

### Load Testing with Apache Bench
```bash
# Install Apache Bench (if not installed)
brew install httpd  # macOS
apt-get install apache2-utils  # Linux

# Run 100 requests, 10 concurrent
ab -n 100 -c 10 -p data.json -T application/json http://localhost:5000/api/contact/submit
```

Where `data.json` contains:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "subject": "Load Test",
  "message": "Testing server performance with concurrent requests."
}
```

---

## Email Testing

### Test 1: Verify Admin Email Receives Submissions
1. Submit form with test data
2. Check ADMIN_EMAIL inbox
3. Verify subject line and content

### Test 2: Verify User Gets Confirmation
1. Submit form with your real email
2. Check your inbox
3. Look for confirmation email

### Test 3: Test Different Email Services
- Try Gmail, Outlook, Yahoo, etc.
- Update EMAIL_SERVICE in .env
- Retest to ensure compatibility

---

## Debugging Tips

### 1. Check Server Logs
When running `npm start`, watch for:
```
Server is running on http://localhost:5000
Email transporter ready: true
```

### 2. Browser Console Logs
- Open DevTools (F12)
- Look for any JavaScript errors
- Check Network tab for API responses

### 3. Email Configuration Debug
```javascript
// Run in browser console to test connectivity
fetch('http://localhost:5000/api/contact/submit', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    name: 'Debug Test',
    email: 'debug@test.com',
    message: 'Testing email configuration.'
  })
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e));
```

---

## Test Data Sets

### Standard Test Case
```json
{
  "name": "Michael Thompson",
  "email": "michael.thompson@example.com",
  "subject": "Wedding Planning Services",
  "message": "We are getting married on June 15th and would like to discuss your wedding planning services. Please provide information about your packages and availability."
}
```

### Edge Cases
```json
{
  "name": "AB",
  "email": "a@b.co",
  "subject": "X",
  "message": "1234567890"
}
```

### Maximum Length
```json
{
  "name": "A very very very very very very very very very long name with many characters here",
  "email": "verylongemailaddress@verylongdomainname.verylongextension.com",
  "subject": "This is a very long subject line that tests the maximum character limit for the subject field",
  "message": "This is a very long message that tests the maximum character limit. It contains multiple sentences and paragraphs to ensure the system handles long text content properly. [Continue to ~5000 characters]"
}
```

---

## Success Indicators ✅

You'll know everything is working when:

1. ✅ Backend starts without errors
2. ✅ Health check endpoint responds
3. ✅ Contact info endpoint returns data
4. ✅ Form submission returns success response
5. ✅ Admin receives email notification
6. ✅ User receives confirmation email
7. ✅ Frontend shows success notification
8. ✅ Form clears after submission
9. ✅ Validation errors prevent invalid submissions
10. ✅ No browser console errors

---

## Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| Server won't start | Check port 5000 is free, run `npm install` |
| CORS errors | Add frontend URL to server.js CORS config |
| Emails not sending | Verify .env credentials, check Gmail App Password |
| Validation errors | Check input meets requirements (lengths, format) |
| 404 errors | Verify endpoint URL is correct |
| Port in use | Change PORT in .env or kill process on port 5000 |

---

**Happy Testing! 🧪**
