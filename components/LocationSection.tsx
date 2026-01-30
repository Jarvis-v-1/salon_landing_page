"use client";

import { motion } from "framer-motion";
import { MapPin, ExternalLink, Clock, Phone } from "lucide-react";
import Image from "next/image";

export function LocationSection() {
  const googleBusinessUrl = "https://share.google/1o6FJXPS6La0pCTgX";
  const address = "3900 Satellite Blvd, Duluth, GA 30096, Unit 104";
  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Decorative Mandala - Top Left (Quarter visible) */}
      <div className="absolute -top-[150px] -left-[150px] lg:-top-[200px] lg:-left-[200px] w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] opacity-[0.07] pointer-events-none z-0">
        <Image
          src="/decorator.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        {/* Decorative Element */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
          <div className="w-3 h-3 rotate-45 border-2 border-gold" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
        </div>

        <p className="inline-block px-6 py-2 rounded-full bg-maroon/5 border border-maroon/20 text-maroon text-sm font-medium uppercase tracking-[0.2em] mb-4">
          Find Us
        </p>
        
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-maroon mb-6">
          Visit Our Salon
        </h2>
        
        <p className="max-w-2xl mx-auto text-maroon-700/70 text-lg">
          Located in the heart of Duluth, GA. Easy parking and convenient access.
        </p>

        {/* Bottom Decorative Element */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-gold" />
          <div className="h-px w-24 bg-gold" />
          <div className="w-3 h-3 rounded-full border-2 border-gold" />
          <div className="h-px w-24 bg-gold" />
          <div className="w-2 h-2 rounded-full bg-gold" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Address Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-maroon p-8 shadow-elegant border border-gold/20"
        >
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold/30 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold/30 rounded-br-2xl" />

          {/* Content */}
          <div className="relative space-y-6">
            {/* Title */}
            <div className="flex items-center gap-4">
              <Image
                src="/Logo.png"
                alt="Swapna Beauty Parlour"
                width={180}
                height={48}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-gold/50 via-gold/20 to-transparent" />

            {/* Address */}
            <div>
              <p className="text-cream/60 text-xs uppercase tracking-widest mb-2">Address</p>
              <p className="text-cream text-lg">{address}</p>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gold mt-0.5" />
              <div>
                <p className="text-cream/60 text-xs uppercase tracking-widest mb-1">Business Hours</p>
                <p className="text-cream">Mon-Sat: 11am - 7pm</p>
                <p className="text-cream">Sun: 12pm - 6pm</p>
                <p className="text-gold text-sm mt-1">Closed on Tuesdays</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gold" />
              <a href="tel:7705591521" className="text-cream hover:text-gold transition-colors">
                770-559-1521
              </a>
            </div>

            {/* CTA Button */}
            <a
              href={googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-maroon-900 font-semibold shadow-gold hover:bg-gold-light hover:scale-105 transition-all duration-300"
            >
              Get Directions
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border-4 border-gold/30 shadow-elegant"
        >
          {/* Decorative Corners */}
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-gold rounded-tl-xl z-10" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-gold rounded-tr-xl z-10" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-gold rounded-bl-xl z-10" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-gold rounded-br-xl z-10" />

          <iframe
            src={googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ minHeight: "400px", border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
