"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Phone, MessageCircle, Clock, MapPin } from "lucide-react";
import { BookingForm } from "./BookingForm";
import { CallNowButton } from "./CallNowButton";

export function Contact() {
  const phoneNumber = "770-559-1521";
  const whatsappUrl = "https://wa.me/17705591521";
  const googleBusinessUrl = "https://share.google/1o6FJXPS6La0pCTgX";

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: phoneNumber,
      link: `tel:${phoneNumber.replace(/-/g, "")}`,
      iconBg: "bg-gold/20",
      iconColor: "text-gold",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "Book Now",
      link: whatsappUrl,
      iconBg: "bg-[#25D366]/20",
      iconColor: "text-[#25D366]",
      external: true,
    },
    {
      icon: Clock,
      title: "Hours",
      value: "Mon-Sat: 11am-7pm",
      subtitle: "Sun: 12pm-6pm • Closed Tuesdays",
      iconBg: "bg-maroon/10",
      iconColor: "text-maroon",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Duluth, GA",
      link: googleBusinessUrl,
      iconBg: "bg-maroon/10",
      iconColor: "text-maroon",
      external: true,
    },
  ];

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Decorative Mandala - Bottom Right (Quarter visible) */}
      <div className="absolute -bottom-[150px] -right-[150px] lg:-bottom-[200px] lg:-right-[200px] w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] opacity-[0.07] pointer-events-none z-0">
        <Image
          src="/decorator.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        {/* Decorative Element */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
          <div className="w-3 h-3 rotate-45 border-2 border-gold" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
        </div>

        <p className="inline-block px-6 py-2 rounded-full bg-maroon/5 border border-maroon/20 text-maroon text-sm font-medium uppercase tracking-[0.2em] mb-4">
          Get In Touch
        </p>
        
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-maroon mb-6">
          Contact Us
        </h2>
        
        <p className="max-w-2xl mx-auto text-maroon-700/70 text-lg">
          Ready to book your appointment? Get in touch with us today!
        </p>

        {/* Bottom Decorative Element */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-gold" />
          <div className="h-px w-24 bg-gold" />
          <div className="w-3 h-3 rounded-full border-2 border-gold" />
          <div className="h-px w-24 bg-gold" />
          <div className="w-2 h-2 rounded-full bg-gold" />
        </div>
      </motion.div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {contactInfo.map((info, index) => {
          const Content = (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`group relative bg-white rounded-xl p-6 shadow-soft border border-gold/10 hover:shadow-elegant hover:border-gold/30 transition-all duration-500 h-full min-h-[160px] ${
                info.link ? "cursor-pointer" : ""
              }`}
            >
              {/* Decorative Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className={`mb-4 w-12 h-12 rounded-full ${info.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <info.icon className={`h-5 w-5 ${info.iconColor}`} />
              </div>
              <h3 className="font-display text-lg font-semibold text-maroon mb-1">
                {info.title}
              </h3>
              <p className={`text-sm font-medium ${info.iconColor}`}>{info.value}</p>
              {info.subtitle && (
                <p className="mt-1 text-xs text-maroon-700/60">{info.subtitle}</p>
              )}
            </motion.div>
          );

          if (info.link) {
            return (
              <a
                key={info.title}
                href={info.link}
                target={info.external ? "_blank" : undefined}
                rel={info.external ? "noopener noreferrer" : undefined}
              >
                {Content}
              </a>
            );
          }

          return <div key={info.title}>{Content}</div>;
        })}
      </div>

      {/* Booking Form */}
      <div className="mb-12">
        <BookingForm />
      </div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-semibold shadow-lg shadow-[#25D366]/30 hover:bg-[#20BA5A] hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="h-5 w-5" />
          Book on WhatsApp
        </a>
        <CallNowButton
          variant="outline"
          showIcon={true}
          className="w-full sm:w-auto"
        />
      </motion.div>
    </section>
  );
}
