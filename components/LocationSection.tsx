"use client";

import { motion } from "framer-motion";
import { MapPin, ExternalLink, Clock, Phone } from "lucide-react";
import Image from "next/image";

export function LocationSection() {
  const googleBusinessUrl = "https://share.google/1o6FJXPS6La0pCTgX";
  const address = "3900 Satellite Blvd, Duluth, GA 30096, Unit 104";
  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <section className="relative py-16 overflow-hidden bg-warm-white">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-royal-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-royal-blue/5 rounded-full blur-3xl" />
      </div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="inline-block px-4 py-1.5 rounded-full bg-royal-blue/5 text-royal-blue text-xs font-semibold uppercase tracking-wider mb-4">
          Find Us
        </p>

        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-royal-blue mb-6">
          Visit Our Salon
        </h2>

        <p className="max-w-2xl mx-auto text-gray-600 text-lg">
          Located in the heart of Duluth, GA. Easy parking and convenient access.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Address Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-md border border-gray-100"
        >
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-royal-blue/10 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-royal-blue/10 rounded-br-2xl" />

          {/* Content */}
          <div className="relative space-y-6">
            {/* Title */}
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Swapna Beauty Parlour"
                width={180}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Address */}
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Address</p>
              <p className="text-gray-800 text-lg">{address}</p>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-royal-blue mt-0.5" />
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Business Hours</p>
                <p className="text-gray-600">Mon-Sat: 11am - 7pm</p>
                <p className="text-gray-600">Sun: 12pm - 6pm</p>
                <p className="text-royal-red text-sm mt-1">Closed on Tuesdays</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-royal-blue" />
              <a href="tel:7705591521" className="text-gray-800 hover:text-royal-blue transition-colors font-semibold">
                770-559-1521
              </a>
            </div>

            {/* CTA Button */}
            <a
              href={googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-royal-blue text-white font-semibold shadow-md hover:bg-royal-blue-hover hover:scale-105 transition-all duration-300"
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
          className="relative overflow-hidden rounded-2xl border-4 border-white shadow-lg"
        >

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
