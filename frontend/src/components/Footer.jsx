import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { motion } from "motion/react";
import { TeaLeafLogo } from "./Navbar";

const footerLinks = {
  Explore: [
    { label: "Shop All Teas", to: "/shop" },
    { label: "Our Story", to: "/about" },
    { label: "Tea Gallery", to: "/gallery" },
    { label: "Tea Journal", to: "/blog" },
    { label: "Contact Us", to: "/contact" },
  ],
  Collections: [
    { label: "Green Teas", to: "/shop" },
    { label: "Black Teas", to: "/shop" },
    { label: "Herbal Blends", to: "/shop" },
    { label: "Ceremonial Matcha", to: "/shop" },
    { label: "White Tea", to: "/shop" },
  ],
};

const socialLinks = [
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Youtube, href: "#", label: "YouTube" },
];

const certBadges = [
  { emoji: "🌿", label: "EU & USDA Organic" },
  { emoji: "🤝", label: "Direct Trade" },
  { emoji: "♻️", label: "Carbon Neutral" },
];

const origins = [
  { flag: "🇮🇳", name: "Darjeeling" },
  { flag: "🇨🇳", name: "Fujian" },
  { flag: "🇯🇵", name: "Uji, Japan" },
  { flag: "🇹🇼", name: "Alishan" },
  { flag: "🇮🇳", name: "Assam" },
  { flag: "🇱🇰", name: "Ceylon" },
];

