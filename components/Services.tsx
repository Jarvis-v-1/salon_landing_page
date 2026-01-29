"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type ServiceCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

const services: ServiceCardProps[] = [
  {
    icon: "✂️",
    title: "Haircut & Styling",
    description:
      "Precision cuts, blowouts and styling tailored to your face shape, lifestyle and occasion.",
  },
  {
    icon: "🎨",
    title: "Hair Color & Highlights",
    description:
      "Rich global color, balayage and soft highlights that enhance your natural complexion.",
  },
  {
    icon: "💍",
    title: "Bridal Makeup",
    description:
      "Soft-glam bridal looks, sangeet & reception styling with a focus on timeless, camera-ready beauty.",
  },
  {
    icon: "🧵",
    title: "Waxing & Threading",
    description:
      "Precise brows, gentle facial threading and smooth waxing with hygienic techniques.",
  },
  {
    icon: "✨",
    title: "Facials & Skincare",
    description:
      "Glow-boosting facials for pigmentation, acne, brightening, anti-aging and bridal radiance.",
  },
  {
    icon: "💅",
    title: "Manicure & Pedicure",
    description:
      "Relaxing manicure & spa pedicure rituals for soft hands, smooth heels and polished nails.",
  },
];

function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-dark/60 to-purple-black/80 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:shadow-xl"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-soft-gold/20 text-xl">
        <span aria-hidden="true">{icon}</span>
      </div>
      <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70">
        {description}
      </p>
    </motion.div>
  );
}

export function Services() {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.16em] text-white/80 backdrop-blur-sm">
          Services
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Everything your beauty routine needs,
              <br className="hidden sm:block" /> in one calm, luxury space.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
              From quick brow touch–ups and express waxing to full makeovers and
              bridal transformations, we design each service around your
              comfort, time and skin–hair needs.
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </section>
  );
}
