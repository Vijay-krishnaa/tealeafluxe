import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Leaf,
  Package,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import SectionContainer, {
  SectionHeading,
} from "../components/SectionContainer";
import categories from "../data/categories";
import testimonials from "../data/testimonials";

/* ── Fallback Hero slides ── */
const fallbackHeroSlides = [
  {
    id: 1,
    label: "Darjeeling First Flush 2026",
    title: "From Himalayan\nMist to Your Cup",
    subtitle:
      "From the fog-wrapped gardens of Darjeeling to the bold estates of Assam — every cup is a journey through India's finest tea lands.",
    cta: "Explore Our Collections",
    ctaLink: "/shop",
    image:
      "https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=1400&h=800&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    label: "Ceremonial Grade",
    title: "The Ritual\nof Matcha",
    subtitle:
      "Stone-ground Uji ceremonial matcha of rare purity — shade-grown for 30 days, whisked to a vivid silken froth.",
    cta: "Discover Matcha",
    ctaLink: "/shop",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1400&h=800&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    label: "Direct from the Garden",
    title: "Whole Leaf.\nSingle Origin.",
    subtitle:
      "We source directly from 12 estate partners across Darjeeling, Assam, Nilgiris, and beyond — no brokers, no middlemen, ever.",
    cta: "Our Story",
    ctaLink: "/about",
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1400&h=800&q=80&auto=format&fit=crop",
  },
];

/* ── Pillars ── */
const pillars = [
  {
    icon: Leaf,
    title: "Whole-Leaf Only",
    desc: "We never use fannings or dust. Every product is full-leaf, whole-bud, or whole-flower — always.",
  },
  {
    icon: Award,
    title: "Direct from Estates",
    desc: "Sourced directly from 12 estate partners in Darjeeling, Assam, Nilgiris and beyond — no brokers.",
  },
  {
    icon: Droplets,
    title: "Pure Provenance",
    desc: "Every tea traced to a single garden, harvest, and elevation. Terroir is the soul of the cup.",
  },
  {
    icon: Package,
    title: "Sealed for Freshness",
    desc: "Nitrogen-flushed, light-blocked packaging shipped from Mumbai preserves peak flavour.",
  },
];

