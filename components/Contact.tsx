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
      iconBg: "bg-royal-blue/10",
      iconColor: "text-royal-blue",
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
      iconBg: "bg-royal-blue/10",
      iconColor: "text-royal-blue",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Duluth, GA",
      link: googleBusinessUrl,
      iconBg: "bg-royal-blue/10",
      iconColor: "text-royal-blue",
      external: true,
    },
  ];

  return (
    <section className="relative py-16 overflow-hidden bg-warm-white">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="inline-block px-4 py-1.5 rounded-full bg-royal-blue/5 text-royal-blue text-xs font-semibold uppercase tracking-wider mb-4">
          Get In Touch
        </p>

        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-royal-blue mb-6">
          Contact Us
        </h2>

        <p className="max-w-2xl mx-auto text-gray-600 text-lg">
          Ready to book your appointment? Get in touch with us today!
        </p>
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
              className={`group relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-royal-blue/20 transition-all duration-500 h-full min-h-[160px] ${info.link ? "cursor-pointer" : ""
                }`}
            >
              <div className={`mb-4 w-12 h-12 rounded-full ${info.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <info.icon className={`h-5 w-5 ${info.iconColor}`} />
              </div>
              <h3 className="font-display text-lg font-semibold text-royal-blue mb-1">
                {info.title}
              </h3>
              <p className={`text-sm font-medium ${info.iconColor}`}>{info.value}</p>
              {info.subtitle && (
                <p className="mt-1 text-xs text-gray-500">{info.subtitle}</p>
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
