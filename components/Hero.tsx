"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CallNowButton } from "./CallNowButton";

const heroImages = [
  "/hero-image.webp",
  "/gallery/1.jpeg",
  "/gallery/2.jpg",
  "/gallery/3.jpg",
  "/gallery/4.webp",
  "/gallery/5.webp",
  "/gallery/6.jpeg",
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <section className="relative h-screen min-h-[600px] max-h-[1200px] w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cool-white" />

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />

      {/* Content Container - Dynamic height fitting */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-4 lg:py-[clamp(1rem,3vh,3rem)]">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left space-y-5 lg:space-y-[clamp(0.5rem,1.5vh,1.5rem)]"
            >
              {/* Logo - Large and Prominent */}
              <motion.div
                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="mb-4 lg:mb-[clamp(0.5rem,2vh,2rem)]"
              >
                <div className="relative inline-block lg:text-left text-center">
                  <Image
                    src="/logo.png"
                    alt="Swapna Beauty Parlour"
                    width={500}
                    height={150}
                    className="relative w-[280px] sm:w-[320px] lg:w-[clamp(200px,25vw,500px)] h-auto object-contain"
                    priority
                  />
                </div>
              </motion.div>

              {/* Decorative Gold Line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "5rem" }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="hidden lg:block h-0.5 bg-gradient-to-r from-gold to-gold-light mb-[clamp(0.25rem,1vh,1.5rem)]"
              />

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="font-display text-[2.75rem] leading-[1.1] sm:text-5xl lg:text-[clamp(2rem,5vw,4.5rem)] font-bold text-royal-blue lg:leading-tight"
              >
                Feel Beautiful.
                <br />
                <span className="text-royal-red">Feel Confident.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-gray-600 text-base sm:text-lg lg:text-[clamp(0.875rem,1.5vw,1.125rem)] max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Transform your beauty at our luxury salon in Duluth, GA. Expert
                stylists, premium services, and personalized care for every visit.
              </motion.p>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="inline-flex items-center gap-2.5 bg-white border border-gray-200 rounded-full px-5 py-2.5 shadow-sm"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-accent-gold" fill="#C9A24D" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-royal-blue font-semibold text-base">4.9</span>
                <span className="text-gray-500 text-sm">on Google</span>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 lg:pt-[clamp(0.25rem,1vh,1rem)]"
              >
                <Link
                  href="#contact"
                  className="w-full sm:w-auto btn-primary text-lg uppercase tracking-wider"
                >
                  Book Appointment
                </Link>
                <CallNowButton
                  variant="secondary"
                  showIcon={false}
                  className="w-full sm:w-auto btn-secondary text-lg"
                />
              </motion.div>
            </motion.div>

            {/* Right Side - Hero Image Slideshow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative hidden lg:flex items-center justify-center"
            >
              {/* Decorative Frame - Subtle Ambience */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{ rotate: [3, 6, 3] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  className="w-[90%] h-[90%] border-2 border-royal-blue/10 rounded-3xl"
                />
                <motion.div
                  animate={{ rotate: [-2, -5, -2] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-[85%] h-[85%] border border-royal-blue/5 rounded-3xl"
                />
              </div>

              {/* Main Image Container - Dynamic portrait ratio & Floating Animation */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                onClick={handleNext}
                className="relative cursor-pointer group w-[clamp(220px,25vw,340px)] h-[clamp(400px,70vh,600px)] rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gray-100"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }} // Soft smooth slow transition
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={heroImages[currentIndex]}
                      alt="Swapna Beauty Parlour - Luxury Styles"
                      fill
                      className="object-cover object-top"
                      priority
                      sizes="(max-width: 1024px) 0vw, 40vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/40 via-transparent to-transparent pointer-events-none" />

                {/* Hover hint logic */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  {/* Could put a 'Next' arrow here if desired, keeping it clean for now */}
                </div>

                {/* Progress Indicators */}
                <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
                  {heroImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex
                          ? "w-6 bg-white"
                          : "w-2 bg-white/40 hover:bg-white/70"
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Decorative Corner Elements */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-16 h-16 border-t-2 border-r-2 border-soft-gold/30 rounded-tr-2xl pointer-events-none"
              />
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-4 -left-4 w-16 h-16 border-b-2 border-l-2 border-soft-gold/30 rounded-bl-2xl pointer-events-none"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Gold Decorative Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-soft-gold/50 to-transparent" />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-gray-400 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-gray-400"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
