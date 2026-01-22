# Deployment Guide - Viochie Events Backend

Complete guide for deploying your backend to production.

---

## Pre-Deployment Checklist

Before deploying, verify:

- [ ] Backend works locally (`npm start`)
- [ ] Email service configured and tested
- [ ] All validations working correctly
- [ ] Environment variables set in `.env`
- [ ] Frontend updated with production API URL
- [ ] CORS origins configured for production domain
- [ ] `.env` is in `.gitignore`
- [ ] No sensitive data in code
- [ ] Dependencies installed (`npm install`)
- [ ] Package.json has correct start script

---

## Option 1: Deploy to Heroku (Recommended for Beginners)

### Prerequisites
- Heroku account (https://www.heroku.com)
- Heroku CLI installed (https://devcenter.heroku.com/articles/heroku-cli)
- Git repository initialized

### Step 1: Create Heroku App
```bash
heroku login
heroku create your-app-name
```

### Step 2: Set Environment Variables
```bash
heroku config:set PORT=5000
heroku config:set NODE_ENV=production
heroku config:set EMAIL_SERVICE=gmail
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set ADMIN_EMAIL=info@viochieevents.com
heroku config:set FRONTEND_URL=https://yourdomain.com
```

### Step 3: Deploy Code
```bash
git push heroku main
```
(Or `master` if that's your main branch)

### Step 4: Verify Deployment
```bash
heroku logs --tail
heroku open
```

### Step 5: Test Production API
```bash
curl https://your-app-name.herokuapp.com/api/health
```

### Tips for Heroku
- Dyos sleep after 30 mins of inactivity (free tier)
- Use paid tier for always-on apps
- Monitor logs: `heroku logs --tail`
- Scale dynos: `heroku ps:scale web=2`

---

## Option 2: Deploy to AWS (Scalable)

### Prerequisites
- AWS account
- EC2 instance (Ubuntu 20.04 recommended)
- SSH key pair for EC2
- Domain name (optional)

### Step 1: Launch EC2 Instance
1. Go to AWS Console > EC2
2. Click "Launch Instance"
3. Select "Ubuntu Server 20.04 LTS"
4. Choose instance type (t2.micro for free tier)
5. Configure security group:
   - Port 22 (SSH): Your IP
   - Port 80 (HTTP): Anywhere
   - Port 443 (HTTPS): Anywhere
   - Port 5000 (Custom): Anywhere

### Step 2: Connect to Instance
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

### Step 3: Install Node.js
```bash
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

### Step 4: Clone and Setup
```bash
git clone https://github.com/yourusername/viochie-events.git
cd viochie-events/backend
npm install
```

### Step 5: Create .env File
```bash
nano .env
```

Paste your environment variables:
```env
PORT=5000
NODE_ENV=production
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=info@viochieevents.com
FRONTEND_URL=https://yourdomain.com
```

Press `Ctrl+O`, `Enter`, `Ctrl+X` to save.

### Step 6: Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 start server.js --name "viochie-api"
pm2 startup
pm2 save
```

### Step 7: Setup Nginx (Reverse Proxy)
```bash
sudo apt-get install -y nginx
```

Edit Nginx config:
```bash
sudo nano /etc/nginx/sites-available/default
```

Replace content with:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

### Step 8: Setup HTTPS with Let's Encrypt
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Testing AWS Deployment
```bash
curl https://yourdomain.com/api/health
```

---

## Option 3: Deploy to DigitalOcean

### Prerequisites
- DigitalOcean account
- $4-5/month for smallest droplet
- SSH key configured

### Step 1: Create Droplet
1. Go to DigitalOcean > Droplets
2. Click "Create Droplet"
3. Choose Ubuntu 20.04
4. Select $4/month or higher
5. Add SSH key
6. Create droplet

### Step 2: Connect via SSH
```bash
ssh root@your-droplet-ip
```

### Step 3: Initial Setup
```bash
# Update system
apt update && apt upgrade -y

# Create non-root user
adduser viochie
usermod -aG sudo viochie
su - viochie

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 4: Clone Repository
```bash
git clone https://github.com/yourusername/viochie-events.git
cd viochie-events/backend
npm install
```

### Step 5: Configure Environment
```bash
nano .env
# Add your environment variables
```

### Step 6: Setup with PM2
```bash
sudo npm install -g pm2
pm2 start server.js --name "viochie-api"
pm2 startup
pm2 save
```

### Step 7: Setup Nginx
Follow AWS Nginx steps (same process)

### Step 8: Enable Firewall
```bash
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Costs
- Droplet: $4-5/month
- Managed Database (optional): $15/month
- Domain: $10-15/year

---

## Option 4: Deploy to Railway.app (Modern)

### Prerequisites
- Railway.app account
- GitHub account with repository

### Step 1: Create Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect GitHub account
5. Select your repository

### Step 2: Configure Variables
1. Click "Add Variable"
2. Add all environment variables:
   - PORT=5000
   - NODE_ENV=production
   - EMAIL_SERVICE=gmail
   - EMAIL_USER=...
   - EMAIL_PASSWORD=...
   - ADMIN_EMAIL=...

### Step 3: Deploy
1. Select `backend` as service
2. Click "Deploy"

### Step 4: Get URL
Your app URL will appear in the dashboard

### Costs
- $5-20/month depending on usage

---

## Option 5: Deploy to Render

### Prerequisites
- Render.com account
- GitHub repository

### Step 1: Create New Service
1. Go to https://render.com
2. Click "New +" > "Web Service"
3. Connect GitHub repository
4. Select repository

### Step 2: Configure Service
- **Name**: viochie-api
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 3: Add Environment Variables
1. Go to "Environment"
2. Add all variables

### Step 4: Deploy
Click "Create Web Service"

### Costs
- Free tier (sleeps after 15 mins inactivity)
- Paid tier: $7/month

---

## Option 6: Docker Deployment

### Create Dockerfile
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

### Create .dockerignore
```
node_modules
npm-debug.log
.env
.git
```

### Build Image
```bash
docker build -t viochie-api:latest .
```

### Run Container
```bash
docker run -p 5000:5000 \
  -e EMAIL_USER=your-email@gmail.com \
  -e EMAIL_PASSWORD=your-app-password \
  -e ADMIN_EMAIL=info@viochieevents.com \
  viochie-api:latest
```

### Push to Registry
```bash
docker push your-registry/viochie-api:latest
```

---

## Post-Deployment Configuration

### 1. Update Frontend
Update `js/contact.js` with production API URL:
```javascript
// Change from:
const API_URL = 'http://localhost:5000'

// To:
const API_URL = 'https://your-production-domain.com'
```

### 2. Configure CORS
Update `server.js` with production origins:
```javascript
origin: ['https://yourdomain.com', 'https://www.yourdomain.com']
```

### 3. Setup Custom Domain
If using Heroku:
```bash
heroku domains:add www.yourdomain.com
```

For AWS/DigitalOcean:
- Update DNS records to point to server IP
- Setup SSL with Let's Encrypt

### 4. Monitor Application
- Setup error tracking (Sentry.io)
- Monitor uptime (UptimeRobot.com)
- Check logs regularly

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal setup
sudo systemctl enable certbot.timer
```

### Update Nginx
Certbot auto-updates Nginx configuration

### Verify
```bash
curl -I https://yourdomain.com
```

---

## Backup & Recovery

### Backup Database (if using MongoDB)
```bash
mongodump --uri="mongodb://user:pass@host:port/database" --out=/backups/
```

### Backup Environment Variables
```bash
# Keep .env file backed up securely
# Never commit to git
# Store in secure location
```

### Auto-Backups
- Use provider's backup service
- Set up daily backups
- Test recovery process monthly

---

## Performance Optimization

### 1. Enable Compression
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Add Caching Headers
```javascript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

### 3. Database Indexing (if using DB)
```javascript
contactSchema.index({ createdAt: -1 });
```

### 4. Rate Limiting
```bash
npm install express-rate-limit
```

### 5. Load Balancing
For high traffic:
- Use multiple server instances
- Setup load balancer (Nginx, HAProxy)
- Use CDN for static assets

---

## Monitoring & Logging

### Log Aggregation
- **CloudWatch** (AWS)
- **Papertrail** (any host)
- **Loggly** (any host)

### Error Tracking
- **Sentry.io** - Error tracking
- **New Relic** - Performance monitoring
- **DataDog** - Infrastructure monitoring

### Uptime Monitoring
- **UptimeRobot.com** - Free uptime monitoring
- **StatusPage.io** - Public status page

---

## Troubleshooting Deployment

| Issue | Solution |
|-------|----------|
| App crashes on start | Check logs, verify dependencies installed |
| Email not working | Verify environment variables set in provider |
| CORS errors | Update CORS origins in server.js |
| High latency | Add caching, optimize database queries |
| Memory issues | Increase server resources or optimize code |

---

## Rollback Plan

### If deployment fails:
1. Keep previous version deployed
2. Check logs for errors
3. Fix issues locally
4. Test thoroughly
5. Re-deploy to staging first
6. Then deploy to production

---

## Maintenance Schedule

- **Daily**: Check error logs
- **Weekly**: Monitor performance metrics
- **Monthly**: Security updates
- **Quarterly**: Full system review
- **Yearly**: Scale capacity if needed

---

## Production Checklist

- [ ] HTTPS enabled
- [ ] Environment variables configured
- [ ] Error tracking setup
- [ ] Backup strategy implemented
- [ ] Monitoring enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Database backups scheduled
- [ ] Team access configured
- [ ] Documentation updated

---

**Deployment Complete! 🚀**

For issues, refer to platform-specific documentation or contact support.
