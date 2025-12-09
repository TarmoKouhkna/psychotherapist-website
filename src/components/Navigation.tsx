import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  const goToScheduling = () => {
    navigate("/schedule");
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate("/")}
              className="text-teal-700 hover:text-teal-800 transition-colors"
            >
              Psühhoteraapia
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-stone-700 hover:text-teal-700 transition-colors"
            >
              Avaleht
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-stone-700 hover:text-teal-700 transition-colors"
            >
              Minust
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-stone-700 hover:text-teal-700 transition-colors"
            >
              Teenused
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-stone-700 hover:text-teal-700 transition-colors"
            >
              Kontakt
            </button>
            <button
              onClick={goToScheduling}
              className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition-colors"
            >
              Broneeri kohtumine
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-700 hover:text-teal-700"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div 
          className="md:hidden bg-white border-t"
          aria-hidden={!isOpen}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => scrollToSection("home")}
              className="block w-full text-left px-3 py-2 text-stone-700 hover:text-teal-700 hover:bg-stone-50 transition-colors"
            >
              Avaleht
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left px-3 py-2 text-stone-700 hover:text-teal-700 hover:bg-stone-50 transition-colors"
            >
              Minust
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="block w-full text-left px-3 py-2 text-stone-700 hover:text-teal-700 hover:bg-stone-50 transition-colors"
            >
              Teenused
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left px-3 py-2 text-stone-700 hover:text-teal-700 hover:bg-stone-50 transition-colors"
            >
              Kontakt
            </button>
            <button
              onClick={goToScheduling}
              className="block w-full text-left px-3 py-2 bg-teal-700 text-white hover:bg-teal-800 transition-colors rounded-lg mt-2"
            >
              Broneeri kohtumine
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}