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

      <div className="relative w-full bg-gradient-to-b from-purple-black via-purple-dark to-purple-black">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="space-y-24 sm:space-y-32 py-20">
            <section id="trust">
              <Trust />
            </section>

            <section id="services">
              <Services />
            </section>

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

        <section className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 pb-20">
          <FinalCtaStrip />
        </section>
      </div>
    </div>
  );
}

