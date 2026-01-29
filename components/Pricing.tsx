"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface ServiceCategory {
  id: string;
  title: string;
  icon: string;
  services: string[];
}

const serviceCategories: ServiceCategory[] = [
  {
    id: "face-threading",
    title: "Face Threading",
    icon: "🧵",
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
    icon: "✨",
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
    icon: "👁️",
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
    icon: "💆",
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
    icon: "✨",
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
    icon: "🌟",
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
    icon: "✂️",
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
}: {
  category: ServiceCategory;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-dark/60 to-purple-black/80 backdrop-blur-sm transition-all hover:border-white/20 hover:shadow-lg">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl">{category.icon}</span>
          <h3 className="font-serif text-xl font-semibold text-white sm:text-2xl">
            {category.title}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-6 w-6 text-white/60" />
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
            <div className="border-t border-white/10 bg-purple-black/40 p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {category.services.map((service, index) => (
                  <motion.div
                    key={service}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-soft-gold" />
                    <span>{service}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
    <section className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-3 text-center"
      >
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.16em] text-white/80 backdrop-blur-sm">
          Our Services
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Premium Beauty Services
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-white/70 sm:text-base">
          Explore our complete range of services. Click on any category to view
          all available options. Pricing varies based on service and
          requirements.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        {serviceCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <ServiceAccordionItem
              category={category}
              isOpen={openCategories.has(category.id)}
              onToggle={() => toggleCategory(category.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-dark/40 to-purple-black/60 p-6 text-center backdrop-blur-sm"
      >
        <p className="text-sm text-white/70">
          For detailed pricing and to book an appointment, please{" "}
          <a
            href="https://wa.me/17705591521"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-soft-gold transition-colors hover:text-soft-gold/80"
          >
            message us on WhatsApp
          </a>{" "}
          or{" "}
          <a
            href="tel:7705591521"
            className="font-semibold text-soft-gold transition-colors hover:text-soft-gold/80"
          >
            call us
          </a>
          . Prices may vary based on hair length, skin needs, and service
          requirements.
        </p>
      </motion.div>
    </section>
  );
}
