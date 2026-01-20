# Viochie Events - System Architecture & Flow Diagrams

## Contact Form Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USER JOURNEY                                     │
└─────────────────────────────────────────────────────────────────────┘

1. USER FILLS FORM
   ┌──────────────────────────────┐
   │  Contact Form on Website     │
   │  - Name                      │
   │  - Email                     │
   │  - Subject                   │
   │  - Message                   │
   └──────────────┬───────────────┘
                  │
                  ▼
2. FRONTEND VALIDATION (JavaScript)
   ┌──────────────────────────────┐
   │  contact.js validates:       │
   │  ✓ Name not empty            │
   │  ✓ Email format              │
   │  ✓ Message length            │
   └──────────────┬───────────────┘
                  │
                  ▼ (if valid)
3. SEND TO BACKEND
   ┌──────────────────────────────┐
   │  POST /api/contact/submit    │
   │  Headers:                    │
   │  Content-Type: application/  │
   │  json                        │
   └──────────────┬───────────────┘
                  │
                  ▼
4. BACKEND VALIDATION
   ┌──────────────────────────────┐
   │  Express-validator checks:   │
   │  ✓ Name 2-100 chars          │
   │  ✓ Valid email format        │
   │  ✓ Message 10-5000 chars     │
   │  ✓ Sanitize input            │
   └──────────────┬───────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼ (valid)           ▼ (invalid)
5A. SEND EMAILS         5B. RETURN ERROR
    ┌─────────────────┐      ┌──────────────┐
    │ 2 emails sent:  │      │ Error JSON   │
    │                 │      │ 400 status   │
    │ 1. To Admin     │      └──────────────┘
    │ 2. To User      │
    └────────┬────────┘
             │
             ▼
6. RETURN SUCCESS
   ┌──────────────────────────────┐
   │ {                            │
   │   success: true,             │
   │   message: "Sent success.."  │
   │ }                            │
   └──────────────┬───────────────┘
                  │
                  ▼
7. FRONTEND SHOWS NOTIFICATION
   ┌──────────────────────────────┐
   │ Success popup notification   │
   │ "Your message sent!"         │
   │                              │
   │ Form cleared automatically   │
   └──────────────────────────────┘

```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INTERNET / USERS                            │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
          ┌────────────────┴────────────────┐
          │                                 │
          ▼                                 ▼
    ┌───────────────┐            ┌──────────────────┐
    │   FRONTEND    │            │   ADMIN/SUPPORT  │
    │               │            │                  │
    │ Website HTML  │            │ Email Inbox      │
    │ CSS           │            │                  │
    │ JavaScript    │            └──────┬───────────┘
    │ (contact.js)  │                   ▲
    └───────┬───────┘                   │
            │                   ┌───────┘
            │ POST Request      │
            │ JSON Data         │
            │                   │
            ▼                   │
    ┌──────────────────────────────────────┐
    │        BACKEND API SERVER            │
    │      (Express.js / Node.js)          │
    │                                      │
    │  POST /api/contact/submit ─────┐    │
    │      │                          │    │
    │      ├─ Validation Layer        │    │
    │      │  (express-validator)     │    │
    │      │                          │    │
    │      ├─ Business Logic          │    │
    │      │  (contactController.js)  │    │
    │      │                          │    │
    │      └─ Email Service ──────────┼────┼─────► Send Emails
    │         (nodemailer)            │    │   (Gmail/SMTP)
    │                                 │    │
    │  GET /api/contact/info ────────┘    │
    │  GET /api/health                    │
    │                                     │
    └─────────────────────────────────────┘

    Response JSON
         │
         ▼
    ┌──────────────┐
    │  FRONTEND    │
    │ Shows Result │
    └──────────────┘
```

---

## File Structure & Data Flow

