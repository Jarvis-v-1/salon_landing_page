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
    icon: Hand,
    title: "Manicure & Pedicure",
    description:
      "Relaxing spa rituals for soft hands, smooth heels and polished nails.",
    image: "/pedicure.png",
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
      className="group relative rounded-2xl border-[3px] border-gold/70 hover:border-gold shadow-soft hover:shadow-elegant transition-all duration-500 overflow-hidden bg-maroon"
    >
      {/* Image Container - properly rounded and aligned */}
      <div className="relative w-full aspect-[5/4] overflow-hidden rounded-t-[13px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Image Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-maroon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Maroon Content Area */}
      <div className="relative">
        {/* Gold Icon Badge - Centered at top of content */}
        <div className="flex justify-center -mt-7 relative z-10 pb-2">
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-0 bg-gold/30 rounded-full blur-md scale-125" />
            {/* Icon Circle */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-gold via-gold-light to-gold border-2 border-gold-dark shadow-lg flex items-center justify-center">
              <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-maroon-900" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="pt-1 pb-5 px-4 text-center">
          <h3 className="font-display text-base sm:text-lg font-bold text-cream mb-1.5 group-hover:text-gold transition-colors duration-300">
            {title}
          </h3>
          <p className="text-cream/70 text-xs sm:text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function Services() {
  return (
    <section className="relative py-20 bg-cream overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #6B1C23 0.5px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Decorative Mandala - Right Edge (Half visible) */}
      <div className="absolute top-1/2 -right-[200px] lg:-right-[280px] -translate-y-1/2 w-[400px] h-[400px] lg:w-[560px] lg:h-[560px] opacity-[0.07] pointer-events-none z-0">
        <Image
          src="/decorator.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Decorative Mandala - Left Edge Bottom (Quarter visible) */}
      <div className="absolute -bottom-[150px] -left-[150px] lg:-bottom-[200px] lg:-left-[200px] w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] opacity-[0.07] pointer-events-none z-0">
        <Image
          src="/decorator.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

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

        {/* Services Grid - 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
