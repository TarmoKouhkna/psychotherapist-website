import { Hero } from "./Hero";
import { About } from "./About";
import { Services } from "./Services";
import { Contact } from "./Contact";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

export function HomePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}
