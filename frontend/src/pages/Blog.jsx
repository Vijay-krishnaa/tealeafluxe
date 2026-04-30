import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, Leaf, Tag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import SectionContainer, {
  SectionHeading,
} from "../components/SectionContainer";
import blogPosts from "../data/blogPosts";

const CATEGORIES = [
  "All",
  "Tea Culture",
  "Origin Stories",
  "Wellness",
  "Education",
  "Recipes",
  "Sustainability",
];

const categoryColors = {
  "Tea Culture": "bg-primary/10 text-primary border-primary/20",
  "Origin Stories": "bg-accent/15 text-accent border-accent/20",
  Wellness: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Education: "bg-secondary text-secondary-foreground border-border",
  Recipes: "bg-muted text-muted-foreground border-border",
  Sustainability: "bg-primary/8 text-primary border-primary/15",
};

function CategoryBadge({ category, size = "sm" }) {
  const cls =
    categoryColors[category] || "bg-muted text-muted-foreground border-border";
  const padding =
    size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1 ${padding} font-semibold uppercase tracking-widest rounded-md border ${cls}`}
    >
      {size !== "sm" && <Tag size={9} />}
      {category}
    </span>
  );
}

function AuthorAvatar({ author }) {
  const initials = author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/15 text-primary text-[10px] font-bold shrink-0">
      {initials}
    </span>
  );
}

function FeaturedPost({ post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="mb-14"
    >
      <Link
        to="/blog/$id"
        params={{ id: post.id }}
        className="group block"
        data-ocid={`blog-featured-${post.id}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 rounded-2xl overflow-hidden shadow-tea border border-border bg-card hover:shadow-[0_8px_40px_-8px_oklch(0.42_0.16_160/0.2)] transition-smooth">
          {/* Image */}
          <div className="md:col-span-3 aspect-[4/3] md:aspect-auto md:min-h-[360px] overflow-hidden relative">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=800&h=500&q=80&auto=format&fit=crop";
                e.target.onerror = null;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20 hidden md:block" />
            <div className="absolute top-4 left-4">
              <span className="text-[9px] font-bold uppercase tracking-widest bg-accent/90 text-accent-foreground px-2.5 py-1 rounded-full backdrop-blur-sm">
                Featured
              </span>
            </div>
          </div>
          {/* Content */}
          <div className="md:col-span-2 p-8 md:p-10 flex flex-col justify-center gap-5">
            <div className="flex items-center gap-3 flex-wrap">
              <CategoryBadge category={post.category} />
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock size={11} /> {post.readTime} min read
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground group-hover:text-primary transition-colors-smooth leading-snug">
              {post.title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between pt-5 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AuthorAvatar author={post.author} />
                <span>{post.author}</span>
                <span className="text-border">·</span>
                <Calendar size={11} />
                <span>{post.date}</span>
              </div>
              <span className="text-primary text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-smooth">
                Read story <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function PostCard({ post, index }) {
  return (
    <motion.article
      key={post.id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: index * 0.09,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-tea hover:-translate-y-1 transition-smooth flex flex-col"
      data-ocid={`blog-card-${post.id}`}
    >
      <Link
        to="/blog/$id"
        params={{ id: post.id }}
        className="block overflow-hidden"
        aria-label={post.title}
      >
        <div className="aspect-[16/10] overflow-hidden relative">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-107 transition-smooth"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=800&h=500&q=80&auto=format&fit=crop";
              e.target.onerror = null;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge category={post.category} size="sm" />
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock size={10} /> {post.readTime} min
          </span>
        </div>
        <Link to="/blog/$id" params={{ id: post.id }} className="block">
          <h3 className="font-display font-semibold text-base text-foreground group-hover:text-primary transition-colors-smooth leading-snug">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
            <AuthorAvatar author={post.author} />
            <span className="truncate">{post.author}</span>
          </div>
          <Link
            to="/blog/$id"
            params={{ id: post.id }}
            className="text-primary font-semibold text-xs flex items-center gap-1 hover:gap-2 transition-smooth shrink-0"
          >
            Read <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

  const [featured, ...grid] = filtered;

  return (
    <div className="pt-16 lg:pt-20">
      {/* Page Hero Header */}
      <div className="relative border-b border-border overflow-hidden min-h-[340px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&h=600&q=80&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1566748963551-6f5b3fc0d5e1?w=1400&h=600&q=80&auto=format&fit=crop";
            e.target.onerror = null;
          }}
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Subtle gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 relative w-full">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={14} className="text-[#D4B896]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#D4B896]">
                Stories & Wisdom
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight mb-4">
              Tea Stories &{" "}
              <span className="text-[#D4B896] italic">Insights</span>
            </h1>
            <p className="text-white/80 text-base leading-relaxed max-w-lg">
              Exploring the culture, craft, and calm of whole-leaf tea — from
              ancient ceremonies to modern wellness rituals.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="bg-background border-b border-border sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveCategory(cat)}
                data-ocid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-smooth shrink-0 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <SectionContainer>
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center"
              data-ocid="blog-empty-state"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
                <Leaf size={24} className="text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No stories yet
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                More articles in this category coming soon.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory("All")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-smooth"
              >
                View all stories
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Featured Post */}
              {featured && <FeaturedPost post={featured} />}

              {/* Grid */}
              {grid.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-7">
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      {activeCategory === "All"
                        ? "More Stories"
                        : `More on ${activeCategory}`}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {grid.length} article{grid.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {grid.map((post, i) => (
                      <PostCard key={post.id} post={post} index={i} />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </SectionContainer>

      {/* Newsletter CTA band */}
      <div className="bg-muted/40 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Leaf size={20} className="text-primary mx-auto mb-4" />
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
              Savour every story
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              Discover the teas behind each article — hand-selected, ethically
              sourced, delivered to your door.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-smooth shadow-tea"
              data-ocid="blog-shop-cta"
            >
              Explore Our Teas <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
