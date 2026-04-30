import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import SectionContainer from "../components/SectionContainer";

const SUBJECTS = [
  { value: "", label: "Select a topic" },
  { value: "general", label: "General Inquiry" },
  { value: "order", label: "Order Support" },
  { value: "wholesale", label: "Wholesale" },
  { value: "partnership", label: "Partnership" },
];

const contactInfo = [
  {
    icon: MapPin,
    label: "Our Studio",
    value: "14 Pedder Road, Breach Candy\nMumbai, Maharashtra 400 026",
  },
  { icon: Phone, label: "Call Us", value: "+91 22 6712 4500" },
  { icon: Mail, label: "Email", value: "hello@swadistchai.com" },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon – Sat, 10 am – 7 pm IST",
  },
];

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function FormField({ label, children, index, error }) {
  return (
    <motion.div
      custom={index}
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-1.5"
    >
      <label
        htmlFor={`field-${label.replace(/\s+/g, "-").toLowerCase()}`}
        className="text-xs font-semibold uppercase tracking-wider text-foreground/60"
      >
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-destructive font-medium"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const inputCls =
  "px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth";
const inputErrorCls =
  "px-4 py-2.5 rounded-lg border border-destructive bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive transition-smooth";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      next.email = "Please enter a valid email address.";
    if (!form.subject) next.subject = "Please select a subject.";
    if (!form.message.trim() || form.message.trim().length < 10)
      next.message = "Message must be at least 10 characters.";
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Header — full-bleed cinematic */}
      <div className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1400&h=800&q=80&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=1400&h=800&q=80&auto=format&fit=crop";
            e.target.onerror = null;
          }}
        />
        {/* Multi-layer overlay: deep warm-dark gradient for luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Botanical SVG decoration — top-right */}
        <svg
          aria-hidden="true"
          className="absolute top-0 right-0 w-72 h-72 opacity-10 pointer-events-none"
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="220"
            cy="60"
            rx="80"
            ry="30"
            stroke="#D4B896"
            strokeWidth="1.5"
            transform="rotate(-30 220 60)"
          />
          <ellipse
            cx="260"
            cy="100"
            rx="70"
            ry="25"
            stroke="#D4B896"
            strokeWidth="1"
            transform="rotate(-50 260 100)"
          />
          <ellipse
            cx="180"
            cy="30"
            rx="60"
            ry="20"
            stroke="#D4B896"
            strokeWidth="1"
            transform="rotate(-15 180 30)"
          />
          <path d="M150 80 Q 200 20 270 10" stroke="#D4B896" strokeWidth="1" />
          <path
            d="M200 120 Q 240 60 290 40"
            stroke="#D4B896"
            strokeWidth="0.8"
          />
        </svg>

        {/* Botanical SVG decoration — bottom-left */}
        <svg
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-64 h-64 opacity-10 pointer-events-none"
          viewBox="0 0 280 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="60"
            cy="220"
            rx="75"
            ry="28"
            stroke="#D4B896"
            strokeWidth="1.5"
            transform="rotate(30 60 220)"
          />
          <ellipse
            cx="30"
            cy="180"
            rx="60"
            ry="22"
            stroke="#D4B896"
            strokeWidth="1"
            transform="rotate(50 30 180)"
          />
          <path d="M80 200 Q 40 260 10 270" stroke="#D4B896" strokeWidth="1" />
          <path
            d="M120 240 Q 70 280 20 290"
            stroke="#D4B896"
            strokeWidth="0.8"
          />
        </svg>

        {/* Floating leaf motifs */}
        <div
          aria-hidden="true"
          className="absolute top-12 left-[15%] w-3 h-3 rounded-full bg-accent/30 blur-sm pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-24 left-[25%] w-2 h-2 rounded-full bg-accent/20 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-16 right-[20%] w-4 h-4 rounded-full bg-accent/25 blur-sm pointer-events-none"
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 w-full">
          <div className="max-w-2xl">
            {/* Label */}
            <motion.span
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5 bg-accent/10 border border-accent/25 backdrop-blur-sm px-4 py-1.5 rounded-full"
            >
              <span className="w-1 h-1 rounded-full bg-accent inline-block" />
              Get In Touch
            </motion.span>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] text-white mb-6"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.5)" }}
            >
              We'd Love to
              <br />
              <span className="text-accent">Hear From You</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="text-white/80 text-lg leading-relaxed max-w-xl mb-10"
            >
              Whether you have a question about our teas, a wholesale enquiry,
              or simply want to share your experience — our dedicated team is
              here to welcome you.
            </motion.p>

            {/* Inline Contact Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {contactInfo.map(({ icon: Icon, label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  className="group flex flex-col items-center text-center gap-2.5 bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl px-3 py-4 cursor-default hover:bg-white/14 hover:border-accent/30 transition-all duration-300"
                  data-ocid={`contact-hero-card-${i}`}
                >
                  <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center group-hover:bg-accent/30 group-hover:scale-110 transition-all duration-300">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                    {label}
                  </p>
                  <p className="text-xs text-white/85 leading-tight whitespace-pre-line">
                    {value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <SectionContainer className="bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 xl:gap-16">
          {/* Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Contact Info */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                How to Reach Us
              </h2>
              <div className="flex flex-col gap-4">
                {contactInfo.map(({ icon: Icon, label, value }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      boxShadow: "0 15px 30px rgba(0,0,0,0.12)",
                    }}
                    className="flex items-start gap-4 bg-card rounded-xl p-4 border border-border cursor-default"
                    data-ocid={`contact-info-${i}`}
                  >
                    <motion.div
                      className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
                      whileHover={{ scale: 1.2, rotate: -10 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                      }}
                    >
                      <Icon size={18} className="text-primary" />
                    </motion.div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {label}
                      </p>
                      <p className="text-sm text-foreground mt-0.5 whitespace-pre-line leading-relaxed">
                        {value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl overflow-hidden border border-border shadow-card"
            >
              <div className="relative bg-muted/40 aspect-[4/3] flex items-center justify-center">
                {/* Decorative map grid lines */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="mapgrid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mapgrid)" />
                </svg>
                {/* Curved roads */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-30"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M0 80 Q 120 60, 200 90 T 400 80"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-muted-foreground"
                  />
                  <path
                    d="M100 0 Q 120 80, 110 180"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-muted-foreground"
                  />
                </svg>
                <div className="relative z-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-3 shadow-tea">
                    <MapPin size={20} className="text-primary-foreground" />
                  </div>
                  <p className="font-display text-sm font-semibold text-foreground">
                    14 Pedder Road, Breach Candy
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Mumbai, Maharashtra 400 026
                  </p>
                </div>
              </div>
              <div className="bg-card px-5 py-3 border-t border-border flex items-center gap-2">
                <MapPin size={14} className="text-primary shrink-0" />
                <span className="text-xs text-muted-foreground">
                  Open in Maps · 14 Pedder Road, Breach Candy, Mumbai
                </span>
              </div>
            </motion.div>

            {/* Response notice + Tea Tasting Studio */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-secondary/40 rounded-xl p-5 border border-border">
                <h3 className="font-display font-semibold text-sm text-foreground mb-1.5">
                  Response Time
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We respond to all enquiries within 24 hours during business
                  days (Mon–Sat, 10 am–7 pm IST). For urgent orders, please call
                  us directly.
                </p>
              </div>
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/15">
                <h3 className="font-display font-semibold text-sm text-foreground mb-1.5 flex items-center gap-2">
                  <span>🍵</span>
                  Tea Tasting Studio
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Visit our Breach Candy studio for a private tea tasting
                  session — explore Darjeeling first flush, ceremonial matcha,
                  and rare single-origin blends with our master blender.
                  Appointments recommended.
                </p>
              </div>
            </motion.div>

            {/* Social */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Follow Our Journey
              </p>
              <div className="flex gap-3" data-ocid="contact-social-links">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-smooth"
                  >
                    <Icon size={17} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                  data-ocid="contact-success"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
                  >
                    <Send size={32} className="text-primary" />
                  </motion.div>
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                    Message Sent
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                    Thank you for reaching out. One of our team members will be
                    in touch with you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="mt-8 text-sm text-primary font-semibold hover:underline"
                    data-ocid="contact-reset"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-card flex flex-col gap-6"
                  data-ocid="contact-form"
                >
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-foreground">
                      Send a Message
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Fill in the form and we'll get back to you shortly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      label="Full Name *"
                      index={0}
                      error={errors.name}
                    >
                      <input
                        id="field-full-name-*"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={errors.name ? inputErrorCls : inputCls}
                        data-ocid="contact-name"
                      />
                    </FormField>

                    <FormField
                      label="Email Address *"
                      index={1}
                      error={errors.email}
                    >
                      <input
                        id="field-email-address-*"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={errors.email ? inputErrorCls : inputCls}
                        data-ocid="contact-email"
                      />
                    </FormField>
                  </div>

                  <FormField label="Subject *" index={2} error={errors.subject}>
                    <select
                      id="field-subject-*"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={`${errors.subject ? inputErrorCls : inputCls} cursor-pointer`}
                      data-ocid="contact-subject"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Message *" index={3} error={errors.message}>
                    <textarea
                      id="field-message-*"
                      name="message"
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      className={`${errors.message ? inputErrorCls : inputCls} resize-none`}
                      data-ocid="contact-message"
                    />
                  </FormField>

                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                    className="self-start flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-smooth shadow-tea focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    data-ocid="contact-submit"
                  >
                    <Send size={15} />
                    Send Message
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
