# Backend Server Setup

## Environment Variables

Create a `.env` file in the `server/` directory with the following:

```
RESEND_API_KEY=re_agprYJ5H_Mn3ey76HXGJy97pufPJUojy4
PORT=3001
```

## Running the Server

From the project root, run:

```bash
npm run server
```

Or:

```bash
npm run dev:server
```

The server will start on port 3001 by default.

## API Endpoints

### POST /api/book-consultation

Handles consultation form submissions and sends emails via Resend API.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "preferredDate": "2024-01-15",
  "preferredTime": "10:00 AM",
  "consultationType": "individual",
  "message": "Optional message"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Consultation request submitted successfully...",
  "calendlyLink": "https://calendly.com/tarmokouhkna/30min"
}
```

### GET /api/health

Health check endpoint to verify server is running.

