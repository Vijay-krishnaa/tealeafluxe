import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Leaf,
  Tag,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import blogPosts from "../data/blogPosts";

const categoryColors = {
  "Tea Culture": "bg-primary/10 text-primary border-primary/20",
  "Origin Stories": "bg-accent/15 text-accent border-accent/20",
  Wellness: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Education: "bg-secondary text-secondary-foreground border-border",
  Recipes: "bg-muted text-muted-foreground border-border",
  Sustainability: "bg-primary/8 text-primary border-primary/15",
};

function CategoryBadge({ category }) {
  const cls =
    categoryColors[category] || "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-widest rounded-md border ${cls}`}
    >
      <Tag size={10} />
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
    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/15 text-primary text-sm font-bold shrink-0">
      {initials}
    </span>
  );
}

function RelatedCard({ post, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      whileHover={{
        y: -4,
        scale: 1.01,
        boxShadow: "0 16px 32px oklch(0.42 0.16 160 / 0.12)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 22,
        delay: index * 0.08,
      }}
    >
      <Link
        to="/blog/$id"
        params={{ id: post.id }}
        className="group flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-smooth"
        data-ocid={`related-post-${post.id}`}
      >
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        </div>
        <div className="min-w-0 flex flex-col gap-1 justify-center">
          <CategoryBadge category={post.category} />
          <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors-smooth leading-snug line-clamp-2">
            {post.title}
          </h3>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock size={10} /> {post.readTime} min read
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function NotFound() {
  return (
    <div className="pt-32 pb-24 text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Leaf size={32} className="text-muted-foreground" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-3">
          Story Not Found
        </h1>
        <p className="text-muted-foreground text-base mb-8 max-w-sm mx-auto leading-relaxed">
          This article may have moved or no longer exists. Explore our full
          journal to find more tea stories.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-smooth shadow-tea"
          data-ocid="blog-404-back"
        >
          <ArrowLeft size={14} />
          Back to Journal
        </Link>
      </motion.div>
    </div>
  );
}

export default function BlogPost() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();

  const post = blogPosts.find((p) => p.id === id);
  const related = blogPosts
    .filter((p) => p.id !== id)
    .sort((a, b) => {
      if (a.category === post?.category && b.category !== post?.category)
        return -1;
      if (b.category === post?.category && a.category !== post?.category)
        return 1;
      return 0;
    })
    .slice(0, 3);

  if (!post) return <NotFound />;

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Image with Title Overlay */}
      <div className="relative h-72 md:h-[480px] overflow-hidden">
        <motion.img
          src={post.image}
          alt={post.title}
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay — ensures title is always readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-foreground/10" />

        {/* Title overlay content */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              <CategoryBadge category={post.category} />
              <h1 className="font-display text-2xl md:text-4xl font-semibold text-white leading-snug mt-3 text-balance drop-shadow-sm">
                {post.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          onClick={() => navigate({ to: "/blog" })}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors-smooth mb-8 group"
          data-ocid="blog-back"
        >
          <ArrowLeft
            size={15}
            className="group-hover:-translate-x-0.5 transition-smooth"
          />
          Back to Journal
        </motion.button>

        {/* Author + Meta bar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex flex-wrap items-center gap-4 mb-8 pb-7 border-b border-border"
        >
          <div className="flex items-center gap-3">
            <AuthorAvatar author={post.author} />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {post.author}
              </p>
              <p className="text-xs text-muted-foreground">Tea Specialist</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground ml-0 sm:ml-4 border-l-0 sm:border-l border-border pl-0 sm:pl-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {post.readTime} min read
            </span>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Lead / excerpt */}
          <p className="font-display text-xl md:text-2xl text-foreground/85 leading-relaxed italic mb-8 font-medium">
            {post.excerpt}
          </p>

          {/* Body paragraphs */}
          <div className="space-y-6 text-foreground/75 text-[1.0625rem] leading-[1.85]">
            <p>{post.content}</p>
            <p>
              The ritual of brewing loose-leaf tea — measuring, warming, pouring
              — is an act of intention in a world that too often moves without
              pause. Each stage carries meaning: the boiling of water mirrors a
              moment of focus; the steeping, a lesson in patience; the first
              sip, a reward for presence.
            </p>
            <p>
              At Swadistchai, we believe that the finest teas demand the finest
              attention. Whether you are a seasoned tea aficionado or at the
              beginning of your journey, we invite you to slow down, brew
              mindfully, and discover what each leaf has to offer.
            </p>
            <p>
              Our collection is curated with care — each variety chosen not just
              for flavour, but for story, sustainability, and the commitment of
              the farmers who tend them. Every cup is a conversation across
              continents and centuries, a thread connecting you to the land and
              the people who steward it.
            </p>
          </div>

          {/* Pull quote */}
          <blockquote className="my-10 pl-5 border-l-4 border-primary/50">
            <p className="font-display text-lg md:text-xl italic text-foreground/80 leading-relaxed">
              "Tea is the beverage that asks us to stop — and in that stopping,
              to find something essential."
            </p>
          </blockquote>

          <div className="space-y-6 text-foreground/75 text-[1.0625rem] leading-[1.85]">
            <p>
              We hope this article deepens your appreciation for the remarkable
              world in your teacup. Each pour is a small ceremony — a quiet
              luxury available to anyone willing to embrace it.
            </p>
          </div>
        </motion.article>

        {/* Tags / category */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex items-center gap-3 flex-wrap"
        >
          <span className="text-xs text-muted-foreground font-medium">
            Filed under:
          </span>
          <CategoryBadge category={post.category} />
        </motion.div>

        {/* Shop CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{
            y: -4,
            boxShadow: "0 20px 40px oklch(0.42 0.16 160 / 0.12)",
          }}
          transition={{ duration: 0.4 }}
          className="mt-12 p-7 bg-card rounded-2xl border border-border shadow-card text-center"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Leaf size={18} className="text-primary" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Ready to explore?
          </h3>
          <p className="text-muted-foreground text-sm mb-5 max-w-xs mx-auto leading-relaxed">
            Discover the teas featured in our stories — thoughtfully sourced,
            impeccably crafted.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-smooth shadow-tea"
            data-ocid="blog-post-shop-cta"
          >
            Shop All Teas <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Related Posts */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mt-14 pt-10 border-t border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Further Reading
              </h2>
              <Link
                to="/blog"
                className="text-xs text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-smooth"
                data-ocid="blog-all-link"
              >
                All stories <ArrowRight size={11} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {related.map((p, i) => (
                <RelatedCard key={p.id} post={p} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
