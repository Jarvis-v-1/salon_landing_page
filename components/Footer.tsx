"use client";

import { Phone, MessageCircle, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const phoneNumber = "770-559-1521";
  const whatsappUrl = "https://wa.me/17705591521";
  const googleBusinessUrl = "https://share.google/1o6FJXPS6La0pCTgX";

  return (
    <footer className="relative bg-maroon border-t border-gold/20 overflow-hidden">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Decorative Mandala - Top Right (Quarter visible) */}
      <div className="absolute -top-[150px] -right-[150px] lg:-top-[200px] lg:-right-[200px] w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] opacity-[0.08] pointer-events-none z-0">
        <Image
          src="/decorator.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Decorative Mandala - Bottom Left (Half visible) */}
      <div className="absolute -bottom-[180px] -left-[180px] lg:-bottom-[250px] lg:-left-[250px] w-[360px] h-[360px] lg:w-[500px] lg:h-[500px] opacity-[0.08] pointer-events-none z-0">
        <Image
          src="/decorator.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="#home" className="inline-block mb-6">
              <Image
                src="/Logo.png"
                alt="Swapna Beauty Parlour"
                width={200}
                height={54}
                className="h-14 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-cream/70 text-sm leading-relaxed">
              Experience luxury beauty services in a warm, welcoming atmosphere. Your beauty, our passion.
            </p>
            
            {/* Social Placeholder - add your social links */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-maroon transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-maroon transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold text-gold mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-gold" />
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-3">
              {[
                { href: "#home", label: "Home" },
                { href: "#services", label: "Services" },
                { href: "#pricing", label: "Pricing" },
                { href: "#why-us", label: "Why Choose Us" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-cream/70 hover:text-gold transition-colors duration-300 text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-gold group-hover:w-4 transition-all duration-300" />
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg font-semibold text-gold mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-gold" />
              Get In Touch
            </h3>
            <div className="space-y-4">
              <a
                href={`tel:${phoneNumber.replace(/-/g, "")}`}
                className="flex items-center gap-3 text-cream/70 hover:text-gold transition-colors duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-gold" />
                </div>
                <span className="text-sm">{phoneNumber}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-cream/70 hover:text-[#25D366] transition-colors duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                </div>
                <span className="text-sm">WhatsApp Booking</span>
              </a>
              <a
                href={googleBusinessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-cream/70 hover:text-gold transition-colors duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-gold" />
                </div>
                <span className="text-sm flex items-center gap-1">
                  Get Directions
                  <ExternalLink className="h-3 w-3" />
                </span>
              </a>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="font-display text-lg font-semibold text-gold mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-gold" />
              Business Hours
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-cream/70">
                <span>Monday</span>
                <span>11am - 7pm</span>
              </div>
              <div className="flex justify-between text-cream/70">
                <span>Tuesday</span>
                <span className="text-gold">Closed</span>
              </div>
              <div className="flex justify-between text-cream/70">
                <span>Wed - Sat</span>
                <span>11am - 7pm</span>
              </div>
              <div className="flex justify-between text-cream/70">
                <span>Sunday</span>
                <span>12pm - 6pm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-cream/50">
              © {new Date().getFullYear()} Swapna Beauty Parlour. All rights reserved.
            </p>
            <p className="text-xs text-cream/40">
              Luxury Beauty Services in Duluth, GA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
