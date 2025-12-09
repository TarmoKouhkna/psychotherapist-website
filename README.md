
  # Psychotherapist Website

  This is a code bundle for Psychotherapist Website. The original project is available at https://www.figma.com/design/aIxI2fdyAwK5Lp24i060OP/Psychotherapist-Website.

  ## Setup

  1. Install dependencies:
     ```bash
     npm i
     ```

  2. Set up environment variables:
     - The `.env` file in the `server/` directory has been created with the Resend API key
     - If you need to recreate it, copy `server/.env.example` to `server/.env` and add your API key

  ## Running the Application

  You need to run both the frontend and backend servers:

  **Terminal 1 - Frontend:**
  ```bash
  npm run dev
  ```
  Frontend runs on http://localhost:3000

  **Terminal 2 - Backend:**
  ```bash
  npm run server
  ```
  Backend runs on http://localhost:3001

  ## Features

  - **Custom Booking System**: Real-time availability checking
  - **Dynamic Time Slots**: Only available times are shown based on selected date
  - **Email Notifications**: Automatic emails to both user and therapist via Resend API
  - **Cancellation System**: Both parties can cancel appointments via email links
  - **Booking Storage**: Appointments are stored and managed automatically

  ## Email Setup (Important!)

  **Current Status:** The system uses `onboarding@resend.dev` which only sends to verified emails (like your therapist email).

  **To send emails to all users:**
  1. Go to [https://resend.com/domains](https://resend.com/domains)
  2. Add and verify your domain (e.g., `yourdomain.com`)
  3. Update the `fromEmail` in `api/book-consultation.js` to use your verified domain (e.g., `noreply@yourdomain.com`)
  4. Redeploy

  Until domain verification, only the therapist will receive emails.

  ## Storage Setup (Production)

  For production, you need persistent storage. The easiest way is to use **Upstash Redis** (free tier available):

  ### Option 1: Upstash Redis (Recommended - Free Tier Available)

  1. Go to [https://upstash.com](https://upstash.com) and sign up (free)
  2. Create a new Redis database
  3. Copy the **REST API URL** and **REST API Token**
  4. In Vercel Dashboard → Your Project → Settings → Environment Variables, add:
     - `UPSTASH_REDIS_REST_URL` = (your REST API URL)
     - `UPSTASH_REDIS_REST_TOKEN` = (your REST API Token)
  5. Redeploy your project

  ### Option 2: Use In-Memory Storage (Development Only)

  Without Redis, the system uses in-memory storage. **Bookings will be lost when the server restarts**, so this is only suitable for testing.
  
