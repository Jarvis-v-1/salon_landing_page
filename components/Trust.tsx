"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Trust() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-dark/80 to-purple-black/80 p-8 backdrop-blur-sm shadow-xl sm:p-10"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-white/60">
            Loved by our community
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-xl">⭐</span>
              <p className="font-display text-2xl text-white">4.9</p>
            </div>
            <p className="text-sm text-white/80">
              Rated on Google – with hundreds of happy, returning clients.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="https://share.google/1o6FJXPS6La0pCTgX"
            target="_blank"
            className="rounded-full border border-white/30 bg-white/10 px-6 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50"
          >
            View Google Reviews
          </Link>
          <p className="text-xs text-white/60">
            Trusted for brows, waxing, facials, hair &amp; bridal beauty.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
