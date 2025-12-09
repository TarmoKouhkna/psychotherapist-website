// API endpoint to get booking details by token (for confirmation page)

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ 
        error: 'Token is required',
        message: 'Kinnituse token on kohustuslik.'
      });
    }

    const storage = await getStorage();
    const bookingKey = `booking:${token}`;
    
    console.log('Looking for booking with key:', bookingKey);
    console.log('Storage type:', process.env.UPSTASH_REDIS_REST_URL ? 'Upstash Redis' : process.env.KV_REST_API_URL ? 'Vercel KV' : 'In-memory');
    
    let booking;
    try {
      booking = await storage.get(bookingKey);
      console.log('Booking found:', !!booking);
      if (booking) {
        console.log('Booking data keys:', Object.keys(booking));
      }
    } catch (error) {
      console.error('Error retrieving booking:', error);
      return res.status(500).json({
        error: 'Storage error',
        message: 'Broneeringu andmete laadimisel tekkis viga.'
      });
    }

    if (!booking) {
      console.log('Booking not found for token:', token.substring(0, 10) + '...');
      return res.status(404).json({ 
        error: 'Booking not found',
        message: 'Broneeringut ei leitud. Link võib olla aegunud või vigane.'
      });
    }

    // Return booking details (exclude sensitive data if needed)
    res.json({
      success: true,
      booking: {
        date: booking.date,
        time: booking.time,
        firstName: booking.firstName,
        lastName: booking.lastName,
        email: booking.email,
        phone: booking.phone,
        consultationType: booking.consultationType,
        message: booking.message,
        createdAt: booking.createdAt
      }
    });

  } catch (error) {
    console.error('Booking details error:', error);
    res.status(500).json({
      error: 'Sisemine serveri viga',
      message: 'Broneeringu andmete laadimisel tekkis viga.'
    });
  }
};

