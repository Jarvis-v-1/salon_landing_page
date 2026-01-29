"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Clock, MapPin } from "lucide-react";
import { BookingForm } from "./BookingForm";

export function Contact() {
  const phoneNumber = "770-559-1521";
  const whatsappUrl = "https://wa.me/17705591521";
  const googleBusinessUrl = "https://share.google/1o6FJXPS6La0pCTgX";

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      value: phoneNumber,
      link: `tel:${phoneNumber.replace(/-/g, "")}`,
      color: "text-soft-gold",
      bgColor: "bg-soft-gold/20",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "Book Now",
      link: whatsappUrl,
      color: "text-[#25D366]",
      bgColor: "bg-[#25D366]/20",
      external: true,
    },
    {
      icon: Clock,
      title: "Hours",
      value: "Mon-Sat: 11am-7pm",
      subtitle: "Sun: 12pm-6pm • Closed Tuesdays",
      color: "text-soft-gold",
      bgColor: "bg-soft-gold/20",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Duluth, GA",
      link: googleBusinessUrl,
      color: "text-white",
      bgColor: "bg-white/10",
      external: true,
    },
  ];

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="mb-4 font-serif text-4xl font-bold text-white sm:text-5xl">
          Contact Us
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-white/70">
          Ready to book your appointment? Get in touch with us today!
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {contactInfo.map((info, index) => {
          const Content = (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group rounded-2xl border border-white/10 bg-gradient-to-br from-purple-dark/60 to-purple-black/80 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:shadow-lg ${
                info.link ? "cursor-pointer" : ""
              }`}
            >
              <div className={`mb-4 inline-flex rounded-full ${info.bgColor} p-3`}>
                <info.icon className={`h-6 w-6 ${info.color}`} />
              </div>
              <h3 className="mb-1 font-serif text-lg font-semibold text-white">
                {info.title}
              </h3>
              <p className={`text-sm font-medium ${info.color}`}>{info.value}</p>
              {info.subtitle && (
                <p className="mt-1 text-xs text-white/60">{info.subtitle}</p>
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

      <div className="mt-10">
        <BookingForm />
      </div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 font-semibold text-white shadow-lg shadow-[#25D366]/30 transition-all hover:bg-[#20BA5A] hover:shadow-xl hover:shadow-[#25D366]/40 sm:w-auto"
        >
          <MessageCircle className="h-5 w-5" />
          Book on WhatsApp
        </a>
        <a
          href={`tel:${phoneNumber.replace(/-/g, "")}`}
          className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-white bg-transparent px-8 py-4 font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
        >
          <Phone className="h-5 w-5" />
          Call Now
        </a>
      </motion.div>
    </section>
  );
}
