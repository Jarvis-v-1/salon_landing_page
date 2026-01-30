"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import Image from "next/image";

export function FinalCtaStrip() {
  const phoneNumber = "770-559-1521";
  const whatsappUrl = "https://wa.me/17705591521";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl bg-maroon py-16 px-8 text-center shadow-elegant border border-gold/20"
    >
      {/* Decorative Mandala - Left Side (Half visible) */}
      <div className="absolute top-1/2 -left-[100px] lg:-left-[140px] -translate-y-1/2 w-[200px] h-[200px] lg:w-[280px] lg:h-[280px] opacity-[0.12] pointer-events-none z-0">
        <Image
          src="/decorator.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Decorative Mandala - Right Side (Half visible) */}
      <div className="absolute top-1/2 -right-[100px] lg:-right-[140px] -translate-y-1/2 w-[200px] h-[200px] lg:w-[280px] lg:h-[280px] opacity-[0.12] pointer-events-none z-0">
        <Image
          src="/decorator.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Decorative Corner Elements */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-gold/30 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-gold/30 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-gold/30 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-gold/30 rounded-br-2xl" />

      {/* Decorative Gold Lines */}
      <div className="absolute top-6 left-24 right-24 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-6 left-24 right-24 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20v20h20zM30 30c0 11.046 8.954 20 20 20V30H30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        {/* Decorative Element */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-gold" />
          <div className="h-px w-16 bg-gold" />
          <div className="w-3 h-3 rounded-full border-2 border-gold" />
          <div className="h-px w-16 bg-gold" />
          <div className="w-2 h-2 rounded-full bg-gold" />
        </div>

        <h2 className="mb-4 font-display text-4xl sm:text-5xl font-bold text-cream">
          Ready to Glow Up?
        </h2>
        <p className="mb-8 text-lg text-cream/80 max-w-xl mx-auto">
          Book your appointment today and experience luxury beauty services that make you shine
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gold text-maroon-900 font-bold shadow-gold hover:bg-gold-light transition-all duration-300"
          >
            <MessageCircle className="h-5 w-5" />
            Book on WhatsApp
          </motion.a>
          <motion.a
            href={`tel:${phoneNumber.replace(/-/g, "")}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full border-2 border-cream text-cream font-semibold hover:bg-cream/10 transition-all duration-300"
          >
            <Phone className="h-5 w-5" />
            Call Now
          </motion.a>
        </div>
      </div>
    </motion.section>
  );
}
