const { Resend } = require('resend');

const CALENDLY_LINK = 'https://calendly.com/tarmokouhkna/30min';
const THERAPIST_EMAIL = 'tarmokouhkna@gmail.com';

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
          <p><strong>Eelistatud kellaaeg:</strong> ${preferredTime}</p>
          <p><strong>Konsultatsiooni tüüp:</strong> ${formattedConsultationType}</p>
          ${message ? `<p><strong>Lisainfo:</strong><br>${message}</p>` : ''}
        </div>
        <p style="margin-top: 30px; color: #78716c;">
          Palun võtke kliendiga ühendust, et kinnitada kohtumine, või kasutage oma Calendly linki broneerimiseks.
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
          <p><strong>Eelistatud kellaaeg:</strong> ${preferredTime}</p>
          <p><strong>Konsultatsiooni tüüp:</strong> ${formattedConsultationType}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${CALENDLY_LINK}" 
             style="background-color: #0d9488; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            Broneeri oma kohtumine Calendly-s
          </a>
        </div>
        <p style="margin-top: 30px;">
          Saate kasutada ka allolevat linki, et broneerida oma kohtumine otse:
        </p>
        <p style="word-break: break-all; color: #0d9488;">
          <a href="${CALENDLY_LINK}" style="color: #0d9488;">${CALENDLY_LINK}</a>
        </p>
        <p style="margin-top: 30px; color: #78716c;">
          Vaatan teie taotlust üle ja võtan teiega 24 tunni jooksul ühendust, et kinnitada teie kohtumine. Kui teil on küsimusi või peate muudatusi tegema, ärge kartke ühendust võtta.
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

    // Success response
    res.status(200).json({ 
      success: true,
      message: 'Konsultatsioonitaotlus edukalt esitatud. Kontrollige oma e-posti kinnituse jaoks.',
      calendlyLink: CALENDLY_LINK
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Sisemine serveri viga',
      message: 'Tekkis ootamatu viga. Palun proovige hiljem uuesti.'
    });
  }
};

