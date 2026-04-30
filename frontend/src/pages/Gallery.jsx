import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Leaf,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";

/* Verified fallback image — matcha green bowl */
const FALLBACK =
  "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&q=80&auto=format&fit=crop";

/* 18 unique gallery items — all tea/nature, NO human faces */
const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Morning Mist in Darjeeling",
    category: "Gardens",
    description:
      "First light breaks over the tea terraces of Makaibari estate at 2,100 metres. The Himalayan mist clings to the ancient tea bushes until nearly noon, concentrating flavour in the leaves.",
    image:
      "https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=800&q=80&auto=format&fit=crop",
    aspect: "landscape",
  },
  {
    id: 2,
    title: "The Japanese Tea Ceremony Setup",
    category: "Ceremony",
    description:
      "An ancient ritual of silence and precision — each ceramic vessel choreographed over centuries to honour the spirit of the leaf. The ceremony begins before sunrise in Uji.",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80&auto=format&fit=crop",
    aspect: "portrait",
  },
  {
    id: 3,
    title: "Ceremonial Matcha Whisked",
    category: "Ceremony",
    description:
      "Vivid emerald matcha powder whisked to a silken froth in a handmade chawan bowl. Shade-grown for 30 days, stone-ground to order — this is Uji ceremonial grade at its finest.",
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80&auto=format&fit=crop",
    aspect: "square",
  },
  {
    id: 4,
    title: "Loose Leaf Artistry",
    category: "Products",
    description:
      "Every blend begins with whole leaves — never broken, never fannings. The integrity of the leaf determines the soul of the cup. This is the Swadistchai standard.",
    image:
      "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800&q=80&auto=format&fit=crop",
    aspect: "square",
  },
  {
    id: 5,
    title: "Nilgiri Blue Mountain Terraces",
    category: "Gardens",
    description:
      "The sculpted rows of Nilgiri tea bushes trace the mountainside of Tamil Nadu — terroir shaped by altitude, mist, and the cool southern Indian climate.",
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80&auto=format&fit=crop",
    aspect: "landscape",
  },
  {
    id: 6,
    title: "First Flush Darjeeling Pour",
    category: "Ceremony",
    description:
      "A slow, deliberate pour — water at exactly 85°C dancing across first-flush Darjeeling leaves, unlocking layers of muscatel and wildflower fragrance.",
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80&auto=format&fit=crop",
    aspect: "portrait",
  },
  {
    id: 7,
    title: "The Harvest Season",
    category: "Harvest",
    description:
      "Premium orthodox tea requires only two leaves and a bud — the industry standard that separates the exceptional from the ordinary. Quality always over speed.",
    image:
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80&auto=format&fit=crop",
    aspect: "square",
  },
  {
    id: 8,
    title: "Assam Gold at Sunrise",
    category: "Gardens",
    description:
      "The estates of Upper Assam glow amber at golden hour. Rich alluvial soil and intense monsoon rains produce teas of unrivalled body — the backbone of India's morning cup.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop",
    aspect: "landscape",
  },
  {
    id: 9,
    title: "Alishan High Mountain Oolong",
    category: "Products",
    description:
      "Taiwan's Alishan range at 1,400 metres — where dramatic temperature swings concentrate natural sugars into a floral, honey-cream profile unlike any tea on earth.",
    image:
      "https://images.unsplash.com/photo-1597481499750-3e6b22637536?w=800&q=80&auto=format&fit=crop",
    aspect: "portrait",
  },
  {
    id: 10,
    title: "White Tea Buds — Fujian",
    category: "Products",
    description:
      "Silver Needle buds picked on only two days each spring in Fujian — their silver-white down a sign of natural protection and extraordinary delicacy.",
    image:
      "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=800&q=80&auto=format&fit=crop",
    aspect: "landscape",
  },
  {
    id: 11,
    title: "Matcha Green — Ceremonial Grade",
    category: "Products",
    description:
      "Vivid ceremonial-grade matcha powder from first harvest Uji tencha. The colour alone tells you everything about the quality — deep, saturated jade green.",
    image:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&q=80&auto=format&fit=crop",
    aspect: "square",
  },
  {
    id: 12,
    title: "Himalayan Herb Gardens",
    category: "Harvest",
    description:
      "Wild chamomile and tulsi gathered from the foothills of Uttarakhand — a harvest of rare medicinal abundance used in our Evening Wellness Blend.",
    image:
      "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80&auto=format&fit=crop",
    aspect: "landscape",
  },
  {
    id: 13,
    title: "Darjeeling at Dawn",
    category: "Gardens",
    description:
      "Before the day's heat arrives, Darjeeling's terraces glow in the gold of a new morning — mist threading through ancient tea bushes that have stood for 150 years.",
    image:
      "https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=800&q=80&auto=format&fit=crop",
    aspect: "portrait",
  },
  {
    id: 14,
    title: "Nature's Garden Path",
    category: "Gardens",
    description:
      "A winding path through verdant tea gardens — the unhurried pace of nature that defines how we source, select, and celebrate every leaf.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80&auto=format&fit=crop",
    aspect: "landscape",
  },
  {
    id: 15,
    title: "Masala Chai Spice Selection",
    category: "Products",
    description:
      "True Ceylon cinnamon, Malabar cardamom, star anise, and hand-cracked black pepper — the living foundation of our award-winning Masala Chai Reserve.",
    image:
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80&auto=format&fit=crop",
    aspect: "square",
  },
  {
    id: 16,
    title: "Monsoon Flush, Upper Assam",
    category: "Harvest",
    description:
      "The rains of June nourish Assam's estates — a flush with bold, brisk character that has anchored Indian mornings for generations. Nothing else wakes you up the same way.",
    image:
      "https://images.unsplash.com/photo-1566748963551-6f5b3fc0d5e1?w=800&q=80&auto=format&fit=crop",
    aspect: "landscape",
  },
  {
    id: 17,
    title: "Cast Iron Teapot",
    category: "Ceremony",
    description:
      "A traditional cast iron tetsubin teapot — the vessel that transforms water into ceremony. Crafted in Japan, it retains heat and imparts a depth that no other material can replicate.",
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80&auto=format&fit=crop",
    aspect: "portrait",
  },
  {
    id: 18,
    title: "Garden Path at Twilight",
    category: "Gardens",
    description:
      "As the day ends, a narrow path winds through rows of Nilgiri bushes — the air heavy with the scent of fresh leaf and damp earth. This is why we source from the source.",
    image:
      "https://images.unsplash.com/photo-1523920290228-4f321a939b4c?w=800&q=80&auto=format&fit=crop",
    aspect: "landscape",
  },
];

