# Migration Guide: Building Without Vercel and Resend

This document provides step-by-step instructions for migrating the Psychotherapist Website to run without Vercel and Resend dependencies.

## Table of Contents

1. [Overview](#overview)
2. [Replacing Vercel](#replacing-vercel)
3. [Replacing Resend](#replacing-resend)
4. [Storage Options](#storage-options)
5. [Deployment Options](#deployment-options)
6. [Step-by-Step Migration](#step-by-step-migration)

---

## Overview

### Current Dependencies

**Vercel-specific:**
- Serverless functions in `/api` folder (Vercel-specific format)
- `@vercel/node` package (devDependency)
- `vercel` CLI (devDependency)
- `vercel.json` configuration file
- `@vercel/kv` package (optional, has fallback)

**Resend-specific:**
- `resend` package for email sending
- Used in: `api/book-consultation.js`, `api/cancel-booking.js`, `api/test-email.js`, `server/index.js`

### What Already Works Standalone

✅ Express server in `server/index.js` - fully functional
✅ React frontend - framework agnostic
✅ Upstash Redis - works anywhere (not Vercel-specific)
✅ In-memory storage fallback - works anywhere

---

## Replacing Vercel

### Option 1: Use Existing Express Server (Recommended)

The project already has a complete Express server in `server/index.js` that provides all the same functionality as the Vercel serverless functions.

**What to do:**
1. The Express server already exists and works
2. Just deploy it to any Node.js hosting platform
3. Update frontend API URLs to point to your server

**Files to modify:**
- `src/components/SchedulingPage.tsx` - Update `API_URL` logic
- `src/components/CancelBookingPage.tsx` - Update `API_URL` logic
- `src/components/BookingConfirmationPage.tsx` - Update `API_URL` logic

**Files to remove (optional):**
- `/api` folder (Vercel serverless functions)
- `vercel.json`
- `@vercel/node` and `vercel` from `package.json`

### Option 2: Convert API Routes to Express

If you want to keep the API structure but use Express:

1. Move code from `/api/*.js` to Express routes in `server/index.js`
2. Convert Vercel function format to Express routes:

```javascript
// Vercel format (current)
module.exports = async (req, res) => {
  // handler code
};

// Express format (new)
app.post('/api/book-consultation', async (req, res) => {
  // same handler code
});
```

**Files to convert:**
- `api/book-consultation.js` → Express route
- `api/cancel-booking.js` → Express route
- `api/availability.js` → Express route
- `api/booking-details.js` → Express route
- `api/health.js` → Express route
- `api/test-email.js` → Express route

---

## Replacing Resend

### Option 1: Nodemailer with SMTP (Recommended for Personal Use)

**Pros:**
- Free with Gmail/Outlook
- Works with any SMTP server
- Simple setup
- No API key limits for personal use

**Cons:**
- Gmail has daily sending limits (~500 emails/day)
- Requires app password setup

**Installation:**
```bash
npm install nodemailer
npm uninstall resend
```

**Code Changes:**

Replace in `server/index.js` and all API files:

```javascript
// Old (Resend)
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: email,
  subject: 'Subject',
  html: htmlContent
});

// New (Nodemailer)
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // your-email@gmail.com
    pass: process.env.EMAIL_PASSWORD // app password
  }
});

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'Subject',
  html: htmlContent
});
```

**Environment Variables:**
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Gmail Setup:**
1. Enable 2-factor authentication
2. Generate an app password: https://myaccount.google.com/apppasswords
3. Use the app password in `EMAIL_PASSWORD`

### Option 2: SendGrid

**Pros:**
- Free tier: 100 emails/day
- Reliable delivery
- Good analytics

**Cons:**
- Requires account setup
- API key management

**Installation:**
```bash
npm install @sendgrid/mail
npm uninstall resend
```

**Code Changes:**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  from: 'your-verified-email@example.com',
  to: email,
  subject: 'Subject',
  html: htmlContent
});
```

**Environment Variable:**
```
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Option 3: Mailgun

**Pros:**
- Free tier: 5,000 emails/month
- Good for production
- Reliable

**Cons:**
- Requires domain verification
- More complex setup

**Installation:**
```bash
npm install mailgun.js form-data
npm uninstall resend
```

**Code Changes:**
```javascript
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY
});

await mg.messages.create(process.env.MAILGUN_DOMAIN, {
  from: `noreply@${process.env.MAILGUN_DOMAIN}`,
  to: email,
  subject: 'Subject',
  html: htmlContent
});
```

### Option 4: Remove Email Functionality

If you don't need emails:

1. Remove `resend` package
2. Comment out or remove email sending code
3. Keep booking functionality (bookings still stored)
4. Users see success message on website only

---

## Storage Options

### Current Setup

- **Upstash Redis** - Works anywhere, not Vercel-specific ✅
- **Vercel KV** - Vercel-specific, can be removed
- **In-memory** - Fallback, works but not persistent

### Alternative Storage Options

#### Option 1: Keep Upstash Redis (Recommended)
- Already configured
- Works on any platform
- Free tier available
- No changes needed

#### Option 2: PostgreSQL/MySQL
**Pros:**
- Relational database
- Good for complex queries
- Many hosting options

**Implementation:**
```bash
npm install pg  # for PostgreSQL
# or
npm install mysql2  # for MySQL
```

#### Option 3: MongoDB
**Pros:**
- NoSQL, flexible schema
- Easy to use
- Free tier on MongoDB Atlas

**Implementation:**
```bash
npm install mongodb
```

#### Option 4: SQLite
**Pros:**
- File-based, no server needed
- Perfect for small projects
- Zero configuration

**Cons:**
- Not suitable for high traffic
- File system access required

**Implementation:**
```bash
npm install better-sqlite3
```

#### Option 5: File-based JSON Storage
**Pros:**
- Simplest option
- No dependencies
- Good for development

**Cons:**
- Not suitable for production
- No concurrent access handling

---

## Deployment Options

### Option 1: Railway (Recommended - Easy)

**Pros:**
- Very easy setup
- Free tier available
- Automatic deployments from GitHub
- Built-in PostgreSQL/Redis

**Steps:**
1. Sign up at https://railway.app
2. Connect GitHub repository
3. Add environment variables
4. Deploy!

**Pricing:** Free tier available, then $5/month

### Option 2: Render

**Pros:**
- Free tier available
- Easy setup
- Automatic SSL

**Steps:**
1. Sign up at https://render.com
2. Create new Web Service
3. Connect GitHub
4. Set build command: `npm install && npm run build`
5. Set start command: `node server/index.js`

**Pricing:** Free tier available, then $7/month

### Option 3: DigitalOcean App Platform

**Pros:**
- Reliable
- Good documentation
- $5/month starting

**Steps:**
1. Sign up at https://www.digitalocean.com
2. Create App
3. Connect GitHub
4. Configure build/start commands

**Pricing:** $5/month minimum

### Option 4: Self-Hosted VPS

**Pros:**
- Full control
- Can be cheapest option
- Learn server management

**Cons:**
- Requires server management
- Need to handle SSL, updates, etc.

**Providers:**
- DigitalOcean Droplets ($4/month)
- Linode ($5/month)
- Vultr ($2.50/month)
- AWS EC2 (pay as you go)

**Setup:**
1. Rent VPS
2. Install Node.js
3. Clone repository
4. Set up PM2 for process management
5. Configure Nginx as reverse proxy
6. Set up SSL with Let's Encrypt

### Option 5: Netlify (Frontend) + Separate Backend

**Pros:**
- Great for static frontend
- Free tier

**Cons:**
- Need separate backend hosting
- More complex setup

---

## Step-by-Step Migration

### Phase 1: Replace Resend with Nodemailer

1. **Install Nodemailer:**
   ```bash
   npm install nodemailer
   ```

2. **Remove Resend:**
   ```bash
   npm uninstall resend
   ```

3. **Update `server/index.js`:**
   - Replace Resend imports with Nodemailer
   - Update email sending code (see examples above)
   - Update environment variables

4. **Update API files** (if keeping Vercel):
   - `api/book-consultation.js`
   - `api/cancel-booking.js`
   - `api/test-email.js`

5. **Set environment variables:**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

6. **Test email sending locally**

### Phase 2: Remove Vercel Dependencies (Optional)

1. **Move API routes to Express:**
   - Copy code from `/api/*.js` to `server/index.js`
   - Convert to Express routes
   - Test all endpoints

2. **Update frontend API URLs:**
   - Update `getApiUrl()` functions in components
   - Point to your Express server URL

3. **Remove Vercel files:**
   ```bash
   rm -rf api/
   rm vercel.json
   ```

4. **Remove Vercel packages:**
   ```bash
   npm uninstall @vercel/node vercel @vercel/kv
   ```

5. **Update `package.json` scripts:**
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "start": "node server/index.js",
       "dev:server": "node server/index.js"
     }
   }
   ```

### Phase 3: Choose Storage

1. **Keep Upstash Redis** (easiest):
   - No changes needed
   - Already configured

2. **Or switch to database:**
   - Install database package
   - Update `getStorage()` functions
   - Migrate existing data (if any)

### Phase 4: Deploy

1. **Choose hosting platform** (Railway, Render, etc.)

2. **Set up repository:**
   - Ensure code is on GitHub
   - All changes committed

3. **Configure deployment:**
   - Connect GitHub to hosting platform
   - Set build command: `npm install && npm run build`
   - Set start command: `node server/index.js`
   - Add environment variables

4. **Deploy and test**

---

## Quick Reference: Environment Variables

### Current (Vercel + Resend)
```
RESEND_API_KEY=re_...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

### With Nodemailer
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
PORT=3001
```

### With SendGrid
```
SENDGRID_API_KEY=SG....
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
PORT=3001
```

---

## Testing Checklist

After migration, test:

- [ ] Frontend loads correctly
- [ ] Booking form submits successfully
- [ ] Availability checking works
- [ ] Emails are sent (check spam folder)
- [ ] Booking confirmation page works
- [ ] Cancellation works
- [ ] Storage persists bookings
- [ ] All API endpoints respond correctly

---

## Troubleshooting

### Emails not sending
- Check environment variables are set
- Verify SMTP credentials
- Check spam folder
- Review email service logs

### API endpoints not working
- Verify server is running
- Check CORS settings
- Verify API URLs in frontend
- Check server logs

### Storage not persisting
- Verify storage credentials
- Check storage connection
- Review storage logs
- Test storage directly

---

## Need Help?

Refer to this document when ready to migrate. The existing Express server in `server/index.js` already has most functionality needed - you mainly need to:
1. Replace Resend with your email service
2. Deploy to your chosen platform
3. Update frontend API URLs

Good luck with your migration! 🚀

