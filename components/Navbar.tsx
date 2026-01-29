import Link from "next/link";

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#why-us", label: "Why Us" },
  { href: "#location", label: "Location" },
  { href: "#contact", label: "Contact" }
];

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full">
      <div className="mx-auto w-full max-w-7xl px-6 pt-4 sm:px-8 lg:px-12 xl:px-16">
        <nav className="flex items-center justify-between rounded-full border border-white/20 bg-purple-black/80 backdrop-blur-xl px-4 py-2 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xs font-semibold tracking-[0.2em] text-white backdrop-blur-sm">
              SH
            </div>
            <div>
              <p className="font-display text-sm font-semibold tracking-wide text-white">
                Swapna Beauty Parlour
              </p>
              <p className="text-xs text-white/70">
                Luxury Hair &amp; Beauty Studio
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-6 text-sm font-medium text-white/90 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="hidden gap-3 md:flex">
            <Link
              href="https://wa.me/17705591521"
              target="_blank"
              className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50"
            >
              Book on WhatsApp
            </Link>
            <Link
              href="tel:7705591521"
              className="rounded-full border-2 border-white bg-transparent px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-white/10"
            >
              Call Now
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

