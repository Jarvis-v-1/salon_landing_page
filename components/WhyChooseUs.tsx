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
    <section className="relative py-16 overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-royal-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-royal-red/5 rounded-full blur-3xl" />
      </div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative text-center mb-16"
      >
        <p className="inline-block px-4 py-1.5 rounded-full bg-royal-blue/5 text-royal-blue text-xs font-semibold uppercase tracking-wider mb-4">
          Why Choose Us
        </p>

        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-royal-blue mb-6">
          Why Choose Us
        </h2>

        <p className="max-w-2xl mx-auto text-gray-600 text-lg">
          Experience luxury beauty services that make you feel confident and beautiful
        </p>
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
            className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-royal-blue/20 transition-all duration-500 text-center"
          >
            {/* Icon */}
            <div className="relative mx-auto mb-6 w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-royal-blue/5 group-hover:bg-royal-blue/10 transition-colors duration-500" />
              <div className="absolute inset-2 rounded-full border-2 border-royal-blue/10 group-hover:border-royal-blue/30 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <feature.icon className="h-8 w-8 text-royal-blue group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>

            {/* Content */}
            <h3 className="font-display text-xl font-bold text-royal-blue mb-3 group-hover:text-royal-blue-hover transition-colors">
              {feature.title}
            </h3>
            <div className="w-8 h-0.5 bg-royal-red/30 rounded-full mx-auto mb-4 group-hover:w-12 group-hover:bg-royal-red transition-all duration-500" />
            <p className="text-gray-600 text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