```
Frontend Request Flow:
─────────────────────

index.html
    ├─ Renders form
    │
    └─ Includes js/contact.js
        │
        ├─ Listens to form submit
        │
        ├─ Validates input
        │
        └─ Sends POST to /api/contact/submit
             │
             ▼
Backend Processing:
────────────────────

server.js
    ├─ Receives request
    │
    ├─ CORS middleware ─► Checks origin
    │
    ├─ Express.json middleware ─► Parses JSON
    │
    └─ Route handler
        │
        └─ routes/contactRoutes.js
            │
            ├─ express-validator ─► Validates input
            │   ├─ Check name length (2-100)
            │   ├─ Validate email format
            │   ├─ Check subject length (max 200)
            │   └─ Validate message (10-5000)
            │
            └─ contactController.submitContact()
                │
                ├─ If invalid: Return 400 error
                │
                ├─ If valid: Create email content
                │   ├─ Admin notification
                │   └─ User confirmation
                │
                ├─ Call config/email.js
                │   └─ nodemailer sends emails
                │       ├─ Gmail SMTP
                │       └─ Sends to both addresses
                │
                └─ Return success response (200)

Response returns to Frontend:
─────────────────────────────

contact.js receives response
    │
    ├─ If success: Show notification + Clear form
    │
    └─ If error: Show error message

```

---

## Email Sending Process

```
┌─────────────────────────────────────┐
│      Contact Form Submitted         │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Create Email Objects              │
├─────────────────────────────────────┤
│ Email 1 - Admin Notification:       │
│   From: EMAIL_USER                  │
│   To: ADMIN_EMAIL                   │
│   Subject: New Contact Form         │
│   Body: User details + message      │
│                                     │
│ Email 2 - User Confirmation:        │
│   From: EMAIL_USER                  │
│   To: USER_EMAIL                    │
│   Subject: Thank you for contact    │
│   Body: Confirmation of receipt     │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Use Nodemailer Transport          │
│   (Gmail SMTP)                      │
├─────────────────────────────────────┤
│   Auth:                             │
│   - EMAIL_USER from .env            │
│   - EMAIL_PASSWORD from .env        │
│                                     │
│   Send Method: Promise.all()        │
│   - Parallel sending (faster)       │
│   - Both emails sent simultaneously │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Gmail SMTP Server                 │
│   - Validates credentials           │
│   - Sends emails                    │
│   - Receives delivery status        │
└────────────┬────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
   Admin      User Email
   Inbox      Inbox
```

---

## Database Schema (Optional Future)

```
If you want to store submissions in database:

contact_submissions (MongoDB example)
{
  _id: ObjectId
  name: String (required, 2-100 chars)
  email: String (required, valid format)
  subject: String (optional, max 200)
  message: String (required, 10-5000 chars)
  status: String (enum: 'new', 'read', 'replied')
  ipAddress: String
  userAgent: String
  createdAt: Date (default: now)
  updatedAt: Date
  adminNotes: String (optional)
  replyEmail: String (optional)
  replyDate: Date (optional)
}

Index on: createdAt (for sorting by date)
Index on: status (for filtering)
Index on: email (for finding user submissions)
```

---

## API Endpoint Flows

```
Endpoint 1: POST /api/contact/submit
──────────────────────────────────────

Request:
  POST http://localhost:5000/api/contact/submit
  Headers: {'Content-Type': 'application/json'}
  Body: {
    name: "John Doe",
    email: "john@example.com",
    subject: "Inquiry",
    message: "Long message here..."
  }

Validation Chain:
  1. Check Content-Type is JSON ✓
  2. Parse JSON body ✓
  3. Validate name (required, 2-100) ✓
  4. Validate email (required, valid format) ✓
  5. Validate subject (optional, max 200) ✓
  6. Validate message (required, 10-5000) ✓

Processing:
  1. Create admin email
  2. Create user email
  3. Send both emails (Promise.all)
  4. Log submission

Response (Success):
  Status: 200
  Body: {
    success: true,
    message: "Your message has been sent..."
  }

Response (Validation Error):
  Status: 400
  Body: {
    success: false,
    errors: [
      {param: "email", msg: "Valid email required"}
    ]
  }

Response (Server Error):
  Status: 500
  Body: {
    success: false,
    message: "An error occurred..."
  }


Endpoint 2: GET /api/contact/info
──────────────────────────────────

Request:
  GET http://localhost:5000/api/contact/info
  (No body needed)

Processing:
  1. Return hardcoded contact info

Response:
  Status: 200
  Body: {
    address: "123 Event Street...",
    phone: "(555) 123-4567",
    email: "info@viochieevents.com"
  }


Endpoint 3: GET /api/health
────────────────────────────

Request:
  GET http://localhost:5000/api/health
  (No body needed)

Processing:
  1. Return server status

Response:
  Status: 200
  Body: {
    status: "Server is running"
  }
```

---

## Environment Variables Flow

