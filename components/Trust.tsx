"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Trust() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl bg-white p-8 sm:p-10 shadow-sm border border-gray-100"
    >
      {/* Decorative Corner Elements */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-royal-blue/10 rounded-tl-2xl" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-royal-blue/10 rounded-br-2xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-royal-red font-semibold">
            Loved by our community
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-accent-gold" fill="#C9A24D" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="font-display text-3xl font-bold text-royal-blue">4.9</p>
            </div>
            <div className="h-8 w-px bg-gray-200 hidden sm:block" />
            <p className="text-sm text-gray-600">
              Rated on Google – with hundreds of happy, returning clients.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="https://share.google/1o6FJXPS6La0pCTgX"
            target="_blank"
            className="px-6 py-3 rounded-full bg-royal-blue text-white text-sm font-semibold shadow-md hover:bg-royal-blue-hover hover:scale-105 transition-all duration-300"
          >
            View Google Reviews
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
