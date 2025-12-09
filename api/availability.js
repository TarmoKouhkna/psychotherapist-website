// API endpoint to check available time slots for a given date

// Define working hours (9 AM to 5 PM, 30-minute slots)
const WORKING_HOURS = {
  start: 9, // 9:00 AM
  end: 17, // 5:00 PM (17:00)
  slotDuration: 30 // minutes
};

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

// Generate all possible time slots for a day
function generateTimeSlots() {
  const slots = [];
  for (let hour = WORKING_HOURS.start; hour < WORKING_HOURS.end; hour++) {
    for (let minute = 0; minute < 60; minute += WORKING_HOURS.slotDuration) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  return slots;
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
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    // Validate date format
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return res.status(400).json({ error: 'Cannot book appointments in the past' });
    }

    // Get all possible time slots
    const allSlots = generateTimeSlots();

    // Get booked appointments for this date
    let bookedSlots = [];
    try {
      const storage = await getStorage();
      const bookingsKey = `bookings:${date}`;
      const bookings = await storage.get(bookingsKey) || [];
      bookedSlots = bookings.map(booking => booking.time);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Continue with empty booked slots if there's an error
    }

    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      date,
      availableSlots,
      allSlots,
      bookedSlots
    });

  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({
      error: 'Sisemine serveri viga',
      message: 'Vaba aegade kontrollimisel tekkis viga. Palun proovige hiljem uuesti.'
    });
  }
};