```
.env file (contains sensitive data)
  │
  ├─ PORT ─────────────────► Server listens on port
  │
  ├─ NODE_ENV ─────────────► Set production/development
  │
  ├─ EMAIL_SERVICE ────────► Gmail/Outlook/Yahoo
  │
  ├─ EMAIL_USER ───────────► Your email address
  │                         (Where emails sent from)
  │
  ├─ EMAIL_PASSWORD ───────► Gmail App Password
  │                         (Authentication)
  │
  ├─ ADMIN_EMAIL ──────────► info@viochieevents.com
  │                         (Where admin notifications go)
  │
  └─ FRONTEND_URL ─────────► For CORS validation
```

---

## Error Handling Flow

```
Request comes in
  │
  ▼
Try block
  │
  ├─ Validation check
  │  │
  │  ├─ Errors found? ──► Return 400 with errors
  │  │
  │  └─ Valid? ──────────┐
  │                      │
  ├─ Process data        │
  │  │                   │
  │  ├─ Error? ────►─────┼─► Log error
  │  │              │    │   Return 500
  │  │              │    │
  │  └─ Success ────┼────┼──────┐
  │                 │    │      │
  ├─ Send emails    │    │      │
  │  │              │    │      │
  │  ├─ Error? ─────┼────┼──────┴─► Catch block
  │  │              │    │          │
  │  └─ Success ────┼────┼──────┐   │
  │                 │    │      │   │
  ▼                 ▼    ▼      ▼   ▼
Return Response (200 success or error status)
```

---

## Deployment Architecture Example (Heroku)

```
┌──────────────────────────────────────────────────────┐
│              HEROKU (Production)                     │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────┐       │
│  │  Dyno (Container)                        │       │
│  │  ┌────────────────────────────────────┐  │       │
│  │  │  Node.js Application               │  │       │
│  │  │                                    │  │       │
│  │  │  ┌─── server.js                   │  │       │
│  │  │  │   ├─ Express app               │  │       │
│  │  │  │   ├─ Routes                    │  │       │
│  │  │  │   ├─ Controllers               │  │       │
│  │  │  │   └─ Email config              │  │       │
│  │  │  │                                │  │       │
│  │  │  └─ Listening on PORT             │  │       │
│  │  │                                    │  │       │
│  │  │  Environment Variables:            │  │       │
│  │  │  ├─ EMAIL_USER                    │  │       │
│  │  │  ├─ EMAIL_PASSWORD                │  │       │
│  │  │  └─ ADMIN_EMAIL                   │  │       │
│  │  │                                    │  │       │
│  │  └────────────────────────────────────┘  │       │
│  │                                           │       │
│  └──────────────────────────────────────────┘       │
│              ▲                                       │
│              │                                       │
│         HTTPS from                                   │
│         Heroku URL                                   │
│              │                                       │
└──────────────┼───────────────────────────────────────┘
               │
               ▼
        ┌─────────────┐
        │   Internet  │
        └─────────────┘
               │
      ┌────────┴────────┐
      │                 │
      ▼                 ▼
  Frontend          Admin Panel
  (Website)         (Future)
```

---

## Contact Form Component Lifecycle

```
1. PAGE LOAD
   ├─ HTML renders form
   └─ contact.js loaded and executed

2. FORM READY
   ├─ JavaScript finds form element
   ├─ Adds submit event listener
   └─ Form ready for input

3. USER INTERACTION
   ├─ User types in fields
   ├─ No validation yet (client-side optional)
   └─ User clicks "Send Message"

4. FORM SUBMISSION
   ├─ JavaScript prevents default submit
   ├─ Gets form values
   ├─ Validates locally
   ├─ Shows "Sending..." on button
   └─ Sends POST request

5. WAITING FOR RESPONSE
   ├─ Button disabled
   ├─ Network request in progress
   └─ User sees loading state

6. RESPONSE RECEIVED
   ├─ If success (200):
   │  ├─ Show success notification
   │  ├─ Clear form fields
   │  └─ Re-enable button
   │
   └─ If error (4xx/5xx):
      ├─ Show error notification
      ├─ Keep form data
      └─ Re-enable button (user can retry)

7. NOTIFICATION CLOSES
   ├─ Auto-closes after 5 seconds
   ├─ Or user clicks to dismiss
   └─ Ready for next submission
```

---

**Architecture diagrams created successfully!** 📊

Refer to these diagrams when:
- Understanding the flow
- Explaining to team members
- Debugging issues
- Designing extensions
