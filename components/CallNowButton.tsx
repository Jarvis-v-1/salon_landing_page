"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, Smartphone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface CallNowButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "nav";
  showIcon?: boolean;
  children?: React.ReactNode;
}

const PHONE_NUMBER = "7705591521";
const PHONE_DISPLAY = "770-559-1521";

export function CallNowButton({
  className = "",
  variant = "primary",
  showIcon = true,
  children,
}: CallNowButtonProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before using portal
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Check if device is mobile/touch device
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouchDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close popup on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsPopupOpen(false);
    };
    if (isPopupOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isPopupOpen]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isMobile) {
      e.preventDefault();
      setIsPopupOpen(true);
    }
    // On mobile, let the default tel: link behavior work
  };

  const getButtonClasses = () => {
    const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300";
    
    switch (variant) {
      case "primary":
        return `${baseClasses} px-8 py-4 rounded-full bg-gold text-maroon-900 shadow-gold hover:bg-gold-light hover:scale-105`;
      case "secondary":
        return `${baseClasses} px-8 py-4 rounded-full border-2 border-cream/50 text-cream hover:bg-cream/10 hover:border-cream`;
      case "outline":
        return `${baseClasses} px-8 py-4 rounded-full border-2 border-maroon text-maroon hover:bg-maroon hover:text-cream`;
      case "nav":
        return `${baseClasses} px-5 py-2.5 rounded-full bg-gold text-maroon-900 text-sm shadow-gold hover:bg-gold-light hover:scale-105`;
      default:
        return baseClasses;
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isPopupOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={() => setIsPopupOpen(false)}
          />

          {/* Modal Container - Centered using flexbox */}
          <div 
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gold/20">
                {/* Header */}
                <div className="bg-maroon px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-cream">
                      Call Us
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsPopupOpen(false)}
                    className="w-8 h-8 rounded-full bg-cream/10 flex items-center justify-center hover:bg-cream/20 transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5 text-cream" />
                  </button>
                </div>

                {/* Content - Horizontal Layout */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Left Side - Phone Number */}
                    <div className="flex-1 text-center md:text-left">
                      <p className="text-maroon-700/70 text-sm mb-2">Our Phone Number</p>
                      <a
                        href={`tel:${PHONE_NUMBER}`}
                        className="inline-flex items-center gap-3 text-3xl md:text-4xl font-bold text-maroon hover:text-gold transition-colors"
                      >
                        <Phone className="h-8 w-8" />
                        {PHONE_DISPLAY}
                      </a>
                      <p className="mt-4 text-sm text-maroon-700/60">
                        Available Mon-Sat: 11am-7pm, Sun: 12pm-6pm
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:flex flex-col items-center gap-2 self-stretch py-2">
                      <div className="flex-1 w-px bg-gold/30" />
                      <span className="text-maroon-700/50 text-sm px-2">or</span>
                      <div className="flex-1 w-px bg-gold/30" />
                    </div>
                    <div className="flex md:hidden items-center gap-4 w-full">
                      <div className="flex-1 h-px bg-gold/30" />
                      <span className="text-maroon-700/50 text-sm">or</span>
                      <div className="flex-1 h-px bg-gold/30" />
                    </div>

                    {/* Right Side - QR Code */}
                    <div className="flex-shrink-0 text-center">
                      <div className="bg-cream/50 rounded-xl p-4 border border-gold/10">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <Smartphone className="h-4 w-4 text-maroon-700/70" />
                          <p className="text-maroon-700/70 text-xs font-medium">
                            Scan to call
                          </p>
                        </div>
                        
                        {/* QR Code */}
                        <div className="inline-block p-3 bg-white rounded-lg shadow-soft border border-gold/20">
                          <QRCodeSVG
                            value={`tel:${PHONE_NUMBER}`}
                            size={120}
                            level="H"
                            includeMargin={false}
                            bgColor="#FFFFFF"
                            fgColor="#5C1A1A"
                          />
                        </div>
                        
                        <p className="mt-2 text-xs text-maroon-700/50">
                          Point camera at QR
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <a
        href={`tel:${PHONE_NUMBER}`}
        onClick={handleClick}
        className={`${getButtonClasses()} ${className}`}
      >
        {showIcon && <Phone className="h-5 w-5" />}
        {children || "Call Now"}
      </a>

      {/* Render modal via portal to document.body for proper centering */}
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
