"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Menu" },
  { href: "#why-us", label: "Why Us" },
  { href: "#contact", label: "Contact" }
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-maroon/95 backdrop-blur-md shadow-elegant py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            {/* Logo - Only visible when scrolled */}
            <Link href="#home" className="flex items-center group">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: isScrolled ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className={`relative h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105 ${!isScrolled ? 'pointer-events-none' : ''}`}
              >
                <Image
                  src="/Logo.png"
                  alt="Swapna Beauty Parlour"
                  width={180}
                  height={48}
                  className="h-10 sm:h-12 w-auto object-contain"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 group ${
                    isScrolled
                      ? "text-cream/90 hover:text-gold"
                      : "text-cream hover:text-gold"
                  }`}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:left-4 group-hover:w-[calc(100%-2rem)]" />
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="https://wa.me/17705591521"
                target="_blank"
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${
                  isScrolled
                    ? "border-gold text-gold hover:bg-gold hover:text-maroon"
                    : "border-gold/80 text-gold hover:bg-gold hover:text-maroon"
                }`}
              >
                Book Now
              </Link>
              <Link
                href="tel:7705591521"
                className="px-5 py-2.5 rounded-full bg-gold text-maroon-900 text-sm font-semibold shadow-gold transition-all duration-300 hover:bg-gold-light hover:scale-105"
              >
                Call Now
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? "text-cream" : "text-cream"
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-0 z-40 pt-20 md:hidden"
          >
            <div className="bg-maroon/98 backdrop-blur-lg border-b border-gold/20 shadow-elegant-lg">
              <div className="px-4 py-6 space-y-4">
                {NAV_LINKS.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block px-4 py-3 text-cream font-medium text-lg border-b border-gold/10 hover:text-gold hover:pl-6 transition-all duration-300"
                  >
                    {link.label}
                  </motion.a>
                ))}
                <div className="flex flex-col gap-3 pt-4">
                  <Link
                    href="https://wa.me/17705591521"
                    target="_blank"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 text-center rounded-full border-2 border-gold text-gold font-semibold hover:bg-gold hover:text-maroon transition-all duration-300"
                  >
                    Book on WhatsApp
                  </Link>
                  <Link
                    href="tel:7705591521"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 text-center rounded-full bg-gold text-maroon-900 font-semibold shadow-gold hover:bg-gold-light transition-all duration-300"
                  >
                    Call Now
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

