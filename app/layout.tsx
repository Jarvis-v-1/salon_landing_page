import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Swapna Beauty Parlour | Luxury Hair & Beauty Studio in Duluth, GA",
    template: "%s | Swapna Beauty Parlour",
  },
  description:
    "Swapna Beauty Parlour — premium hair styling, bridal makeup, threading, waxing, facials & skincare in Duluth, GA. Book your appointment today! Call 770-559-1521.",
  metadataBase: new URL("https://example.com"),
  applicationName: "Swapna Beauty Parlour",
  authors: [{ name: "Swapna Beauty Parlour" }],
  generator: "Next.js",
  keywords: [
    "Swapna Beauty Parlour",
    "beauty salon Duluth GA",
    "hair salon Duluth",
    "bridal makeup Georgia",
    "threading Duluth GA",
    "waxing Duluth GA",
    "facial skincare Duluth",
    "haircut styling Duluth GA",
    "hair color highlights",
    "Indian beauty parlour Duluth",
    "beauty parlour near me",
    "salon Duluth GA",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Swapna Beauty Parlour",
  publisher: "Swapna Beauty Parlour",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Swapna Beauty Parlour",
    title: "Swapna Beauty Parlour | Luxury Hair & Beauty Studio in Duluth, GA",
    description:
      "Premium hair styling, bridal makeup, threading, waxing, facials & skincare. Located at 3900 Satellite Blvd, Duluth, GA 30096. Call 770-559-1521.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Swapna Beauty Parlour Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Swapna Beauty Parlour | Luxury Hair & Beauty Studio in Duluth, GA",
    description:
      "Premium hair styling, bridal makeup, threading, waxing, facials & skincare in Duluth, GA. Book now!",
    images: ["/logo.png"],
  },
  category: "Beauty & Personal Care",
  other: {
    "geo.region": "US-GA",
    "geo.placename": "Duluth",
    "business:contact_data:street_address": "3900 Satellite Blvd, Unit 104",
    "business:contact_data:locality": "Duluth",
    "business:contact_data:region": "GA",
    "business:contact_data:postal_code": "30096",
    "business:contact_data:country_name": "United States",
    "business:contact_data:phone_number": "+1-770-559-1521",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-cool-white font-sans text-gray-800 antialiased">
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

