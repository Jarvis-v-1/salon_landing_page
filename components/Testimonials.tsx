"use client";

import { useEffect } from "react";

export function Testimonials() {
    useEffect(() => {
        // Load JotForm script dynamically
        const script = document.createElement("script");
        script.src = "https://www.jotform.com/website-widgets/embed/019c1fc38a5d7547a02dfc977ad21a9d8a22";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <section className="py-20 bg-warm-white" id="testimonials">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <p className="inline-block px-4 py-1.5 rounded-full bg-royal-blue/5 text-royal-blue text-xs font-semibold uppercase tracking-wider mb-4">
                        Testimonials
                    </p>
                    <h2 className="font-display text-4xl sm:text-5xl font-bold text-royal-blue mb-6">
                        Loved by our Community
                    </h2>
                </div>

                <div className="w-full min-h-[400px]">
                    <div id="JFWebsiteWidget-019c1fc38a5d7547a02dfc977ad21a9d8a22"></div>
                </div>
            </div>
        </section>
    );
}
