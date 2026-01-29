"use client";

import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";

export function LocationSection() {
  const googleBusinessUrl = "https://share.google/1o6FJXPS6La0pCTgX";
  const address = "3900 Satellite Blvd, Duluth, GA 30096, Unit 104";
  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="mb-4 font-serif text-4xl font-bold text-white sm:text-5xl">
          Visit Our Salon
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-white/70">
          Located in the heart of Duluth, GA. Easy parking and convenient
          access.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Address Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-dark/60 to-purple-black/80 p-8 backdrop-blur-sm"
        >
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-full bg-soft-gold/20 p-3">
              <MapPin className="h-6 w-6 text-soft-gold" />
            </div>
            <div>
              <h3 className="mb-2 font-serif text-2xl font-semibold text-white">
                Swapna Beauty Parlour
              </h3>
              <p className="text-white/70">{address}</p>
            </div>
          </div>

          <a
            href={googleBusinessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-soft-gold px-6 py-3 font-medium text-purple-black transition-all hover:bg-soft-gold/90 hover:shadow-lg"
          >
            Get Directions
            <ExternalLink className="h-4 w-4" />
          </a>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-2xl border border-white/10 shadow-lg"
        >
          <iframe
            src={googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ minHeight: "300px", border: 0 }}
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
