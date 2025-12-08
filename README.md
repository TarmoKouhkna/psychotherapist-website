
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

  - Meeting booking form with email notifications via Resend API
  - Automatic email confirmation to users with Calendly link
  - Notification emails to therapist with booking details
  - Integration with Calendly for appointment scheduling
  