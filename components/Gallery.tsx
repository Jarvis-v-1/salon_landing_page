"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Placeholder images since user will replace them later
const images = [
    "/gallery/1.jpeg",
    "/gallery/2.jpg",
    "/gallery/3.jpg",
    "/gallery/4.webp",
    "/gallery/5.webp",
    "/gallery/6.jpeg"
];

export function Gallery() {
    return (
        <section className="py-20 bg-white" id="gallery">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <p className="inline-block px-4 py-1.5 rounded-full bg-royal-blue/5 text-royal-blue text-xs font-semibold uppercase tracking-wider mb-4">
                        Our Work
                    </p>
                    <h2 className="font-display text-4xl sm:text-5xl font-bold text-royal-blue mb-6">
                        Gallery
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-600 text-lg">
                        A glimpse into our world of beauty and style.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((src, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group"
                        >
                            {/* Using gray placeholder if image fails or for variety */}
                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                                <span className="text-sm">Image {index + 1}</span>
                            </div>

                            {/* The Image (if available in public folder) */}
                            <Image
                                src={src}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
