"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Scissors, Sparkles, Eye, User, Flower2, Sun, ScissorsLineDashed } from "lucide-react";
import { useState } from "react";
import { LucideIcon } from "lucide-react";
import Image from "next/image";

interface ServiceCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  services: string[];
}

const serviceCategories: ServiceCategory[] = [
  {
    id: "face-threading",
    title: "Face Threading",
    icon: Sparkles,
    services: [
      "Eyebrows",
      "Upperlip",
      "Lower lip",
      "Chin",
      "Under chin",
      "Neck",
      "Sides",
      "Forehead",
      "Full face (jawline)",
      "Full face & neck",
    ],
  },
  {
    id: "face-waxing",
    title: "Face Waxing",
    icon: Flower2,
    services: [
      "Eyebrows",
      "Upperlip",
      "Lower lip",
      "Chin",
      "Under chin",
      "Neck",
      "Sides",
      "Forehead",
      "Full face (jawline)",
      "Full face & neck",
    ],
  },
  {
    id: "lashes-tint",
    title: "Lashes and Tint",
    icon: Eye,
    services: [
      "Eyebrows filling",
      "Eyelashes strips",
      "Eyelashes",
      "Lash tint",
      "Eyebrows tint",
      "Heena eyebrows tint",
    ],
  },
  {
    id: "body-waxing",
    title: "Body Waxing",
    icon: User,
    services: [
      "Underarm waxing",
      "Half arm waxing",
      "Full arm waxing",
      "Half leg waxing",
      "Full leg waxing",
      "Full back waxing",
      "Stomach waxing",
      "Full body (full arms, full legs, underarms)",
      "Bikini waxing",
      "Brazilian waxing",
    ],
  },
  {
    id: "facials",
    title: "Facials",
    icon: Sun,
    services: [
      "Quick facial",
      "Basic cleanup",
      "Mix fruit",
      "Neem",
      "Turmeric",
      "Chocolate",
      "Lemon",
      "Rose",
      "Almond",
      "Papaya",
      "Skin tightening",
      "Skin lightening",
      "Antiaging",
      "Gold",
      "Diamond",
      "Pearl",
      "Professional cleanup",
      "Panchgavya",
      "Collagen",
      "Detan",
      "Glovite",
      "Vitalift",
      "Oxyblast",
      "O3+ facial (bridal facial)",
    ],
  },
  {
    id: "bleach",
    title: "Face and Body Bleach",
    icon: Sparkles,
    services: [
      "Face bleach",
      "Full face, neck, half back",
      "Full face, neck, full legs, full arms",
      "Only arms full bleach",
      "Only legs full bleach",
    ],
  },
  {
    id: "hair-care",
    title: "Hair Care and Cuts",
    icon: Scissors,
    services: [
      "Kids basic haircut",
      "Mens haircut",
      "Womens haircut",
      "Shampoo, cut, blowdry style",
      "Blowdry style only",
      "Full haircolor",
      "Root-touchup haircolor",
      "Scalp oil massage (with steam)",
      "Hair spa",
      "Deep conditioning",
      "Hair shampoo",
      "Extra shampoo",
      "Hair heena",
      "Keratin treatment (by appointments only)",
      "Hair highlights (by appointments only)",
      "Perms (by appointments only)",
    ],
  },
];

function ServiceAccordionItem({
  category,
  isOpen,
  onToggle,
  index,
}: {
  category: ServiceCategory;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const Icon = category.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`overflow-hidden rounded-xl border transition-all duration-300 ${
        isOpen
          ? "border-gold bg-white shadow-elegant"
          : "border-maroon/10 bg-white/80 hover:border-gold/50 hover:shadow-soft"
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 text-left transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
            isOpen ? "bg-gold/20" : "bg-maroon/5"
          }`}>
            <Icon className={`w-6 h-6 ${isOpen ? "text-gold" : "text-maroon"}`} />
          </div>
          <h3 className={`font-display text-xl font-semibold transition-colors duration-300 ${
            isOpen ? "text-maroon" : "text-maroon-800"
          }`}>
            {category.title}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`p-2 rounded-full transition-colors duration-300 ${
            isOpen ? "bg-gold text-maroon-900" : "bg-maroon/5 text-maroon"
          }`}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gold/20 bg-cream/50 p-5">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {category.services.map((service, idx) => (
                  <motion.div
                    key={service}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm text-maroon-800 border border-maroon/5 hover:border-gold/30 hover:bg-gold/5 transition-all duration-300"
                  >
                    <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                    <span>{service}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Pricing() {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set()
  );

  const toggleCategory = (id: string) => {
    const newOpen = new Set(openCategories);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenCategories(newOpen);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Decorative Mandala - Left Edge (Half visible, behind content) */}
      <div className="absolute top-1/4 -left-[280px] lg:-left-[350px] w-[560px] h-[560px] lg:w-[700px] lg:h-[700px] opacity-[0.05] pointer-events-none -z-10">
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
        className="text-center mb-12"
      >
        {/* Decorative Element */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
          <div className="w-3 h-3 rotate-45 border-2 border-gold" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
        </div>

        <p className="inline-block px-6 py-2 rounded-full bg-maroon/5 border border-maroon/20 text-maroon text-sm font-medium uppercase tracking-[0.2em] mb-4">
          Our Menu
        </p>
        
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-maroon mb-6">
          Premium Beauty Services
        </h2>
        
        <p className="max-w-2xl mx-auto text-maroon-700/70 text-lg">
          Explore our complete range of services. Click on any category to view all available options.
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

      {/* Accordion List */}
      <div className="space-y-3">
        {serviceCategories.map((category, index) => (
          <ServiceAccordionItem
            key={category.id}
            category={category}
            isOpen={openCategories.has(category.id)}
            onToggle={() => toggleCategory(category.id)}
            index={index}
          />
        ))}
      </div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-10 rounded-xl bg-maroon p-6 text-center border border-gold/20"
      >
        <p className="text-cream/90">
          For detailed pricing and to book an appointment, please{" "}
          <a
            href="https://wa.me/17705591521"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gold hover:text-gold-light transition-colors underline underline-offset-2"
          >
            message us on WhatsApp
          </a>{" "}
          or{" "}
          <a
            href="tel:7705591521"
            className="font-semibold text-gold hover:text-gold-light transition-colors underline underline-offset-2"
          >
            call us
          </a>
          . Prices may vary based on hair length, skin needs, and service requirements.
        </p>
      </motion.div>
    </section>
  );
}
