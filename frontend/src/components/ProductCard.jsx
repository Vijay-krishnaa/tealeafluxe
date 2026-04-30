import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&q=80&auto=format&fit=crop";

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={11}
            className={
              s <= Math.round(rating)
                ? "text-accent fill-accent"
                : "text-border fill-none"
            }
          />
        ))}
      </div>
      {count != null && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Support both local products (id) and MongoDB products (_id)
  const productId = product._id || product.id;

  // Helper to construct full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return FALLBACK_IMAGE;
    if (imagePath.startsWith("http")) return imagePath; // Already full URL
    if (imagePath.startsWith("/uploads/")) {
      return `https://tealeafluxe.onrender.com${imagePath}`; // Prepend backend URL
    }
    return imagePath; // Keep as is for static data
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group bg-card rounded-xl overflow-hidden border border-border shadow-card hover:shadow-tea hover:border-primary/25 transition-smooth flex flex-col"
      data-ocid={`product-card-${productId}`}
    >
      <Link
        to="/shop/$id"
        params={{ id: String(productId) }}
        className="block relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image container with fixed aspect ratio */}
        <div className="relative aspect-square bg-secondary/40 overflow-hidden">
          {/* Primary image */}
          <motion.img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ opacity: isHovered ? 0 : 1 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            onError={(e) => {
              e.target.src = FALLBACK_IMAGE;
              e.target.onerror = null;
            }}
          />

          {/* Hover / secondary image — tea leaves by category */}
          <motion.img
            src={getImageUrl(product.hoverImage || product.image)}
            alt={`${product.name} — tea leaves close-up`}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1.06 : 1,
            }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            onError={(e) => {
              e.target.src = FALLBACK_IMAGE;
              e.target.onerror = null;
            }}
          />

          {/* Hover label badge */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22 }}
                className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-foreground/70 text-card text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm"
              >
                <span>🍃</span>
                <span>Leaves View</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hover shine overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/8 to-transparent pointer-events-none"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.35 }}
          />
        </div>

        {product.featured && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
            Featured
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <Link
          to="/shop/$id"
          params={{ id: String(productId) }}
          className="group/title"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {product.category}
          </span>
          <h3 className="font-display font-semibold text-base text-foreground group-hover/title:text-primary transition-colors-smooth mt-0.5 leading-snug">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="flex items-center justify-between mt-1 pt-3 border-t border-border">
          <span className="font-display text-lg font-semibold text-foreground">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <button
            type="button"
            onClick={() => {
              if (isAdded) {
                // Navigate to cart
                navigate({ to: "/cart" });
              } else {
                // Add to cart
                addToCart(product);
                setIsAdded(true);
                // Reset after 3 seconds
                setTimeout(() => setIsAdded(false), 3000);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 active:scale-95 transition-smooth"
            aria-label={isAdded ? "Go to cart" : `Add ${product.name} to cart`}
            data-ocid={`add-to-cart-${product.id}`}
          >
            <ShoppingBag size={13} />
            {isAdded ? "Go to Cart" : "Add"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export { StarRating };
