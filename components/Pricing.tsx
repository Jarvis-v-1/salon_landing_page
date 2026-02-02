"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Scissors, Sparkles, Eye, User, Flower2, Sun } from "lucide-react";
import { useState } from "react";
import { LucideIcon } from "lucide-react";

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
      className={`overflow-hidden rounded-xl border transition-all duration-300 ${isOpen
          ? "border-royal-blue/20 bg-white shadow-md"
          : "border-gray-200 bg-white hover:border-royal-blue/30 hover:shadow-sm"
        }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 text-left transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? "bg-royal-blue/10" : "bg-gray-100"
            }`}>
            <Icon className={`w-6 h-6 ${isOpen ? "text-royal-blue" : "text-gray-500"}`} />
          </div>
          <h3 className={`font-display text-xl font-semibold transition-colors duration-300 ${isOpen ? "text-royal-blue" : "text-gray-800"
            }`}>
            {category.title}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`p-2 rounded-full transition-colors duration-300 ${isOpen ? "bg-royal-blue text-white" : "bg-gray-100 text-gray-400"
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
            <div className="border-t border-gray-100 bg-gray-50/50 p-5">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {category.services.map((service, idx) => (
                  <motion.div
                    key={service}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm text-gray-700 border border-gray-200 hover:border-royal-blue/20 hover:bg-white transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-royal-red flex-shrink-0" />
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
    <section className="relative overflow-hidden py-16">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="inline-block px-4 py-1.5 rounded-full bg-royal-blue/5 text-royal-blue text-xs font-semibold uppercase tracking-wider mb-4">
          Our Menu
        </p>

        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-royal-blue mb-6">
          Premium Beauty Services
        </h2>

        <p className="max-w-2xl mx-auto text-gray-600 text-lg">
          Explore our complete range of services. Click on any category to view all available options.
        </p>
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
        className="mt-10 rounded-xl bg-royal-blue/5 p-6 text-center border border-royal-blue/10"
      >
        <p className="text-gray-700">
          For detailed pricing and to book an appointment, please{" "}
          <a
            href="https://wa.me/17705591521"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-royal-red hover:text-royal-red-hover transition-colors underline underline-offset-2"
          >
            message us on WhatsApp
          </a>{" "}
          or{" "}
          <a
            href="tel:7705591521"
            className="font-semibold text-royal-red hover:text-royal-red-hover transition-colors underline underline-offset-2"
          >
            call us
          </a>
          . Prices may vary based on hair length, skin needs, and service requirements.
        </p>
      </motion.div>
    </section>
  );
}
