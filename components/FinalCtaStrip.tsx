"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { CallNowButton } from "./CallNowButton";

export function FinalCtaStrip() {
  const phoneNumber = "770-559-1521";
  const whatsappUrl = "https://wa.me/17705591521";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl bg-royal-blue py-16 px-8 text-center shadow-lg border border-white/10"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20v20h20zM30 30c0 11.046 8.954 20 20 20V30H30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        {/* Decorative Element */}
        <div className="flex items-center justify-center gap-2 mb-6 opacity-30">
          <div className="w-2 h-2 rounded-full bg-white" />
          <div className="h-px w-16 bg-white" />
          <div className="w-3 h-3 rounded-full border-2 border-white" />
          <div className="h-px w-16 bg-white" />
          <div className="w-2 h-2 rounded-full bg-white" />
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
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-royal-blue font-bold shadow-md hover:bg-gray-100 transition-all duration-300"
          >
            <MessageCircle className="h-5 w-5" />
            Book on WhatsApp
          </motion.a>
          <CallNowButton
            variant="secondary"
            showIcon={true}
            className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white hover:bg-white/10"
          />
        </div>
      </div>
    </motion.section>
  );
}
