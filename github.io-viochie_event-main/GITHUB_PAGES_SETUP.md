# GitHub Pages Setup Guide

This guide explains how to properly configure your GitHub Pages website to work with the backend API.

## ✅ What Was Fixed

1. ✅ Website files moved to repository root
   - `index.html` now at root level
   - `css/`, `js/`, `img/` folders at root level
   - GitHub Pages can now properly serve the website

2. ✅ Updated API configuration in `js/contact.js`
   - Local development: `http://localhost:5000`
   - Production: Configured to accept custom backend URL

---

## 🚀 To Make Your Website Functional

You need to deploy the backend and update the API endpoint. Follow these steps:

### Step 1: Deploy Backend to Production

Choose one of these options:

**Option A: Heroku (Easiest)**
```bash
cd backend
heroku login
heroku create your-app-name
heroku config:set EMAIL_SERVICE=gmail
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set ADMIN_EMAIL=info@viochieevents.com
git push heroku main
```

**Option B: AWS, DigitalOcean, Railway, or Render**
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

### Step 2: Update API Endpoint

After deploying backend, get your backend URL:
- Heroku: `https://your-app-name.herokuapp.com`
- AWS: `https://your-domain.com`
- Other: Your deployed URL

Open `js/contact.js` and update line 7:

```javascript
// Before
: 'https://your-backend-url.herokuapp.com', // Replace with your production backend URL

// After (example with Heroku)
: 'https://my-viochie-api.herokuapp.com',
```

### Step 3: Update CORS in Backend

Edit `backend/server.js` to add your GitHub Pages domain:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',           // Local dev
    'https://yourusername.github.io',  // GitHub Pages URL
    'https://custom-domain.com'        // Custom domain (if applicable)
  ],
  credentials: true
}));
```

### Step 4: Test the Website

1. Visit your GitHub Pages URL: `https://yourusername.github.io/github.io-viochie_event-main/`
2. Or if you set up a custom domain: `https://yourdomain.com`
3. Fill out the contact form
4. You should receive confirmation emails

---

## 🔍 Troubleshooting

### Website loads but contact form doesn't work

**Problem:** "CORS error" in browser console  
**Solution:** Add your GitHub Pages domain to CORS in `backend/server.js`

**Problem:** "Cannot reach server"  
**Solution:** Verify backend URL in `js/contact.js` is correct and backend is deployed

**Problem:** "API endpoint not found"  
**Solution:** Make sure backend is running and accessible at the URL you specified

### Check Errors

1. Open the website in your browser
2. Press `F12` to open Developer Tools
3. Go to `Console` tab
4. Try submitting the form
5. You'll see error messages that help identify the issue

---

## 📝 Current Configuration

**Frontend:** GitHub Pages (Automatically deployed when you push to main branch)  
**Backend:** Needs manual deployment to production

**Your Repository:** `github.io-viochie_event-main`  
**GitHub Pages URL:** `https://yourusername.github.io/github.io-viochie_event-main/`

---

## 🔄 Development vs Production

### Local Development
```
Frontend: http://localhost:3000 (or open file locally)
Backend: http://localhost:5000
```

### Production (After Following This Guide)
```
Frontend: https://yourusername.github.io/github.io-viochie_event-main/
Backend: https://your-deployed-backend.com
```

---

## 📚 Next Steps

1. Deploy the backend (see Step 1 above)
2. Update API endpoint in `js/contact.js`
3. Update CORS in `backend/server.js`
4. Test the contact form
5. Submit to GitHub: `git add . && git commit -m "config: Update API endpoint for production" && git push`

**Questions?** See [README.md](README.md) or [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

**Last Updated:** January 20, 2026
