import { Hero } from "../components/Hero";
import { Trust } from "../components/Trust";
import { Services } from "../components/Services";
import { Pricing } from "../components/Pricing";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { LocationSection } from "../components/LocationSection";
import { Contact } from "../components/Contact";
import { FinalCtaStrip } from "../components/FinalCtaStrip";

export default function HomePage() {
  return (
    <div className="w-full">
      <section id="home" className="w-full">
        <Hero />
      </section>

      <div className="relative w-full">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 mandala-pattern opacity-30 pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-24 sm:space-y-32 py-20">
            <section id="trust">
              <Trust />
            </section>
          </div>
        </div>

        {/* Full-width Services Section */}
        <section id="services" className="w-full">
          <Services />
        </section>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-24 sm:space-y-32 py-20">
            <section id="pricing">
              <Pricing />
            </section>

            <section id="why-us">
              <WhyChooseUs />
            </section>

            <section id="location">
              <LocationSection />
            </section>

            <section id="contact">
              <Contact />
            </section>
          </div>
        </div>

        <section className="w-full px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <FinalCtaStrip />
          </div>
        </section>
      </div>
    </div>
  );
}

