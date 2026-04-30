import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronRight,
  Leaf,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import ProductCard, { StarRating } from "../components/ProductCard";
import { useCart } from "../context/CartContext";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&q=80&auto=format&fit=crop";

const TABS = ["Description", "Benefits", "Reviews"];

// Helper to construct full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return FALLBACK_IMAGE;
  if (imagePath.startsWith("http")) return imagePath; // Already full URL
  if (imagePath.startsWith("/uploads/")) {
    return `https://tealeafluxe.onrender.com${imagePath}`; // Prepend backend URL
  }
  return imagePath; // Keep as is for static data
};

export default function ProductDetail() {
  const { id } = useParams({ strict: false });
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState("Description");
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const product = products.find((p) => (p._id || p.id) === id);
  const related = products
    .filter((p) => (p._id || p.id) !== id && p.category === product?.category)
    .slice(0, 4);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-4xl mb-4 animate-pulse">🍃</div>
          <p className="text-muted-foreground">Loading product...</p>
        </motion.div>
      </div>
    );
  }

  /* ── 404 ── */
  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🍃</div>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
            Tea Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            This tea seems to have steeped away. Try browsing our full
            collection.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-smooth"
            data-ocid="not-found-shop-link"
          >
            <ShoppingBag size={16} />
            Browse All Teas
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ── Handlers ── */
  const handleAddToCart = () => {
    if (addedSuccess) {
      // If already added, navigate to cart
      navigate({ to: "/cart" });
    } else {
      // Add to cart
      addToCart(product, quantity);
      setAddedSuccess(true);
      // Don't auto-reset - keep showing "Go to Cart"
    }
  };

  return (
    <div className="pt-16 lg:pt-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb ── */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 py-6 text-xs text-muted-foreground"
          data-ocid="breadcrumb"
        >
          <Link to="/" className="hover:text-primary transition-colors-smooth">
            Home
          </Link>
          <ChevronRight size={12} className="shrink-0" />
          <Link
            to="/shop"
            className="hover:text-primary transition-colors-smooth"
          >
            Shop
          </Link>
          <ChevronRight size={12} className="shrink-0" />
          <span className="text-foreground font-medium truncate max-w-[160px]">
            {product.name}
          </span>
        </nav>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 pb-16">
          {/* ──── Left: Image Gallery ──── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-secondary/30 aspect-square shadow-tea">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeThumb}
                  src={getImageUrl(
                    product.images && product.images[activeThumb]
                      ? product.images[activeThumb].url
                      : product.image,
                  )}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  data-ocid="product-main-image"
                  onError={(e) => {
                    e.target.src = FALLBACK_IMAGE;
                    e.target.onerror = null;
                  }}
                />
              </AnimatePresence>
              {product.featured && (
                <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                  Featured
                </span>
              )}
              {/* In-stock badge */}
              <span className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-card/90 backdrop-blur-sm border border-border text-[11px] font-semibold text-primary px-3 py-1.5 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                In Stock
              </span>
            </div>

            {/* Thumbnails - Show actual uploaded images (only if 2+ images) */}
            {product.images && product.images.length > 1 && (
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(auto-fit, minmax(80px, 1fr))`,
                  maxWidth: "100%",
                }}
              >
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveThumb(idx)}
                    aria-label={`View image ${idx + 1}`}
                    data-ocid={`thumb-${idx}`}
                    className={[
                      "rounded-xl overflow-hidden aspect-square border-2 transition-smooth cursor-pointer",
                      activeThumb === idx
                        ? "border-primary shadow-tea"
                        : "border-border hover:border-primary/50",
                    ].join(" ")}
                  >
                    <img
                      src={getImageUrl(img.url)}
                      alt={img.alt || `${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = FALLBACK_IMAGE;
                        e.target.onerror = null;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ──── Right: Product Info ──── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col gap-6"
          >
            {/* Category + Name */}
            <div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-accent mb-2">
                {product.category}
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <StarRating
                  rating={product.rating || 0}
                  count={product.reviewCount || 0}
                />
                <span className="text-xs text-muted-foreground">
                  {product.reviewCount || 0} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-semibold text-foreground">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-muted-foreground font-body">
                / 50g
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Tabs */}
            <div>
              <div
                className="flex gap-1 bg-muted/40 rounded-xl p-1"
                role="tablist"
                data-ocid="product-tabs"
              >
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className={[
                      "flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-smooth",
                      activeTab === tab
                        ? "bg-card text-foreground shadow-card"
                        : "text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                    data-ocid={`tab-${tab.toLowerCase()}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="mt-4 min-h-[120px]">
                <AnimatePresence mode="wait">
                  {activeTab === "Description" && (
                    <motion.div
                      key="desc"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="text-muted-foreground text-base leading-relaxed">
                        {product.description}
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {[
                          {
                            icon: <Truck size={14} />,
                            label: "Free shipping over ₹4,150",
                          },
                          {
                            icon: <Package size={14} />,
                            label: "Sealed for peak freshness",
                          },
                          {
                            icon: <Leaf size={14} />,
                            label: "Sustainably sourced",
                          },
                          {
                            icon: <CheckCircle size={14} />,
                            label: "Quality guaranteed",
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                          >
                            <span className="text-primary">{item.icon}</span>
                            {item.label}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "Benefits" && (
                    <motion.div
                      key="benefits"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h3 className="font-display font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                        <Leaf size={14} className="text-primary" />
                        Health Benefits
                      </h3>
                      <ul className="space-y-3">
                        {(product.healthBenefits || []).map((benefit) => (
                          <li
                            key={benefit}
                            className="flex items-start gap-3 text-sm text-muted-foreground"
                          >
                            <CheckCircle
                              size={15}
                              className="text-primary shrink-0 mt-0.5"
                            />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {activeTab === "Reviews" && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      {!product.reviews || product.reviews.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground text-sm">
                          No reviews yet — be the first to review this tea.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {(product.reviews || []).map((r) => (
                            <div
                              key={r.id}
                              className="bg-muted/30 rounded-xl p-4 border border-border"
                              data-ocid={`inline-review-${r.id}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-sm text-foreground">
                                  {r.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {r.date}
                                </span>
                              </div>
                              <StarRating rating={r.rating} />
                              <p className="text-sm text-muted-foreground mt-2 leading-relaxed italic">
                                "{r.comment}"
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3">
              {/* Quantity selector */}
              <fieldset
                className="flex items-center rounded-xl border border-border overflow-hidden bg-card"
                aria-label="Quantity"
              >
                <legend className="sr-only">Select quantity</legend>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                  aria-label="Decrease quantity"
                  data-ocid="qty-decrease"
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span
                  className="w-12 text-center text-sm font-bold text-foreground select-none"
                  aria-live="polite"
                  aria-label={`Quantity: ${quantity}`}
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                  aria-label="Increase quantity"
                  data-ocid="qty-increase"
                >
                  <Plus size={14} />
                </button>
              </fieldset>

              {/* Add to Cart */}
              <motion.button
                type="button"
                onClick={handleAddToCart}
                whileTap={{ scale: 0.97 }}
                className={[
                  "flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-smooth",
                  addedSuccess
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-tea cursor-pointer"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-tea",
                ].join(" ")}
                data-ocid="add-to-cart-detail"
              >
                <AnimatePresence mode="wait">
                  {addedSuccess ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingBag size={16} />
                      Go to Cart
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingBag size={16} />
                      Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Trust signals */}
            <p className="text-xs text-muted-foreground text-center">
              Free shipping on orders over ₹4,150 · Sealed for peak freshness
            </p>
          </motion.div>
        </div>

        {/* ── Full-width Reviews section ── */}
        {product.reviews && product.reviews.length > 0 && (
          <section className="py-14 border-t border-border">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="font-display text-2xl font-semibold text-foreground mb-8"
            >
              Customer Reviews
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {product.reviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-card rounded-xl p-5 border border-border shadow-card"
                  data-ocid={`review-${r.id}`}
                >
                  {/* Avatar + Name */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground shrink-0">
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground leading-none">
                          {r.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Verified Purchase
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {r.date}
                    </span>
                  </div>
                  <StarRating rating={r.rating} />
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed italic">
                    "{r.comment}"
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section className="py-14 border-t border-border">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="flex items-center justify-between mb-8"
            >
              <h2 className="font-display text-2xl font-semibold text-foreground">
                You May Also Enjoy
              </h2>
              <Link
                to="/shop"
                className="text-sm text-primary font-semibold hover:underline transition-colors-smooth"
                data-ocid="related-view-all"
              >
                View all →
              </Link>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
              {related.map((p, i) => (
                <ProductCard key={p._id || p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
