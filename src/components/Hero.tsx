import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="pt-16 bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-stone-900 mb-6">
              Leidke rahu, kasv ja tervendamine
            </h1>
            <p className="text-stone-600 mb-8">
              Tere tulemast turvalisesse ruumi, kus saate uurida oma mõtteid, emotsioone ja kogemusi. 
              Koos töötame tervislikuma ja täitvama elu ehitamise poole.
            </p>
            <button
              onClick={() => navigate("/schedule")}
              className="bg-teal-700 text-white px-8 py-3 rounded-lg hover:bg-teal-800 transition-colors"
            >
              Broneeri konsultatsioon
            </button>
          </div>
          <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1754294437684-7898b3701ac7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVyYXB5JTIwb2ZmaWNlJTIwY2FsbXxlbnwxfHx8fDE3NjUxNzYwOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Calm therapy office environment"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}