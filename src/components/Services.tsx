import { Brain, HeartHandshake, Users2, Sparkles } from "lucide-react";

export function Services() {
  const services = [
    {
      icon: Brain,
      title: "Individuaalne teraapia",
      description:
        "Üks-ühele sessioonid, mis keskenduvad teie unikaalsetele vajadustele, aidates teil töötada läbi ärevuse, depressiooni, trauma ja elumuutustega.",
    },
    {
      icon: HeartHandshake,
      title: "Paariteraapia",
      description:
        "Tugevdage oma suhet parema suhtlemise, konfliktide lahendamise ja sügavama emotsionaalse ühenduse kaudu.",
    },
    {
      icon: Users2,
      title: "Perekondlik teraapia",
      description:
        "Navigeerige perekonna dünaamikat ja lahendage konflikte toetavas keskkonnas, mis soodustab tervendamist ja mõistmist.",
    },
    {
      icon: Sparkles,
      title: "Stressi ja ärevuse juhtimine",
      description:
        "Õppige praktilisi tehnikaid ja toimetulekustrateegiaid stressi juhtimiseks, ärevuse vähendamiseks ja üldise heaolu parandamiseks.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-stone-900 mb-4">Pakutavad teenused</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Pakun mitmeid terapeutilisi teenuseid, mis on kohandatud teie individuaalsetele vajadustele 
            ja aitavad teil saavutada oma vaimse tervise eesmärke.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-teal-100 rounded-lg w-fit mb-4">
                <service.icon className="w-8 h-8 text-teal-700" />
              </div>
              <h3 className="text-stone-900 mb-3">{service.title}</h3>
              <p className="text-stone-600">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-teal-50 p-8 rounded-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-stone-900 mb-4">Terapeutilised lähenemised</h3>
            <p className="text-stone-600 mb-6">
              Integreerin erinevaid tõenduspõhiseid lähenemisi, sealhulgas kognitiiv-käitumuslikku teraapiat (CBT), 
              tähelepanu põhist teraapiat ja isikustatud teraapiat, et luua isikupärastatud raviplaan.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["CBT", "Tähelepanu põhine", "Isikustatud", "Lahenduskeskne", "Traumateadlik"].map(
                (approach) => (
                  <span
                    key={approach}
                    className="px-4 py-2 bg-white text-stone-700 rounded-full text-sm"
                  >
                    {approach}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