/* ── Category Card with image hover swap ── */
function CategoryCard({ cat, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.015 }}
      style={{ transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
    >
      <Link
        to="/shop"
        className="group block relative rounded-xl overflow-hidden shadow-card hover:shadow-tea transition-smooth"
        data-ocid={`category-${cat.id}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Primary image */}
          <motion.img
            src={cat.image}
            alt={cat.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            animate={{ opacity: hovered ? 0 : 1 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          />
          {/* Hover image */}
          <motion.img
            src={cat.hoverImage || cat.image}
            alt={`${cat.name} — leaves view`}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent transition-smooth" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <h3 className="font-display font-semibold text-sm md:text-base text-white">
            {cat.name}
          </h3>
          <div className="overflow-hidden max-h-0 group-hover:max-h-10 transition-all duration-300">
            <p className="text-white/80 text-xs mt-1 line-clamp-2 leading-relaxed">
              {cat.description}
            </p>
          </div>
          <p className="text-[#D4B896] text-xs mt-1 font-semibold">
            {cat.count} {cat.count === 1 ? "variety" : "varieties"}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Testimonials Carousel ── */
function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(
      () => setIdx((c) => (c + 1) % testimonials.length),
      4500,
    );
    return () => clearInterval(t);
  }, [auto]);

  const go = (dir) => {
    setAuto(false);
    setIdx((c) => (c + dir + testimonials.length) % testimonials.length);
  };

  return (
    <SectionContainer className="bg-muted/20">
      <SectionHeading
        label="What Our Customers Say"
        title="Voices of the Steep"
        centered
      />

      <div className="relative max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45 }}
            whileHover={{ y: -3, boxShadow: "0 16px 36px rgba(0,0,0,0.10)" }}
            className="bg-card rounded-2xl p-8 md:p-12 border border-border shadow-card text-center cursor-default"
            data-ocid={`testimonial-${testimonials[idx].id}`}
          >
            <div className="flex justify-center gap-0.5 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={18} className="text-accent fill-accent" />
              ))}
            </div>
            <blockquote className="font-display italic text-lg md:text-xl text-foreground leading-relaxed mb-8">
              &ldquo;{testimonials[idx].quote}&rdquo;
            </blockquote>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-semibold text-base">
                {testimonials[idx].avatar}
              </div>
              <p className="font-semibold text-sm text-foreground">
                {testimonials[idx].name}
              </p>
              <p className="text-xs text-muted-foreground">
                {testimonials[idx].location}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5 mt-7">
          <button
            type="button"
            onClick={() => go(-1)}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-smooth"
            aria-label="Previous testimonial"
            data-ocid="testimonial-prev"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setAuto(false);
                  setIdx(i);
                }}
                className={`h-1.5 rounded-full transition-smooth ${i === idx ? "w-6 bg-primary" : "w-2 bg-border"}`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-smooth"
            aria-label="Next testimonial"
            data-ocid="testimonial-next"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </SectionContainer>
  );
}

/* ── Newsletter ── */
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.id = "newsletter-placeholder-fix";
    styleEl.textContent = "#newsletter-input::placeholder { color: #9CA3AF; }";
    document.head.appendChild(styleEl);
    return () => {
      const el = document.getElementById("newsletter-placeholder-fix");
      if (el) el.remove();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <SectionContainer className="bg-primary overflow-hidden relative">
      {/* Decorative circles */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary-foreground/5"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-accent/15"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-xl mx-auto text-center"
      >
        <Leaf className="mx-auto text-accent mb-4 opacity-80" size={32} />
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground mb-3">
          Join the Inner Circle
        </h2>
        <p className="text-primary-foreground/90 text-base leading-relaxed mb-8">
          Receive early access to seasonal harvests, brewing guides, and
          exclusive offers — reserved for our most devoted tea lovers.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent/20 border border-accent/40 text-accent font-semibold text-sm"
          >
            <Leaf size={15} />
            Thank you — welcome to the inner circle.
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            data-ocid="newsletter-form"
          >
            <input
              id="newsletter-input"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email address"
              className="flex-1 px-4 py-3 rounded-lg bg-white/15 border border-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-accent/60 transition-smooth input-on-dark"
              style={{ color: "#ffffff" }}
              data-ocid="newsletter-email"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 active:scale-95 transition-smooth whitespace-nowrap"
              data-ocid="newsletter-submit"
            >
              Subscribe
            </button>
          </form>
        )}
      </motion.div>
    </SectionContainer>
  );
}

/* ── About Preview ── */
function AboutPreviewSection() {
  return (
    <SectionContainer className="bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="order-2 lg:order-1 relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-tea aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=600&q=80&auto=format&fit=crop"
              alt="Our tea garden partners"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1566748963551-6f5b3fc0d5e1?w=900&h=600&q=80&auto=format&fit=crop";
                e.target.onerror = null;
              }}
            />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-5 -right-3 md:-right-8 bg-card border border-border shadow-card rounded-xl px-5 py-3.5 text-sm">
            <p className="font-display font-semibold text-foreground text-base">
              Founded 2018
            </p>
            <p className="text-muted-foreground text-xs mt-0.5">
              Mumbai, India
            </p>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="order-1 lg:order-2"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent mb-4">
            Our Philosophy
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground leading-tight mb-5">
            Where Every Leaf Carries
            <br />
            the Soul of Its Origin
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed mb-4">
            Founded in 2018 in Mumbai by master blender Arjun Mehta, Swadistchai
            Luxe was built on one conviction: that truly extraordinary tea
            should be traceable, transparent, and transformative. We travel to
            India's most exceptional gardens — Darjeeling, Assam, Nilgiris —
            forging direct relationships with the farmers who nurture these
            precious leaves.
          </p>
          <p className="text-muted-foreground text-base leading-relaxed mb-8">
            We never blend origins to cut costs. Every tea in our collection
            comes from a single garden, a single harvest, and a single
            elevation. From garden to cup — that is our promise.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            {["Darjeeling", "Assam", "Nilgiris", "Uji", "Alishan"].map(
              (origin) => (
                <span
                  key={origin}
                  className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold"
                >
                  {origin}
                </span>
              ),
            )}
          </div>

          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-smooth"
            data-ocid="about-preview-cta"
          >
            Discover Our Story
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </SectionContainer>
  );
}

/* ── Main Page ── */
export default function Home() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSlides, setHeroSlides] = useState(fallbackHeroSlides);
  const [slidesLoading, setSlidesLoading] = useState(true);

  // Fetch hero slides from API
  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        setSlidesLoading(true);
        const response = await fetch(
          "https://tealeafluxe.onrender.com/api/hero-slides",
        );
        const data = await response.json();
        if (data.success && data.slides && data.slides.length > 0) {
          setHeroSlides(data.slides);
        }
      } catch (error) {
        console.error("Failed to fetch hero slides:", error);
        // Keep fallback slides
      } finally {
        setSlidesLoading(false);
      }
    };
    fetchHeroSlides();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://tealeafluxe.onrender.com/api/products",
        );
        const data = await response.json();
        if (data.success && data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const featuredProducts = products.filter((p) => p.featured);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % heroSlides.length),
      5000,
    );
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length);
  };
  const next = () => {
    setIsAutoPlaying(false);
    setCurrent((c) => (c + 1) % heroSlides.length);
  };

  return (
    <div className="pt-16 lg:pt-20">
      {/* ── Hero Carousel ── */}
      <section
        className="relative h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] min-h-[560px] max-h-[840px] overflow-hidden"
        aria-label="Hero carousel"
      >
        <AnimatePresence mode="wait">
          {heroSlides.map((slide, i) =>
            i === current ? (
              <motion.div
                key={slide._id || slide.id || i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75 }}
                className="absolute inset-0"
              >
                <img
                  src={slide.image}
                  alt={slide.title.replace("\n", " ")}
                  className="absolute inset-0 w-full h-full object-cover"
                  priority="true"
                />
                {/* Dark overlay for text legibility — no green tint */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
            <div className="max-w-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <span className="inline-block text-accent text-xs font-semibold uppercase tracking-widest mb-5 bg-accent/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-accent/25">
                    {heroSlides[current]?.label || ""}
                  </span>
                  <h1
                    className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-semibold leading-[1.12] whitespace-pre-line mb-5 text-balance"
                    style={{
                      color: "#ffffff",
                      textShadow: "0 2px 12px rgba(0,0,0,0.7)",
                    }}
                  >
                    {heroSlides[current]?.title || ""}
                  </h1>
                  <p
                    className="text-base sm:text-lg leading-relaxed mb-8 max-w-sm"
                    style={{
                      color: "#FFF8F0",
                      textShadow: "0 1px 6px rgba(0,0,0,0.6)",
                    }}
                  >
                    {heroSlides[current]?.subtitle || ""}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={heroSlides[current]?.ctaLink || "/shop"}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 active:scale-95 transition-smooth shadow-xs"
                      data-ocid="hero-cta"
                    >
                      {heroSlides[current]?.cta || "Explore"}
                      <ArrowRight size={15} />
                    </Link>
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary-foreground/12 backdrop-blur-sm border border-primary-foreground/28 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/22 transition-smooth"
                    >
                      Our Story
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Slide progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-foreground/15 z-20">
          <motion.div
            key={current}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            className="h-full bg-accent"
          />
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4">
          <button
            type="button"
            onClick={prev}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-foreground/15 backdrop-blur-sm hover:bg-primary-foreground/30 text-primary-foreground transition-smooth border border-primary-foreground/20"
            aria-label="Previous slide"
            data-ocid="hero-prev"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-2">
            {heroSlides.map((slide, i) => (
              <button
                type="button"
                key={slide._id || slide.id || i}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrent(i);
                }}
                className={`h-1.5 rounded-full transition-smooth ${i === current ? "w-6 bg-accent" : "w-2 bg-primary-foreground/35"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-foreground/15 backdrop-blur-sm hover:bg-primary-foreground/30 text-primary-foreground transition-smooth border border-primary-foreground/20"
            aria-label="Next slide"
            data-ocid="hero-next"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* ── Pillars bar ── */}
      <SectionContainer className="bg-card border-b border-border" tight>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {pillars.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.45,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              whileHover={{
                y: -3,
                scale: 1.015,
                boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
              }}
              className="flex flex-col gap-3 cursor-default"
              data-ocid={`pillar-${i}`}
            >
              <motion.div
                className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
                whileHover={{ scale: 1.15, rotate: 6 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Icon size={20} className="text-primary" />
              </motion.div>
              <div>
                <h3 className="font-display font-semibold text-sm text-foreground mb-1">
                  {title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionContainer>

      {/* ── Featured Collections ── */}
      <SectionContainer>
        <SectionHeading
          label="Hand-Selected"
          title="Featured Collections"
          subtitle="Our master tea buyers select only the finest leaves from each harvest season."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg border border-primary text-primary hover:bg-primary/8 font-semibold text-sm transition-smooth"
            data-ocid="featured-view-all"
          >
            View All Teas
            <ArrowRight size={16} />
          </Link>
        </div>
      </SectionContainer>

      {/* ── Category Grid ── */}
      <SectionContainer className="bg-muted/30">
        <SectionHeading
          label="Browse by Type"
          title="Explore Our Collections"
          subtitle="From crisp greens to warming chais — discover teas for every mood and moment."
          centered
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>
      </SectionContainer>

      {/* ── Testimonials Carousel ── */}
      <TestimonialsSection />

      {/* ── About Preview ── */}
      <AboutPreviewSection />

      {/* ── Newsletter ── */}
      <NewsletterSection />
    </div>
  );
}
