"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Dark Purple/Black Gradient Background */}
      <div className="absolute inset-0 z-0">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-black via-purple-dark to-purple-black" />
        
        {/* Subtle texture overlay */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }} 
        />
        
        {/* PLACEHOLDER: Replace with actual salon hero image on the right side */}
        {/* Image should be: High-quality photo of beautiful woman with styled hair/makeup */}
        {/* Recommended: Professional portrait, elegant, confident expression */}
        {/* Dimensions: 1920x1080px or larger, optimized for web */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-30">
          <div className="relative h-full w-full bg-gradient-to-l from-purple-light/20 to-transparent">
            <div className="flex h-full items-center justify-center text-white/20">
              <p className="text-center text-xs">
                [HERO IMAGE PLACEHOLDER]
                <br />
                <span className="text-[10px]">
                  Add: Beautiful woman portrait with styled hair
                  <br />
                  Position: Right side | Size: 1920x1080px
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Decorative gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-black/80 via-transparent to-purple-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-black via-transparent to-transparent" />
      </div>

      {/* Content - Left Side */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 text-left"
          >
            {/* Salon Name Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-4"
            >
              <p className="font-display text-2xl font-semibold text-soft-gold sm:text-3xl lg:text-4xl">
                Swapna Beauty Parlour
              </p>
              <p className="mt-1 text-sm text-white/60 sm:text-base">
                Luxury Hair & Beauty Studio
              </p>
            </motion.div>

            {/* Decorative Lines */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-12 bg-white/40" />
              <div className="h-px w-8 bg-white/30" />
            </motion.div>

            {/* Main Headline */}
            <h1 className="font-display text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              Feel Beautiful.
              <br />
              <span className="text-soft-gold">Feel Confident.</span>
            </h1>

            {/* Subheadline */}
            <p className="max-w-lg text-lg text-white/80 sm:text-xl">
              Transform your beauty at our luxury salon in Duluth, GA. Expert
              stylists, premium services, and personalized care for every visit.
            </p>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm"
            >
              <span className="text-xl">⭐</span>
              <span className="font-semibold text-white">4.9 Rated on Google</span>
              <span className="text-white/50">•</span>
              <span className="text-white/70">Hundreds of Happy Clients</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <Link
                href="https://wa.me/17705591521"
                target="_blank"
                className="group relative overflow-hidden rounded-full bg-[#25D366] px-8 py-4 font-semibold text-white shadow-xl shadow-[#25D366]/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#25D366]/40"
              >
                <span className="relative z-10">Book on WhatsApp</span>
                <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <Link
                href="tel:7705591521"
                className="rounded-full border-2 border-white bg-transparent px-8 py-4 font-semibold text-white transition-all hover:scale-105 hover:bg-white/10"
              >
                Call Now
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side - Image Area */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:block h-full min-h-[600px]"
          >
            <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 group">
              <Image
                src="/hero-image.jpg"
                alt="Swapna Beauty Parlour - Luxury Beauty Services"
                fill
                className="object-cover object-center grayscale transition-all duration-700 group-hover:grayscale-0"
                priority
                sizes="(max-width: 1024px) 0vw, 50vw"
              />
              {/* Subtle overlay for better text readability if needed */}
              <div className="absolute inset-0 bg-gradient-to-l from-purple-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-8 w-8 rounded-full border-2 border-white/50"
        >
          <div className="absolute left-1/2 top-2 h-2 w-2 -translate-x-1/2 rounded-full bg-white/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}

