const { Resend } = require('resend');
const crypto = require('crypto');

const THERAPIST_EMAIL = 'tarmokouhkna@gmail.com';

// Initialize Resend
if (!process.env.RESEND_API_KEY) {
  console.error('ERROR: RESEND_API_KEY is not set in environment variables');
}
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to get storage (Upstash Redis, Vercel KV, or fallback)
async function getStorage() {
  // Try Upstash Redis first (recommended for Vercel)
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Redis } = require('@upstash/redis');
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      return {
        get: async (key) => {
          const data = await redis.get(key);
          return data ? JSON.parse(data) : null;
        },
        set: async (key, value) => {
          await redis.set(key, JSON.stringify(value));
        },
        del: async (key) => {
          await redis.del(key);
        }
      };
    } catch (e) {
      console.warn('Upstash Redis not available:', e.message);
    }
  }
  
  // Try Vercel KV (legacy, if still available)
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const { kv } = require('@vercel/kv');
      return kv;
    } catch (e) {
      console.warn('Vercel KV not available, using fallback storage');
    }
  }
  
  // Fallback to in-memory (for development)
  if (!global.bookingsStorage) {
    global.bookingsStorage = {};
  }
  return {
    get: async (key) => {
      const data = global.bookingsStorage[key];
      return data ? JSON.parse(data) : null;
    },
    set: async (key, value) => {
      global.bookingsStorage[key] = JSON.stringify(value);
    },
    del: async (key) => {
      delete global.bookingsStorage[key];
    }
  };
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        error: 'Puudub tühistamise token',
        message: 'Tühistamise link on vigane.'
      });
    }

    const storage = await getStorage();
    
    // Get booking by cancellation token
    const bookingKey = `booking:${token}`;
    const booking = await storage.get(bookingKey);

    if (!booking) {
      return res.status(404).json({ 
        error: 'Broneeringut ei leitud',
        message: 'See broneering on juba tühistatud või seda ei eksisteeri.'
      });
    }

    const { date, time, firstName, lastName, email, phone, consultationType } = booking;

    // Format date for display
    const formattedDate = new Date(date).toLocaleDateString('et-EE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Remove booking from storage
    await storage.del(bookingKey);
    
    // Also remove from date-based index
    const dateKey = `bookings:${date}`;
    const dateBookings = await storage.get(dateKey) || [];
    const updatedBookings = dateBookings.filter(b => b.token !== token);
    await storage.set(dateKey, updatedBookings);

    // Send cancellation confirmation emails
    const fromEmail = 'onboarding@resend.dev';

    // Email to user
    const userCancellationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0d9488; margin-bottom: 20px;">Broneering on tühistatud</h2>
        <p>Lugupeetud ${firstName},</p>
        <p>Teie broneering on edukalt tühistatud.</p>
        <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0d9488; margin-top: 0;">Tühistatud broneering</h3>
          <p><strong>Kuupäev:</strong> ${formattedDate}</p>
          <p><strong>Kellaaeg:</strong> ${time}</p>
        </div>
        <p style="margin-top: 30px; color: #78716c;">
          Kui soovite uue broneeringu teha, palun külastage meie veebilehte uuesti.
        </p>
        <p style="margin-top: 20px;">
          Parimate soovidega,<br>
          Teie terapeut
        </p>
      </div>
    `;

    // Email to therapist
    const therapistCancellationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0d9488; margin-bottom: 20px;">Broneering on tühistatud</h2>
        <p>Broneering on tühistatud. Siin on üksikasjad:</p>
        <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0d9488; margin-top: 0;">Kliendi andmed</h3>
          <p><strong>Nimi:</strong> ${firstName} ${lastName}</p>
          <p><strong>E-post:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
        </div>
        <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0d9488; margin-top: 0;">Tühistatud kohtumine</h3>
          <p><strong>Kuupäev:</strong> ${formattedDate}</p>
          <p><strong>Kellaaeg:</strong> ${time}</p>
          <p><strong>Konsultatsiooni tüüp:</strong> ${consultationType}</p>
        </div>
        <p style="margin-top: 30px; color: #78716c;">
          See aeg on nüüd vaba ja saab uuesti broneerida.
        </p>
      </div>
    `;

    // Send cancellation emails
    await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Teie broneering on tühistatud',
        html: userCancellationHtml,
      }),
      resend.emails.send({
        from: fromEmail,
        to: THERAPIST_EMAIL,
        subject: `Broneering tühistatud: ${firstName} ${lastName}`,
        html: therapistCancellationHtml,
      })
    ]);

    res.json({
      success: true,
      message: 'Broneering on edukalt tühistatud. Aeg on nüüd vaba.'
    });

  } catch (error) {
    console.error('Cancellation error:', error);
    res.status(500).json({
      error: 'Sisemine serveri viga',
      message: 'Tühistamisel tekkis viga. Palun proovige hiljem uuesti.'
    });
  }
};

