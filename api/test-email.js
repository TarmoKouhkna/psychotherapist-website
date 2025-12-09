const { Resend } = require('resend');

const THERAPIST_EMAIL = 'tarmokouhkna@gmail.com';

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
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ 
        error: 'RESEND_API_KEY not configured',
        message: 'Please set RESEND_API_KEY in Vercel environment variables'
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { to = THERAPIST_EMAIL } = req.body;

    const testEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0d9488; margin-bottom: 20px;">Test e-kiri</h2>
        <p>See on test e-kiri, et kontrollida, kas Resend töötab korralikult.</p>
        <p>Kui saite selle e-kirja, tähendab see, et e-posti süsteem töötab!</p>
        <p style="margin-top: 30px; color: #78716c; font-size: 12px;">
          Aeg: ${new Date().toLocaleString('et-EE')}
        </p>
      </div>
    `;

    console.log('Sending test email to:', to);
    console.log('From: onboarding@resend.dev');
    console.log('Resend API Key present:', !!process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: to,
      subject: 'Test e-kiri - Psühhoteraapia veebileht',
      html: testEmailHtml,
    });

    if (result.error) {
      console.error('Email sending error:', JSON.stringify(result.error, null, 2));
      return res.status(500).json({
        error: 'E-kirja saatmine ebaõnnestus',
        message: result.error.message || 'Tundmatu viga',
        details: result.error
      });
    }

    console.log('Email sent successfully:', result.data?.id);

    res.json({
      success: true,
      message: `Test e-kiri saadetud aadressile ${to}`,
      emailId: result.data?.id,
      note: 'Kontrollige oma e-posti (ka spämm kaustas)'
    });

  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      error: 'Sisemine viga',
      message: error.message || 'E-kirja saatmisel tekkis viga'
    });
  }
};