/* Dark premium footer — warm charcoal-green, cream text, gold accents */
const FOOTER_BG = "#1c1f14";
const FOOTER_MAIN_BG = "#22261a";
const FOOTER_BOTTOM_BG = "#161910";
const FOOTER_TEXT = "#f5eedc";
const FOOTER_MUTED = "#c8bc9e";
const FOOTER_GOLD = "#d4a847";
const FOOTER_BORDER = "rgba(212,168,71,0.20)";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-ocid="footer" style={{ background: FOOTER_BG }}>
      {/* ── Newsletter banner ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1701680460149-d3884667b40b?q=80&w=2124&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1701680460149-d3884667b40b?q=80&w=2124&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
              e.target.onerror = null;
            }}
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -top-28 -right-28 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "rgba(201,168,76,0.08)" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left */}
            <div className="text-center lg:text-left max-w-sm">
              <div
                className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full border"
                style={{
                  background: "rgba(201,168,76,0.12)",
                  borderColor: "rgba(201,168,76,0.3)",
                }}
              >
                <span className="text-xs" style={{ color: FOOTER_GOLD }}>
                  🍃
                </span>
                <span
                  className="text-[10px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: FOOTER_GOLD }}
                >
                  Inner Circle
                </span>
              </div>
              <h3
                className="font-display text-2xl md:text-3xl font-semibold leading-tight mb-2"
                style={{
                  color: "#ffffff",
                  textShadow: "0 2px 10px rgba(0,0,0,0.6)",
                }}
              >
                Steep Into <span style={{ color: FOOTER_GOLD }}>Our World</span>
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "#e8dfc8",
                  textShadow: "0 1px 5px rgba(0,0,0,0.5)",
                }}
              >
                Exclusive blends, seasonal harvests, and rituals — delivered
                gently to your inbox.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 mt-5">
                {certBadges.map((b) => (
                  <span
                    key={b.label}
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      color: "#f0ead8",
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    <span>{b.emoji}</span>
                    {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <form
              className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
              onSubmit={(e) => e.preventDefault()}
              data-ocid="footer-newsletter-form"
            >
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
                className="flex-1 px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition-smooth input-on-dark"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  color: "#ffffff",
                  caretColor: "#ffffff",
                }}
                data-ocid="footer-newsletter-email"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl font-semibold text-sm active:scale-95 transition-smooth whitespace-nowrap shadow-md hover:shadow-lg"
                style={{ background: FOOTER_GOLD, color: "#1a1a0a" }}
                data-ocid="footer-newsletter-submit"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Main footer body — dark premium ── */}
      <div
        style={{
          background: FOOTER_MAIN_BG,
          borderTop: `1px solid ${FOOTER_BORDER}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-5">
              <Link
                to="/"
                className="inline-flex items-center gap-3 mb-5 group"
              >
                <TeaLeafLogo size="md" onDark />
              </Link>

              <p
                className="text-sm leading-relaxed max-w-xs mb-6"
                style={{ color: FOOTER_MUTED }}
              >
                Meticulously sourced whole-leaf teas from India's finest gardens
                — Darjeeling, Assam & Nilgiris. Every steep is an invitation to
                slow down and savour.
              </p>

              <div className="space-y-2.5 mb-6">
                {[
                  {
                    Icon: MapPin,
                    text: "14 Pedder Road, Breach Candy, Mumbai 400 026",
                  },
                  { Icon: Phone, text: "+91 22 6712 4500" },
                  { Icon: Mail, text: "hello@swadistchai.com" },
                ].map(({ Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2.5 text-sm"
                    style={{ color: FOOTER_MUTED }}
                  >
                    <Icon
                      size={14}
                      style={{ color: FOOTER_GOLD, flexShrink: 0 }}
                    />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2.5">
                {socialLinks.map(({ Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    whileHover={{ y: -3, scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition-smooth"
                    style={{
                      border: `1px solid ${FOOTER_BORDER}`,
                      color: FOOTER_MUTED,
                      background: "rgba(255,255,255,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = FOOTER_GOLD;
                      e.currentTarget.style.borderColor = FOOTER_GOLD;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = FOOTER_MUTED;
                      e.currentTarget.style.borderColor = FOOTER_BORDER;
                    }}
                  >
                    <Icon size={16} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Nav link columns */}
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading} className="lg:col-span-2">
                <h4
                  className="font-display font-semibold text-sm mb-5 flex items-center gap-2"
                  style={{ color: FOOTER_GOLD }}
                >
                  <span
                    className="w-5 h-0.5 rounded-full inline-block"
                    style={{ background: FOOTER_GOLD }}
                  />
                  {heading}
                </h4>
                <ul className="space-y-3">
                  {links.map(({ label, to }) => (
                    <li key={label}>
                      <Link
                        to={to}
                        className="text-sm flex items-center gap-1.5 group transition-smooth"
                        style={{ color: FOOTER_MUTED }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = FOOTER_TEXT;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = FOOTER_MUTED;
                        }}
                      >
                        <span
                          className="w-1 h-1 rounded-full flex-shrink-0 transition-smooth group-hover:w-2"
                          style={{ background: FOOTER_GOLD, opacity: 0.5 }}
                        />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Origins grid */}
            <div className="lg:col-span-3">
              <h4
                className="font-display font-semibold text-sm mb-5 flex items-center gap-2"
                style={{ color: FOOTER_GOLD }}
              >
                <span
                  className="w-5 h-0.5 rounded-full inline-block"
                  style={{ background: FOOTER_GOLD }}
                />
                Our Origins
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {origins.map((o) => (
                  <motion.div
                    key={o.name}
                    whileHover={{ scale: 1.04, y: -2 }}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-smooth cursor-default"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${FOOTER_BORDER}`,
                    }}
                  >
                    <span className="text-base leading-none">{o.flag}</span>
                    <span
                      className="text-xs font-medium truncate"
                      style={{ color: FOOTER_MUTED }}
                    >
                      {o.name}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Quality pledge card */}
              <div
                className="mt-5 rounded-xl p-4"
                style={{
                  background: "rgba(201,168,76,0.08)",
                  border: `1px solid ${FOOTER_BORDER}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(201,168,76,0.18)" }}
                  >
                    <span className="text-sm">🍃</span>
                  </div>
                  <span
                    className="text-xs font-bold tracking-wide"
                    style={{ color: FOOTER_GOLD }}
                  >
                    Quality Pledge
                  </span>
                </div>
                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: FOOTER_MUTED }}
                >
                  Every leaf traced to a single garden, harvest, and elevation.
                  Sourced with reverence since 2018.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: `1px solid ${FOOTER_BORDER}`,
            background: FOOTER_BOTTOM_BG,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div
              className="flex flex-wrap items-center gap-3 text-xs"
              style={{ color: FOOTER_MUTED }}
            >
              <span>© {year} Swadistchai. All rights reserved.</span>
              <span
                className="hidden sm:block"
                style={{ color: FOOTER_BORDER }}
              >
                ·
              </span>
              <Link
                to="/contact"
                className="transition-smooth hidden sm:block"
                style={{ color: FOOTER_MUTED }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = FOOTER_GOLD;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = FOOTER_MUTED;
                }}
              >
                Privacy Policy
              </Link>
              <span
                className="hidden sm:block"
                style={{ color: FOOTER_BORDER }}
              >
                ·
              </span>
              <Link
                to="/contact"
                className="transition-smooth hidden sm:block"
                style={{ color: FOOTER_MUTED }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = FOOTER_GOLD;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = FOOTER_MUTED;
                }}
              >
                Terms of Service
              </Link>
            </div>
            <span className="text-xs" style={{ color: FOOTER_MUTED }}>
              Built with love ❤️
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
