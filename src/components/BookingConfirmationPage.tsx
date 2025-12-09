import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle, Home } from "lucide-react";

const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return '';
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:3001';
};

const API_URL = getApiUrl();

interface BookingData {
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consultationType: string;
  message?: string;
  createdAt: string;
}

export function BookingConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Kinnituse link on vigane või puudub.');
      setLoading(false);
      return;
    }

    // Fetch booking details
    fetch(`${API_URL}/api/booking-details?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.message || 'Broneeringut ei leitud.');
        } else {
          setBooking(data.booking);
        }
      })
      .catch(err => {
        console.error('Error fetching booking:', err);
        setError('Broneeringu andmete laadimisel tekkis viga.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto mb-4"></div>
          <p className="text-stone-600">Laadimine...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-stone-900 mb-4">Viga</h2>
          <p className="text-stone-600 mb-6">{error || 'Broneeringut ei leitud.'}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors"
          >
            Tagasi avalehele
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(booking.date).toLocaleDateString('et-EE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-700" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Broneering kinnitatud!</h1>
          <p className="text-stone-600">Teie broneering on edukalt registreeritud</p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-teal-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-stone-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-teal-700" />
              Kohtumise üksikasjad
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 mr-3 text-teal-700 mt-0.5" />
                <div>
                  <p className="text-sm text-stone-600">Kuupäev</p>
                  <p className="font-semibold text-stone-900">{formattedDate}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-3 text-teal-700 mt-0.5" />
                <div>
                  <p className="text-sm text-stone-600">Kellaaeg</p>
                  <p className="font-semibold text-stone-900">{booking.time}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MessageSquare className="w-5 h-5 mr-3 text-teal-700 mt-0.5" />
                <div>
                  <p className="text-sm text-stone-600">Konsultatsiooni tüüp</p>
                  <p className="font-semibold text-stone-900">{booking.consultationType}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-stone-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-stone-700" />
              Teie andmed
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <User className="w-5 h-5 mr-3 text-stone-700 mt-0.5" />
                <div>
                  <p className="text-sm text-stone-600">Nimi</p>
                  <p className="font-semibold text-stone-900">{booking.firstName} {booking.lastName}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 mr-3 text-stone-700 mt-0.5" />
                <div>
                  <p className="text-sm text-stone-600">E-post</p>
                  <p className="font-semibold text-stone-900">{booking.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 mr-3 text-stone-700 mt-0.5" />
                <div>
                  <p className="text-sm text-stone-600">Telefon</p>
                  <p className="font-semibold text-stone-900">{booking.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {booking.message && (
            <div className="bg-stone-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-stone-900 mb-2">Lisainfo</h2>
              <p className="text-stone-700">{booking.message}</p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <p className="text-sm text-blue-800">
            <strong>Märkus:</strong> Kui teil on küsimusi või peate broneeringut muutma, palun võtke meiega ühendust.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Tagasi avalehele
          </button>
        </div>
      </div>
    </div>
  );
}

