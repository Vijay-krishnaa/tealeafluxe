import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import SectionContainer from "../components/SectionContainer";
import { useAuth } from "../context/AuthContext";

export default function Wishlist() {
  const { token } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchWishlist = async () => {
      try {
        const response = await fetch(
          "https://tealeafluxe.onrender.com/api/wishlist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        if (data.success) {
          setWishlistProducts(data.wishlist || []);
        }
      } catch (err) {
        setError("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
        <SectionContainer>
          <div className="text-center py-20">
            <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
            <h1 className="font-display text-3xl font-semibold text-foreground mb-4">
              Your Wishlist
            </h1>
            <p className="text-foreground/60 mb-8">
              Sign in to save your favorite teas
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-smooth"
            >
              Sign In
              <ArrowRight size={18} />
            </Link>
          </div>
        </SectionContainer>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <SectionContainer>
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Heart className="text-primary" size={28} />
              <h1 className="font-display text-4xl font-semibold text-foreground">
                Your Wishlist
              </h1>
            </div>
            <p className="text-foreground/60">
              {wishlistProducts.length === 0
                ? "Your wishlist is empty"
                : `${wishlistProducts.length} item${wishlistProducts.length !== 1 ? "s" : ""} saved`}
            </p>
          </motion.div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin">
              <Heart size={40} className="text-primary" />
            </div>
            <p className="text-foreground/60 mt-4">Loading your wishlist...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <Link to="/" className="text-primary hover:underline">
              Back to home
            </Link>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20"
          >
            <Heart
              size={64}
              className="mx-auto text-muted-foreground/30 mb-4"
            />
            <p className="text-foreground/60 mb-8 text-lg">
              No items in your wishlist yet
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-smooth"
            >
              Explore Teas
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {wishlistProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </SectionContainer>
    </div>
  );
}
