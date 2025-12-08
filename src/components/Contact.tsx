import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-stone-900 mb-4">Võtke ühendust</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Esimene samm võib olla raske. Ma olen siin, et seda lihtsamaks teha. 
            Võtke täna ühendust, et broneerida konsultatsioon.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-100 rounded-lg">
                  <Phone className="w-6 h-6 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-stone-900 mb-1">Telefon</h3>
                  <p className="text-stone-600">+372 123 4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-100 rounded-lg">
                  <Mail className="w-6 h-6 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-stone-900 mb-1">E-post</h3>
                  <p className="text-stone-600">tarmokouhkna@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-stone-900 mb-1">Asukoht</h3>
                  <p className="text-stone-600">
                    Online konsultatsioonid
                    <br />
                    või
                    <br />
                    Eesti
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-100 rounded-lg">
                  <Clock className="w-6 h-6 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-stone-900 mb-1">Tööaeg</h3>
                  <p className="text-stone-600">
                    Esmaspäev - Reede: 9:00 - 18:00
                    <br />
                    Laupäev: 10:00 - 14:00
                    <br />
                    Pühapäev: Suletud
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-teal-50 p-6 rounded-lg">
              <h3 className="text-stone-900 mb-3">Vastu võetud kindlustused</h3>
              <p className="text-stone-600 mb-4">
                Vastu võetakse enamik peamisi kindlustusplaane. Palun võtke ühendust, et kontrollida oma katet.
              </p>
              <p className="text-stone-600 text-sm">
                Eesti Haigekassa • Erastkindlustused
              </p>
            </div>
          </div>

          <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1764192114257-ae9ecf97eb6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMG5hdHVyZSUyMG1lZGl0YXRpb258ZW58MXx8fHwxNzY1MTQ3OTc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Peaceful nature scene"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
