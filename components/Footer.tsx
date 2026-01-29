import { Phone, MessageCircle, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const phoneNumber = "770-559-1521";
  const whatsappUrl = "https://wa.me/17705591521";
  const googleBusinessUrl = "https://share.google/1o6FJXPS6La0pCTgX";

  return (
    <footer className="mt-32 border-t border-white/10 bg-gradient-to-b from-purple-black to-purple-black/90 py-12">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-serif text-xl font-semibold text-white">
              Get In Touch
            </h3>
            <div className="space-y-3">
              <a
                href={`tel:${phoneNumber.replace(/-/g, "")}`}
                className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-soft-gold"
              >
                <Phone className="h-5 w-5" />
                <span>{phoneNumber}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-[#25D366]"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp Booking</span>
              </a>
              <a
                href={googleBusinessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-soft-gold"
              >
                <MapPin className="h-5 w-5" />
                <span className="flex items-center gap-1">
                  Get Directions
                  <ExternalLink className="h-3 w-3" />
                </span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-serif text-xl font-semibold text-white">
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-2">
              <a
                href="#home"
                className="text-sm text-white/70 transition-colors hover:text-soft-gold"
              >
                Home
              </a>
              <a
                href="#services"
                className="text-sm text-white/70 transition-colors hover:text-soft-gold"
              >
                Services
              </a>
              <a
                href="#pricing"
                className="text-sm text-white/70 transition-colors hover:text-soft-gold"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-sm text-white/70 transition-colors hover:text-soft-gold"
              >
                Contact
              </a>
            </nav>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="mb-4 font-serif text-xl font-semibold text-white">
              Business Hours
            </h3>
            <div className="space-y-1 text-sm text-white/70">
              <p>Monday - Saturday: 11am - 7pm</p>
              <p>Sunday: 12pm - 6pm</p>
              <p className="pt-2 text-soft-gold">Closed on Tuesdays</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Swapna Beauty Parlour. All rights
            reserved.
          </p>
          <p className="mt-2 text-xs text-white/50">
            Luxury Beauty Services in Duluth, GA
          </p>
        </div>
      </div>
    </footer>
  );
}
