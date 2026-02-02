"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CallNowButton } from "./CallNowButton";

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
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm py-2"
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
                  src="/logo.png"
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
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 group ${isScrolled
                      ? "text-royal-blue hover:text-royal-red"
                      : "text-royal-blue hover:text-royal-red"
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
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${isScrolled
                    ? "border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white"
                    : "border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white"
                  }`}
              >
                Book Now
              </Link>
              <CallNowButton variant="nav" showIcon={false} />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? "text-royal-blue" : "text-royal-blue"
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
            <div className="bg-white/98 backdrop-blur-lg border-b border-royal-blue/10 shadow-lg">
              <div className="px-4 py-6 space-y-4">
                {NAV_LINKS.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block px-4 py-3 text-royal-blue font-medium text-lg border-b border-gray-100 hover:text-royal-red hover:pl-6 transition-all duration-300"
                  >
                    {link.label}
                  </motion.a>
                ))}
                <div className="flex flex-col gap-3 pt-4">
                  <Link
                    href="https://wa.me/17705591521"
                    target="_blank"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 text-center rounded-full border-2 border-royal-blue text-royal-blue font-semibold hover:bg-royal-blue hover:text-white transition-all duration-300"
                  >
                    Book on WhatsApp
                  </Link>
                  <CallNowButton
                    variant="primary"
                    showIcon={false}
                    className="w-full py-3 text-center rounded-full bg-royal-red text-white font-semibold shadow-sm hover:bg-royal-red/90 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

