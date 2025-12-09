const { Resend } = require('resend');
const crypto = require('crypto');

const THERAPIST_EMAIL = 'tarmokouhkna@gmail.com';

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

// Helper function to format consultation type
function formatConsultationType(type) {
  const types = {
    individual: 'Individuaalne teraapia',
    couples: 'Paariteraapia',
    family: 'Perekondlik teraapia',
    stress: 'Stressi ja ärevuse juhtimine',
    other: 'Muu'
  };
  return types[type] || type;
}

// Initialize Resend
if (!process.env.RESEND_API_KEY) {
  console.error('ERROR: RESEND_API_KEY is not set in environment variables');
  throw new Error('RESEND_API_KEY environment variable is not configured');
}
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      preferredDate,
      preferredTime,
      consultationType,
      message
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !preferredDate || !preferredTime || !consultationType) {
      return res.status(400).json({ 
        error: 'Puuduvad kohustuslikud väljad',
        message: 'Palun täitke kõik kohustuslikud väljad.'
      });
    }

    // Normalize time format (handle both "09:00" and "9:00 AM" formats)
    const normalizeTime = (time) => {
      // Remove AM/PM and convert to HH:MM format
      let normalized = time.replace(/\s*(AM|PM)/i, '').trim();
      if (time.includes('PM') && !time.includes('12:')) {
        const [hours, minutes] = normalized.split(':');
        normalized = `${parseInt(hours) + 12}:${minutes}`;
      }
      // Ensure two-digit format
      const [hours, minutes] = normalized.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };
    
    const normalizedTime = normalizeTime(preferredTime);

    // Check if the time slot is still available
    const storage = await getStorage();
    const bookingsKey = `bookings:${preferredDate}`;
    const existingBookings = await storage.get(bookingsKey) || [];
    
    // Check if this time slot is already booked
    const isBooked = existingBookings.some(booking => {
      const bookingTime = normalizeTime(booking.time);
      return bookingTime === normalizedTime;
    });
    
    if (isBooked) {
      return res.status(409).json({ 
        error: 'Aeg on juba broneeritud',
        message: 'Valitud aeg on juba broneeritud. Palun valige teine aeg.'
      });
    }

    // Generate unique cancellation token
    const cancellationToken = crypto.randomBytes(32).toString('hex');
    
    // Get base URL for cancellation links
    const baseUrl = req.headers.origin || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const cancelUrl = `${baseUrl}/cancel?token=${cancellationToken}`;

    // Format the date for display (Estonian format)
    const formattedDate = new Date(preferredDate).toLocaleDateString('et-EE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedConsultationType = formatConsultationType(consultationType);

    // Email 1: Notification to therapist
    const therapistEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0d9488; margin-bottom: 20px;">Uus konsultatsioonitaotlus</h2>
        <p>Olete saanud uue konsultatsioonitaotluse. Siin on üksikasjad:</p>
        <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0d9488; margin-top: 0;">Kliendi andmed</h3>
          <p><strong>Nimi:</strong> ${firstName} ${lastName}</p>
          <p><strong>E-post:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
        </div>
        <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0d9488; margin-top: 0;">Kohtumise üksikasjad</h3>
          <p><strong>Eelistatud kuupäev:</strong> ${formattedDate}</p>
          <p><strong>Eelistatud kellaaeg:</strong> ${normalizedTime}</p>
          <p><strong>Konsultatsiooni tüüp:</strong> ${formattedConsultationType}</p>
          ${message ? `<p><strong>Lisainfo:</strong><br>${message}</p>` : ''}
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${cancelUrl}" 
             style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            Tühista broneering
          </a>
        </div>
        <p style="margin-top: 30px; color: #78716c; font-size: 12px;">
          Kui soovite seda broneeringut tühistada, kasutage ülalolevat linki.
        </p>
      </div>
    `;

    // Email 2: Confirmation to user
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0d9488; margin-bottom: 20px;">Täname teie konsultatsioonitaotluse eest</h2>
        <p>Lugupeetud ${firstName},</p>
        <p>Täname, et võtsite ühendust. Olen saanud teie konsultatsioonitaotluse ja ootan koostööd teiega.</p>
        <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0d9488; margin-top: 0;">Teie taotluse kokkuvõte</h3>
          <p><strong>Eelistatud kuupäev:</strong> ${formattedDate}</p>
          <p><strong>Eelistatud kellaaeg:</strong> ${normalizedTime}</p>
          <p><strong>Konsultatsiooni tüüp:</strong> ${formattedConsultationType}</p>
        </div>
        <p style="margin-top: 30px; color: #78716c;">
          Teie broneering on kinnitatud. Ootan koostööd teiega.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${cancelUrl}" 
             style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            Tühista broneering
          </a>
        </div>
        <p style="margin-top: 20px; color: #78716c; font-size: 12px;">
          Kui teil on küsimusi või peate broneeringut muutma, kasutage ülalolevat tühistamise linki.
        </p>
        <p style="margin-top: 20px;">
          Parimate soovidega,<br>
          Teie terapeut
        </p>
      </div>
    `;

    // Send both emails
    const fromEmail = 'onboarding@resend.dev';
    
    console.log('Attempting to send emails...');
    console.log('From:', fromEmail);
    console.log('To therapist:', THERAPIST_EMAIL);
    console.log('To user:', email);
    
    // Send notification to therapist (this will always work)
    const therapistResult = await resend.emails.send({
      from: fromEmail,
      to: THERAPIST_EMAIL,
      subject: `Uus konsultatsioonitaotlus ${firstName} ${lastName}-lt`,
      html: therapistEmailHtml,
    });

    // Try to send confirmation to user
    let userResult;
    try {
      userResult = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Täname teie konsultatsioonitaotluse eest',
        html: userEmailHtml,
      });
      
      if (userResult.error) {
        console.warn('Could not send to user email (domain verification needed):', userResult.error.message);
        userResult = { data: null, error: null };
      }
    } catch (err) {
      console.warn('Error sending to user email:', err.message);
      userResult = { data: null, error: null };
    }

    // Check if therapist notification was sent successfully
    if (therapistResult.error) {
      const errorDetails = therapistResult.error;
      console.error('Email sending error:', JSON.stringify(errorDetails, null, 2));
      return res.status(500).json({ 
        error: 'Teavituse e-posti saatmine ebaõnnestus',
        message: errorDetails?.message || 'Teavituse e-posti saatmisel tekkis viga. Palun proovige hiljem uuesti.',
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      });
    }

    // If user email failed, log it but don't fail the request
    if (userResult?.error) {
      console.warn('User confirmation email could not be sent:', userResult.error.message);
      console.warn('To send emails to clients, verify your domain at https://resend.com/domains');
    }

    // Store the booking
    const bookingData = {
      token: cancellationToken,
      date: preferredDate,
      time: normalizedTime, // Store normalized time
      firstName,
      lastName,
      email,
      phone,
      consultationType: formattedConsultationType,
      message,
      createdAt: new Date().toISOString()
    };

    // Save booking with cancellation token
    const bookingKey = `booking:${cancellationToken}`;
    await storage.set(bookingKey, bookingData);

    // Add to date-based index for availability checking
    existingBookings.push({
      token: cancellationToken,
      time: normalizedTime, // Store normalized time
      email,
      name: `${firstName} ${lastName}`
    });
    await storage.set(bookingsKey, existingBookings);

    // Success response
    res.status(200).json({ 
      success: true,
      message: 'Broneering on edukalt kinnitatud! Kontrollige oma e-posti kinnituse jaoks.',
      bookingId: cancellationToken
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Sisemine serveri viga',
      message: 'Tekkis ootamatu viga. Palun proovige hiljem uuesti.'
    });
  }
};

