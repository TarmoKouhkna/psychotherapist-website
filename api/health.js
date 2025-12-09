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

  res.json({ 
    status: 'ok', 
    message: 'Server töötab',
    hasResendApiKey: !!process.env.RESEND_API_KEY,
    resendApiKeyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 10) + '...' : 'pole määratud',
    resendStatus: process.env.RESEND_API_KEY ? 'configured ✅' : 'not configured ⚠️ - emails will not be sent',
    // Check for storage environment variables
    hasUpstashUrl: !!process.env.UPSTASH_REDIS_REST_URL,
    hasUpstashToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    hasKvRestUrl: !!process.env.KV_REST_API_URL,
    hasKvRestToken: !!process.env.KV_REST_API_TOKEN,
    // Storage status
    storage: (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
      ? 'Upstash Redis (persistent) ✅'
      : (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
        ? 'Vercel KV (persistent) ✅'
        : 'In-memory (temporary - bookings lost on restart) ⚠️'
  });
};

