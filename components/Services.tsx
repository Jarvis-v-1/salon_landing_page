"use client";

import { motion } from "framer-motion";
import { Scissors, Palette, Heart, Sparkles, Flower2, Hand } from "lucide-react";
import { LucideIcon } from "lucide-react";
import Image from "next/image";

type ServiceCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  index: number;
};

const services: Omit<ServiceCardProps, "index">[] = [
  {
    icon: Scissors,
    title: "Haircut & Styling",
    description:
      "Precision cuts, blowouts and styling tailored to your face shape and lifestyle.",
    image: "/hair-style.png",
  },
  {
    icon: Palette,
    title: "Hair Color",
    description:
      "Rich global color, balayage and soft highlights that enhance your natural look.",
    image: "/hair-color.png",
  },
  {
    icon: Heart,
    title: "Bridal Makeup",
    description:
      "Soft-glam bridal looks with timeless, camera-ready beauty for your special day.",
    image: "/bridal.png",
  },
  {
    icon: Sparkles,
    title: "Waxing & Threading",
    description:
      "Precise brows, gentle facial threading and smooth waxing services.",
    image: "/threading.png",
  },
  {
    icon: Flower2,
    title: "Facials",
    description:
      "Glow-boosting facials for brightening, anti-aging and bridal radiance.",
    image: "/facial.png",
  },
  {
    icon: Palette,
    title: "Highlights",
    description:
      "Dimensional highlights that add depth, brightness and a natural sun-kissed finish.",
    image: "/highlights.jpg",
  },
  {
    icon: Hand,
    title: "Keratin Treatment",
    description:
      "Frizz control and smoothing treatment for shiny, manageable and long-lasting results.",
    image: "/keratin.jpg",
  },

];

function ServiceCard({ icon: Icon, title, description, image, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[5/4] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Content Area */}
      <div className="relative p-6 pt-12">
        {/* Floating Icon Badge */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100 group-hover:border-gold/30 transition-colors">
            <Icon className="w-8 h-8 text-royal-red" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center">
          <h3 className="font-display text-xl font-bold text-royal-blue mb-2.5">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function Services() {
  const topRow = services.slice(0, 4);
  const bottomRow = services.slice(4);

  return (
    <section className="relative py-20 bg-warm-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Decorative Element */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <div className="w-3 h-3 rotate-45 border-2 border-gold" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>

          <p className="inline-block px-6 py-2 rounded-full bg-maroon/5 border border-maroon/20 text-maroon text-sm font-medium uppercase tracking-[0.2em] mb-4">
            What We Offer
          </p>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-maroon mb-6">
            Our Services
          </h2>

          <p className="max-w-2xl mx-auto text-maroon-700/70 text-lg">
            Everything your beauty routine needs, in one calm, luxury space. From quick touch-ups to full transformations.
          </p>

          {/* Bottom Decorative Element */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="w-2 h-2 rounded-full bg-gold" />
            <div className="h-px w-24 bg-gold/50" />
            <div className="w-3 h-3 rounded-full border-2 border-gold" />
            <div className="h-px w-24 bg-gold/50" />
            <div className="w-2 h-2 rounded-full bg-gold" />
          </div>
        </motion.div>

        {/* Services Grid: 4 on top, 3 on bottom */}
        <div className="space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {topRow.map((service, index) => (
              <ServiceCard key={service.title} {...service} index={index} />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {bottomRow.map((service, index) => (
              <ServiceCard key={service.title} {...service} index={index + topRow.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
