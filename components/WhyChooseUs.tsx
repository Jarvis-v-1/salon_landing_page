"use client";

import { motion } from "framer-motion";
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
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="mb-4 font-serif text-4xl font-bold text-white sm:text-5xl">
          Why Choose Us
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-white/70">
          Experience luxury beauty services that make you feel confident and
          beautiful
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group rounded-2xl border border-white/10 bg-gradient-to-br from-purple-dark/60 to-purple-black/80 p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:shadow-xl"
          >
            <div className="mb-4 inline-flex rounded-full bg-soft-gold/20 p-3">
              <feature.icon className="h-6 w-6 text-soft-gold" />
            </div>
            <h3 className="mb-2 font-serif text-xl font-semibold text-white">
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed text-white/70">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
