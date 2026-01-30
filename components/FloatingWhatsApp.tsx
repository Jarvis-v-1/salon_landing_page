"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  const whatsappUrl = "https://wa.me/17705591521";

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      aria-label="Book on WhatsApp"
    >
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Main Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40 transition-all group-hover:shadow-xl group-hover:shadow-[#25D366]/50"
      >
        {/* Decorative Ring */}
        <div className="absolute inset-1 rounded-full border-2 border-white/20" />
        
        {/* Icon */}
        <MessageCircle className="h-8 w-8 text-white" />
        
        {/* Notification Dot */}
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
          <span className="absolute h-full w-full animate-ping rounded-full bg-gold opacity-75" />
          <span className="relative h-3 w-3 rounded-full bg-gold border-2 border-white" />
        </span>
      </motion.div>

      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-maroon text-cream text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap shadow-elegant">
          Book on WhatsApp
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-maroon" />
        </div>
      </div>
    </motion.a>
  );
}
