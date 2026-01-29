import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: "Swapna Beauty Parlour | Luxury Hair & Beauty Studio",
  description:
    "Feel beautiful, feel confident. Premium hair, beauty, threading, waxing and bridal services at Swapna Beauty Parlour in Duluth, GA.",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-purple-black font-sans text-white antialiased">
        <Navbar />
        <main className="w-full">
          {children}
        </main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}

