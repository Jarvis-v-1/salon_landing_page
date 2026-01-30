"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Maroon Background */}
      <div className="absolute inset-0 bg-maroon-gradient" />

      {/* Decorative Mandala - Top Left Corner (Quarter visible) */}
      <div className="absolute -top-[250px] -left-[250px] w-[500px] h-[500px] sm:-top-[350px] sm:-left-[350px] sm:w-[700px] sm:h-[700px] lg:-top-[450px] lg:-left-[450px] lg:w-[900px] lg:h-[900px] opacity-20 pointer-events-none">
        <Image
          src="/decorator.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Decorative Mandala - Bottom Right Corner (Quarter visible) */}
      <div className="absolute -bottom-40 -right-40 w-80 h-80 lg:w-[500px] lg:h-[500px] opacity-15 pointer-events-none">
        <Image
          src="/decorator.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left space-y-6"
            >
              {/* Logo - Large and Prominent */}
              <motion.div
                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="-mt-4 mb-8"
              >
                <div className="relative inline-block lg:text-left text-center">
                  <Image
                    src="/Logo.png"
                    alt="Swapna Beauty Parlour"
                    width={500}
                    height={150}
                    className="relative w-[280px] sm:w-[350px] lg:w-[420px] xl:w-[500px] h-auto object-contain"
                    priority
                  />
                </div>
              </motion.div>

              {/* Decorative Gold Line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "5rem" }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="hidden lg:block h-0.5 bg-gradient-to-r from-gold to-gold-light mb-6"
              />

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-cream leading-tight"
              >
                Feel Beautiful.
                <br />
                <span className="text-gold">Feel Confident.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-cream/80 text-base sm:text-lg max-w-xl mx-auto lg:mx-0"
              >
                Transform your beauty at our luxury salon in Duluth, GA. Expert
                stylists, premium services, and personalized care for every visit.
              </motion.p>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="inline-flex items-center gap-3 bg-gold/10 border border-gold/30 rounded-full px-5 py-2.5"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-cream font-semibold">4.9</span>
                <span className="text-cream/60 text-sm">on Google</span>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
              >
                <Link
                  href="#contact"
                  className="w-full sm:w-auto px-8 py-4 bg-gold text-maroon-900 font-bold text-lg rounded-full shadow-gold hover:bg-gold-light hover:scale-105 transition-all duration-300 text-center uppercase tracking-wider"
                >
                  Book Appointment
                </Link>
                <Link
                  href="tel:7705591521"
                  className="w-full sm:w-auto px-8 py-4 border-2 border-cream/50 text-cream font-semibold rounded-full hover:bg-cream/10 hover:border-cream transition-all duration-300 text-center"
                >
                  Call Now
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Side - Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative hidden lg:flex items-center justify-center"
            >
              {/* Decorative Frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[90%] h-[90%] border-2 border-gold/30 rounded-3xl transform rotate-3" />
                <div className="absolute w-[85%] h-[85%] border border-gold/20 rounded-3xl transform -rotate-2" />
              </div>
              
              {/* Main Image Container */}
              <div className="relative w-full aspect-[3/4] max-w-md rounded-2xl overflow-hidden border-4 border-gold/40 shadow-elegant-lg">
                <Image
                  src="/hero-image.webp"
                  alt="Swapna Beauty Parlour - Luxury Beauty Services"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 1024px) 0vw, 40vw"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/40 via-transparent to-transparent" />
              </div>

              {/* Decorative Corner Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 border-t-2 border-r-2 border-gold/50 rounded-tr-2xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 border-b-2 border-l-2 border-gold/50 rounded-bl-2xl" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Gold Decorative Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-cream/50 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-gold/50 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-gold"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

