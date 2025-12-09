import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Calendar, X, CheckCircle, AlertCircle } from "lucide-react";

const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return '';
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:3001';
};

const API_URL = getApiUrl();

export function CancelBookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Tühistamise link on vigane või puudub.');
    }
  }, [token]);

  const handleCancel = async () => {
    if (!token) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/cancel-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Tühistamine ebaõnnestus');
      }

      setStatus('success');
      setMessage(data.message || 'Broneering on edukalt tühistatud.');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Tühistamisel tekkis viga. Palun proovige uuesti.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center px-4">
        <main className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-700" />
          </div>
          <h2 className="text-stone-900 mb-4">Vigane link</h2>
          <p className="text-stone-600 mb-6">
            Tühistamise link on vigane või puudub.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors"
          >
            Tagasi avalehele
          </button>
        </main>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center px-4">
        <main className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-700" />
          </div>
          <h2 className="text-stone-900 mb-4">Broneering tühistatud</h2>
          <p className="text-stone-600 mb-6">
            {message}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors"
          >
            Tagasi avalehele
          </button>
        </main>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center px-4">
        <main className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-700" />
          </div>
          <h2 className="text-stone-900 mb-4">Viga</h2>
          <p className="text-stone-600 mb-6">
            {message}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors"
          >
            Tagasi avalehele
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center px-4">
      <main className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-700" />
        </div>
        <h2 className="text-stone-900 mb-4">Tühista broneering</h2>
        <p className="text-stone-600 mb-6">
          Kas olete kindel, et soovite oma broneeringu tühistada?
        </p>
        <div className="space-y-3">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Tühistamine...
              </>
            ) : (
              'Jah, tühista broneering'
            )}
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-stone-200 text-stone-700 px-6 py-3 rounded-lg hover:bg-stone-300 transition-colors"
          >
            Tagasi
          </button>
        </div>
      </main>
    </div>
  );
}

