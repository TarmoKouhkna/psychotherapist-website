export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white mb-4">Psühhoteraapia</h3>
            <p className="text-sm">
              Litsentseeritud kliiniline psühholoog, kes pakub kaastundlikku, 
              tõenduspõhist teraapiat, et aidata teil õitseda.
            </p>
          </div>

          <div>
            <h4 className="text-white mb-4">Kiirlingid</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() =>
                    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-teal-400 transition-colors"
                >
                  Minust
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-teal-400 transition-colors"
                >
                  Teenused
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-teal-400 transition-colors"
                >
                  Kontakt
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Ressursid</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-teal-400 transition-colors cursor-pointer">
                Privaatsuspoliitika
              </li>
              <li className="hover:text-teal-400 transition-colors cursor-pointer">
                KKK
              </li>
              <li className="hover:text-teal-400 transition-colors cursor-pointer">
                Kliendivormid
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 text-center text-sm">
          <p>&copy; 2025 Psühhoteraapia. Kõik õigused kaitstud.</p>
          <p className="mt-2 text-stone-400">
            Kui teil on vaimse tervise hädaolukord, helistage 112 või enesetapu ennetamise telefonile 655 8088.
          </p>
        </div>
      </div>
    </footer>
  );
}
