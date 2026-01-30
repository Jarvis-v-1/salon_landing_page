"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, Shield, Users, Award } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Experienced Beauticians",
    description:
      "Our skilled team brings years of expertise in hair, beauty, and bridal services.",
  },
  {
    icon: Shield,
    title: "Hygienic & Premium Products",
    description:
      "We use only the finest, hygienic products to ensure your safety and satisfaction.",
  },
  {
    icon: Award,
    title: "Bridal & Event Specialists",
    description:
      "Specialized in bridal makeup and event styling to make your special day perfect.",
  },
  {
    icon: Sparkles,
    title: "Friendly Personalized Service",
    description:
      "Every client receives personalized attention in a warm, welcoming atmosphere.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-maroon/5 rounded-full blur-3xl" />
      </div>

      {/* Decorative Mandala - Top Right Corner (Quarter visible) */}
      <div className="absolute -top-[150px] -right-[150px] lg:-top-[200px] lg:-right-[200px] w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] opacity-[0.07] pointer-events-none z-0">
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
        className="relative text-center mb-16"
      >
        {/* Decorative Element */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
          <div className="w-3 h-3 rotate-45 border-2 border-gold" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
        </div>

        <p className="inline-block px-6 py-2 rounded-full bg-maroon/5 border border-maroon/20 text-maroon text-sm font-medium uppercase tracking-[0.2em] mb-4">
          Why Choose Us
        </p>
        
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-maroon mb-6">
          Why Choose Us
        </h2>
        
        <p className="max-w-2xl mx-auto text-maroon-700/70 text-lg">
          Experience luxury beauty services that make you feel confident and beautiful
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

      {/* Features Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative bg-white rounded-2xl p-8 shadow-soft border border-gold/10 hover:shadow-elegant hover:border-gold/30 transition-all duration-500 text-center"
          >
            {/* Decorative Corner */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold/20 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold/20 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Icon */}
            <div className="relative mx-auto mb-6 w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-gold/10 group-hover:bg-gold/20 transition-colors duration-500" />
              <div className="absolute inset-2 rounded-full border-2 border-gold/30 group-hover:border-gold/50 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <feature.icon className="h-8 w-8 text-gold group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>

            {/* Content */}
            <h3 className="font-display text-xl font-bold text-maroon mb-3 group-hover:text-maroon-dark transition-colors">
              {feature.title}
            </h3>
            <div className="w-8 h-0.5 bg-gold rounded-full mx-auto mb-4 group-hover:w-12 transition-all duration-500" />
            <p className="text-maroon-700/70 text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