const CATEGORIES = ["All", "Gardens", "Ceremony", "Products", "Harvest"];

const CATEGORY_META = {
  Gardens: {
    pill: "bg-emerald-900/70 text-emerald-100",
    dot: "bg-emerald-400",
    desc: "Tea estates at their most breathtaking",
    icon: "🌿",
  },
  Ceremony: {
    pill: "bg-amber-900/70 text-amber-100",
    dot: "bg-amber-400",
    desc: "Ancient rituals of precision and presence",
    icon: "🍵",
  },
  Products: {
    pill: "bg-teal-900/70 text-teal-100",
    dot: "bg-teal-400",
    desc: "Teas crafted to the highest standard",
    icon: "🫖",
  },
  Harvest: {
    pill: "bg-lime-900/70 text-lime-100",
    dot: "bg-lime-400",
    desc: "From bud to basket — the harvest season",
    icon: "🌱",
  },
};

/* Aspect ratio helper */
const ASPECT = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  square: "aspect-square",
};

function GalleryCard({ item, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const meta = CATEGORY_META[item.category] || {
    pill: "bg-black/60 text-white",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative rounded-2xl overflow-hidden cursor-pointer group w-full ${ASPECT[item.aspect]}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(item)}
      data-ocid={`gallery-card-${item.id}`}
    >
      {/* Image with zoom */}
      <motion.img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: hovered ? 1.07 : 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        loading="lazy"
        onError={(e) => {
          e.target.src = FALLBACK;
          e.target.onerror = null;
        }}
      />

      {/* Gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
        animate={{ opacity: hovered ? 1 : 0.65 }}
        transition={{ duration: 0.3 }}
      />

      {/* Category badge */}
      <span
        className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm ${meta.pill}`}
      >
        {item.category}
      </span>

      {/* Expand icon on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20"
          >
            <Camera size={13} className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-display font-semibold text-white text-sm leading-snug drop-shadow-lg mb-1">
          {item.title}
        </h3>
        <AnimatePresence>
          {hovered && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.22 }}
              className="text-white/75 text-[11px] leading-relaxed line-clamp-2"
            >
              {item.description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Lightbox({ item, onClose, onPrev, onNext, canPrev, canNext }) {
  const meta = CATEGORY_META[item.category] || {
    pill: "bg-muted text-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-4"
      onClick={onClose}
      data-ocid="lightbox-overlay"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-5xl w-full bg-card rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
        data-ocid="lightbox-modal"
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-smooth"
          aria-label="Close lightbox"
          data-ocid="lightbox-close"
        >
          <X size={16} />
        </button>

        {/* Image panel */}
        <div className="md:w-3/5 relative aspect-[4/3] md:aspect-auto bg-secondary/30 min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.img
              key={item.id}
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
              onError={(e) => {
                e.target.src = FALLBACK;
                e.target.onerror = null;
              }}
            />
          </AnimatePresence>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

          <button
            type="button"
            onClick={onPrev}
            disabled={!canPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-25 hover:bg-black/65 transition-smooth"
            aria-label="Previous image"
            data-ocid="lightbox-prev"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-25 hover:bg-black/65 transition-smooth"
            aria-label="Next image"
            data-ocid="lightbox-next"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Info panel */}
        <div className="md:w-2/5 p-7 flex flex-col justify-between bg-card">
          <div>
            <span
              className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 ${meta.pill}`}
            >
              {item.category}
            </span>
            <h2 className="font-display text-2xl font-semibold text-foreground leading-snug mb-4">
              {item.title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
          <div className="mt-6 pt-5 border-t border-border space-y-3">
            <Link
              to="/shop"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-smooth"
              onClick={onClose}
              data-ocid="lightbox-shop-cta"
            >
              Shop This Blend
              <ArrowRight size={14} />
            </Link>
            <p className="text-xs text-center text-muted-foreground">
              Swadistchai · Sourced with Reverence
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* Distribute items into named columns for a true masonry layout */
function distributeColumns(items, cols) {
  const columns = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => columns[i % cols].push(item));
  return columns;
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxItem, setLightboxItem] = useState(null);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((i) => i.category === activeCategory);
  }, [activeCategory]);

  const currentIndex = lightboxItem
    ? filtered.findIndex((i) => i.id === lightboxItem.id)
    : -1;

  const openLightbox = useCallback((item) => setLightboxItem(item), []);
  const closeLightbox = useCallback(() => setLightboxItem(null), []);
  const goPrev = useCallback(() => {
    if (currentIndex > 0) setLightboxItem(filtered[currentIndex - 1]);
  }, [currentIndex, filtered]);
  const goNext = useCallback(() => {
    if (currentIndex < filtered.length - 1)
      setLightboxItem(filtered[currentIndex + 1]);
  }, [currentIndex, filtered]);

  const activeMeta =
    activeCategory !== "All" ? CATEGORY_META[activeCategory] : null;

  /* 3-column masonry on desktop, 2 on tablet, 1 on mobile */
  const col3 = useMemo(() => distributeColumns(filtered, 3), [filtered]);
  const col2 = useMemo(() => distributeColumns(filtered, 2), [filtered]);

  return (
    <div className="pt-16 lg:pt-20 bg-background min-h-screen">
      {/* ── Cinematic Hero ── */}
      <div className="relative overflow-hidden min-h-[480px] md:min-h-[580px] flex items-end">
        <img
          src="/assets/generated/tea-hero-nature.dim_1400x800.jpg"
          alt="Lush tea plantation with teapot and cup"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&h=800&q=80&auto=format&fit=crop";
            e.target.onerror = null;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />

        {/* Animated bokeh */}
        {[
          { top: "12%", left: "7%", size: 8, dur: 4, delay: 0, id: "a" },
          { top: "25%", left: "18%", size: 5, dur: 6, delay: 1, id: "b" },
          { top: "40%", right: "10%", size: 10, dur: 5, delay: 0.5, id: "c" },
          { top: "15%", right: "22%", size: 6, dur: 7, delay: 2, id: "d" },
          { top: "60%", left: "35%", size: 4, dur: 3.5, delay: 1.5, id: "e" },
        ].map((dot) => (
          <motion.div
            key={`bokeh-${dot.id}`}
            className="absolute rounded-full bg-white/20 pointer-events-none"
            style={{
              width: dot.size,
              height: dot.size,
              top: dot.top,
              left: dot.left,
              right: dot.right,
            }}
            animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.4, 1] }}
            transition={{
              duration: dot.dur,
              repeat: Number.POSITIVE_INFINITY,
              delay: dot.delay,
            }}
          />
        ))}

        {/* Hero text */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <span
              className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] px-4 py-2 rounded-full mb-5 border"
              style={{
                background: "rgba(255,255,255,0.10)",
                borderColor: "rgba(255,255,255,0.25)",
                color: "#fff",
                backdropFilter: "blur(8px)",
              }}
            >
              <Camera size={12} />
              Visual Journal
            </span>
            <h1
              className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.05] mb-5"
              style={{ textShadow: "0 3px 24px rgba(0,0,0,0.55)" }}
            >
              Our World in
              <br />
              <span style={{ color: "#D4A847" }}>Every Leaf</span>
            </h1>
            <p
              className="text-white/75 text-base md:text-lg max-w-xl leading-relaxed"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
            >
              A visual journey through India's finest tea gardens, ancient
              ceremonies, and the artistry behind every cup — from mist-wrapped
              Darjeeling hillsides to the meditative pour.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Category filter tabs ── */}
      <div className="bg-card/96 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <motion.button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ y: -1.5 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-smooth ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-tea"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  data-ocid={`gallery-filter-${cat.toLowerCase()}`}
                >
                  {cat !== "All" && CATEGORY_META[cat] && (
                    <span className="text-sm leading-none">
                      {CATEGORY_META[cat].icon}
                    </span>
                  )}
                  {cat}
                </motion.button>
              );
            })}

            <AnimatePresence mode="wait">
              {activeMeta && (
                <motion.span
                  key={activeCategory}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25 }}
                  className="ml-4 shrink-0 hidden sm:block text-xs text-muted-foreground italic"
                >
                  {activeMeta.desc}
                </motion.span>
              )}
            </AnimatePresence>

            <span className="ml-auto shrink-0 pl-4 text-xs text-muted-foreground font-medium">
              {filtered.length} {filtered.length === 1 ? "image" : "images"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── True CSS Masonry Gallery ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            data-ocid="gallery-grid"
          >
            {/* Desktop: 3 columns */}
            <div className="hidden lg:flex gap-4 items-start">
              <div className="flex-1 flex flex-col gap-4">
                {col3[0]?.map((item) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    onOpen={openLightbox}
                  />
                ))}
              </div>
              <div className="flex-1 flex flex-col gap-4">
                {col3[1]?.map((item) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    onOpen={openLightbox}
                  />
                ))}
              </div>
              <div className="flex-1 flex flex-col gap-4">
                {col3[2]?.map((item) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    onOpen={openLightbox}
                  />
                ))}
              </div>
            </div>

            {/* Tablet: 2 columns */}
            <div className="hidden sm:flex lg:hidden gap-4 items-start">
              <div className="flex-1 flex flex-col gap-4">
                {col2[0]?.map((item) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    onOpen={openLightbox}
                  />
                ))}
              </div>
              <div className="flex-1 flex flex-col gap-4">
                {col2[1]?.map((item) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    onOpen={openLightbox}
                  />
                ))}
              </div>
            </div>

            {/* Mobile: 1 column */}
            <div className="flex sm:hidden flex-col gap-4">
              {filtered.map((item) => (
                <GalleryCard key={item.id} item={item} onOpen={openLightbox} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Pull quote divider ── */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="my-20"
        >
          <div className="flex items-center gap-6 mb-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <Leaf size={18} className="text-primary opacity-50 shrink-0" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <div
            className="rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.97 0.025 80), oklch(0.93 0.035 130))",
              border: "1px solid rgba(74,104,53,0.15)",
            }}
          >
            <span
              className="absolute top-4 left-8 text-[120px] font-display italic leading-none select-none pointer-events-none"
              style={{ color: "var(--tea-green)", opacity: 0.07 }}
            >
              "
            </span>
            <blockquote className="relative z-10">
              <p
                className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold italic leading-relaxed mb-7 max-w-3xl mx-auto"
                style={{ color: "oklch(0.20 0.04 130)" }}
              >
                Every leaf tells a story of the mountain it came from.
              </p>
              <footer className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-px w-10 bg-primary/30" />
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                    <Leaf size={14} className="text-primary" />
                  </div>
                  <div className="h-px w-10 bg-primary/30" />
                </div>
                <p
                  className="text-sm font-semibold uppercase tracking-widest"
                  style={{ color: "var(--tea-green)" }}
                >
                  Arjun Mehta — Founder & Master Blender, Swadistchai
                </p>
              </footer>
            </blockquote>
          </div>

          <div className="flex items-center gap-6 mt-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <Leaf size={18} className="text-primary opacity-50 shrink-0" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </motion.div>

        {/* ── Category showcase ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {Object.entries(CATEGORY_META).map(([cat, meta], i) => (
            <motion.button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-tea transition-smooth text-center cursor-pointer"
              data-ocid={`gallery-category-${cat.toLowerCase()}`}
            >
              <span className="text-2xl">{meta.icon}</span>
              <span className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors-smooth">
                {cat}
              </span>
              <span className="text-xs text-muted-foreground leading-relaxed">
                {meta.desc}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <img
            src="https://images.unsplash.com/photo-1566748963551-6f5b3fc0d5e1?w=1400&h=600&q=80&auto=format&fit=crop"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1400&h=600&q=80&auto=format&fit=crop";
              e.target.onerror = null;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />

          <div className="relative z-10 text-center py-20 px-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent mb-4 block">
              From Garden to Cup
            </span>
            <h2
              className="font-display text-4xl md:text-5xl font-semibold text-white mb-5 leading-tight"
              style={{ textShadow: "0 2px 18px rgba(0,0,0,0.5)" }}
            >
              Begin Your Tea Journey
            </h2>
            <p className="text-white/75 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Every image in this gallery is a promise — of quality, of
              provenance, of a cup that is truly worth slowing down for.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-accent text-accent-foreground font-semibold text-base hover:bg-accent/90 transition-smooth shadow-tea"
                  data-ocid="gallery-shop-cta"
                >
                  Shop Our Teas
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white/10 border border-white/25 text-white font-semibold text-base hover:bg-white/18 transition-smooth backdrop-blur-sm"
                  data-ocid="gallery-about-cta"
                >
                  Our Story
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="py-8" />
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxItem && (
          <Lightbox
            item={lightboxItem}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
            canPrev={currentIndex > 0}
            canNext={currentIndex < filtered.length - 1}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
