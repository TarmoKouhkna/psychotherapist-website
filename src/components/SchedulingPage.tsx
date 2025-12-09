import { useState, useEffect } from "react";
import { Calendar, Clock, User, Mail, Phone, MessageSquare, ArrowLeft, Loader2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Use Vercel API routes in production, localhost in development
const getApiUrl = () => {
  if (import.meta.env.PROD) {
    // In production on Vercel, use relative paths
    return '';
  }
  // In development, use localhost or custom URL
  return import.meta.env.VITE_API_URL || 'http://localhost:3001';
};

const API_URL = getApiUrl();
const CALENDLY_LINK = 'https://calendly.com/tarmokouhkna/30min';

export function SchedulingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    consultationType: "individual",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  // Auto-redirect to Calendly after 3 seconds
  useEffect(() => {
    if (submitted && redirectCountdown !== null) {
      if (redirectCountdown > 0) {
        const timer = setTimeout(() => {
          setRedirectCountdown(redirectCountdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        window.location.href = CALENDLY_LINK;
      }
    }
  }, [submitted, redirectCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiEndpoint = `${API_URL}/api/book-consultation`;
      console.log('Submitting to:', apiEndpoint);
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setSubmitted(true);
      setRedirectCountdown(3);
    } catch (err) {
      console.error('Submission error:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Ühenduse viga. Palun kontrollige oma internetiühendust ja proovige uuesti.');
      } else {
        setError(err instanceof Error ? err.message : 'Tekkis ootamatu viga. Palun proovige uuesti.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-teal-700" />
          </div>
          <h2 className="text-stone-900 mb-4">Täname!</h2>
          <p className="text-stone-600 mb-6">
            Teie konsultatsioonitaotlus on vastu võetud. Kontrollige oma e-posti kinnituse üksikasjade jaoks.
            {redirectCountdown !== null && redirectCountdown > 0 && (
              <span className="block mt-2 text-sm">
                Suunamine Calendly-sse {redirectCountdown} sekundi{redirectCountdown !== 1 ? '' : ''} pärast...
              </span>
            )}
          </p>
          <div className="space-y-3">
            <a
              href={CALENDLY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors flex items-center justify-center gap-2"
            >
              Broneeri Calendly-s
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-stone-200 text-stone-700 px-6 py-3 rounded-lg hover:bg-stone-300 transition-colors"
            >
              Tagasi avalehele
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-teal-700 hover:text-teal-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Tagasi avalehele
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-stone-900 mb-4">Broneeri konsultatsioon</h1>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Esimene samm parema vaimse tervise poole on julgus. Täitke allolev vorm 
              ja ma võtan teiega 24 tunni jooksul ühendust, et kinnitada teie kohtumine.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-stone-900 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Eesnimi *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  placeholder="Mari"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-stone-900 mb-2">
                  Perekonnanimi *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  placeholder="Tamm"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-stone-900 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  E-posti aadress *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  placeholder="mari.tamm@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-stone-900 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefoninumber *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  placeholder="+372 123 4567"
                />
              </div>
            </div>

            {/* Appointment Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="preferredDate" className="block text-stone-900 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Eelistatud kuupäev *
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  required
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label htmlFor="preferredTime" className="block text-stone-900 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Eelistatud kellaaeg *
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  required
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  <option value="">Vali kellaaeg</option>
                  <option value="9:00 AM">9:00</option>
                  <option value="10:00 AM">10:00</option>
                  <option value="11:00 AM">11:00</option>
                  <option value="12:00 PM">12:00</option>
                  <option value="1:00 PM">13:00</option>
                  <option value="2:00 PM">14:00</option>
                  <option value="3:00 PM">15:00</option>
                  <option value="4:00 PM">16:00</option>
                  <option value="5:00 PM">17:00</option>
                </select>
              </div>
            </div>

            {/* Consultation Type */}
            <div>
              <label htmlFor="consultationType" className="block text-stone-900 mb-2">
                Konsultatsiooni tüüp *
              </label>
              <select
                id="consultationType"
                name="consultationType"
                required
                value={formData.consultationType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
              >
                <option value="individual">Individuaalne teraapia</option>
                <option value="couples">Paariteraapia</option>
                <option value="family">Perekondlik teraapia</option>
                <option value="stress">Stressi ja ärevuse juhtimine</option>
                <option value="other">Muu</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-stone-900 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Lisainfo (valikuline)
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 resize-none"
                placeholder="Jagage palun kõiki konkreetseid muresid või küsimusi, mida soovite arutada..."
              />
            </div>

            {/* Privacy Notice */}
            <div className="bg-teal-50 p-4 rounded-lg">
              <p className="text-stone-600 text-sm">
                Teie privaatsus on oluline. Kogu esitatud teave hoitakse konfidentsiaalsena ja kasutatakse seda 
                ainult broneerimise eesmärgil. Vormi esitamisega nõustute, et teiega võetakse ühendust esitatud teabe alusel.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-900 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-teal-700 text-white px-12 py-4 rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saadetakse...
                  </>
                ) : (
                  'Taotleda konsultatsiooni'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Emergency Notice */}
        <div className="mt-8 bg-red-50 border border-red-200 p-6 rounded-lg">
          <p className="text-red-900 text-center">
            <strong>Kriisiabi:</strong> Kui teil on vaimse tervise hädaolukord, 
            helistage kohe 112 või enesetapu ennetamise telefonile 655 8088.
          </p>
        </div>
      </div>
    </div>
  );
}
