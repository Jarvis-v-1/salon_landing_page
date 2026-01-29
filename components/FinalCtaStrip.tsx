"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Sparkles } from "lucide-react";

export function FinalCtaStrip() {
  const phoneNumber = "770-559-1521";
  const whatsappUrl = "https://wa.me/17705591521";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-purple-dark via-purple-black to-purple-dark py-16 px-8 text-center shadow-2xl"
    >
      <div className="absolute inset-0 opacity-10">
        <Sparkles className="absolute left-10 top-10 h-20 w-20 text-soft-gold" />
        <Sparkles className="absolute bottom-10 right-10 h-16 w-16 text-soft-gold" />
      </div>

      <div className="relative z-10">
        <h2 className="mb-4 font-serif text-4xl font-bold text-white sm:text-5xl">
          Ready to Glow Up?
        </h2>
        <p className="mb-8 text-lg text-white/90">
          Book your appointment today and experience luxury beauty services
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-4 font-semibold text-white shadow-lg transition-all hover:bg-[#20BA5A] hover:shadow-xl"
          >
            <MessageCircle className="h-5 w-5" />
            Book on WhatsApp
          </motion.a>
          <motion.a
            href={`tel:${phoneNumber.replace(/-/g, "")}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-full border-2 border-white bg-transparent px-8 py-4 font-semibold text-white transition-all hover:bg-white/10"
          >
            <Phone className="h-5 w-5" />
            Call Now
          </motion.a>
        </div>
      </div>
    </motion.section>
  );
}
