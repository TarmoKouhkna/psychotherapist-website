import { Award, BookOpen, Heart, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1758273241090-b7d744465ce6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVyYXBpc3QlMjBjb25zdWx0YXRpb258ZW58MXx8fHwxNzY1MTc2MDkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Professional therapy consultation"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-stone-900 mb-6">Minust</h2>
            <p className="text-stone-600 mb-6">
              Üle 15 aasta kogemusega kliinilises psühholoogias spetsialiseerun ma inimeste abistamisele 
              elu väljakutsete ületamisel tõenduspõhiste terapeutiliste lähenemiste kaudu. 
              Minu praktika põhineb kaastundel, mõistmisel ja pühendumusel teie heaolule.
            </p>
            <p className="text-stone-600 mb-8">
              Usun, et kõigil on võime kasvada ja terveneda. Minu roll on pakkuda 
              toetavat keskkonda, kus saate uurida oma muresid, arendada toimetulekustrateegiaid 
              ja töötada mõttekate muutuste poole.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Award className="w-6 h-6 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-stone-900 mb-1">Litsentseeritud psühholoog</h3>
                  <p className="text-stone-600 text-sm">Kliinilise psühholoogia doktor</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-stone-900 mb-1">15+ aastat</h3>
                  <p className="text-stone-600 text-sm">Kliiniline kogemus</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Users className="w-6 h-6 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-stone-900 mb-1">500+ klienti</h3>
                  <p className="text-stone-600 text-sm">Edukalt ravitud</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Heart className="w-6 h-6 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-stone-900 mb-1">Holistiline lähenemine</h3>
                  <p className="text-stone-600 text-sm">Vaim, keha ja hing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
