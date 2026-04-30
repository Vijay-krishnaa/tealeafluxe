import { useSearch } from "@tanstack/react-router";
import { Leaf, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import FilterSidebar, {
  PRICE_MAX,
  PRICE_MIN,
} from "../components/FilterSidebar";
import { EmptyState } from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";
import SectionContainer from "../components/SectionContainer";
import categories from "../data/categories";
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Popularity" },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [sort, setSort] = useState("featured");
  const [activeCategories, setActiveCategories] = useState([]);
  const [priceMin, setPriceMin] = useState(PRICE_MIN);
  const [priceMax, setPriceMax] = useState(PRICE_MAX);
  const searchParams = useSearch({ from: "/shop" });
  const searchQuery = (searchParams?.q || "").toLowerCase();

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
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleToggleCategory = useCallback((catId) => {
    if (catId === "all") {
      setActiveCategories([]);
      return;
    }
    setActiveCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId],
    );
  }, []);

  const handlePriceChange = useCallback((min, max) => {
    setPriceMin(min);
    setPriceMax(max);
  }, []);

  const handleClearAll = useCallback(() => {
    setActiveCategories([]);
    setPriceMin(PRICE_MIN);
    setPriceMax(PRICE_MAX);
  }, []);

  const hasActiveFilters =
    activeCategories.length > 0 || priceMin > PRICE_MIN || priceMax < PRICE_MAX;

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery) ||
          p.description?.toLowerCase().includes(searchQuery) ||
          p.category?.toLowerCase().includes(searchQuery),
      );
    }

    if (activeCategories.length > 0) {
      result = result.filter((p) => {
        if (!p.category) return false;
        const productCatId = p.category.toLowerCase().replace(/\s+/g, "-");
        return activeCategories.includes(productCatId);
      });
    }

    // Price filter
    result = result.filter((p) => p.price >= priceMin && p.price <= priceMax);

    // Sorting
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "rating")
      result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    else if (sort === "newest")
      result.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    else result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return result;
  }, [products, activeCategories, priceMin, priceMax, sort, searchQuery]);

  const filterPills = useMemo(() => {
    const pills = [];
    for (const catId of activeCategories) {
      const cat = categories.find((c) => c.id === catId);
      if (cat)
        pills.push({
          key: `cat-${catId}`,
          label: cat.name,
          onRemove: () => handleToggleCategory(catId),
        });
    }
    if (priceMin > PRICE_MIN || priceMax < PRICE_MAX)
      pills.push({
        key: "price",
        label: `₹${priceMin.toLocaleString("en-IN")}–₹${priceMax.toLocaleString("en-IN")}`,
        onRemove: () => handlePriceChange(PRICE_MIN, PRICE_MAX),
      });
    return pills;
  }, [
    activeCategories,
    priceMin,
    priceMax,
    handleToggleCategory,
    handlePriceChange,
  ]);

  const sidebarProps = {
    products,
    activeCategories,
    onToggleCategory: handleToggleCategory,
    priceMin,
    priceMax,
    onPriceChange: handlePriceChange,
    onClearAll: handleClearAll,
    hasActiveFilters,
  };

  return (
    <div className="pt-16 lg:pt-20">
      {/* Page Hero — Tea Atelier with cinematic background */}
      <div className="relative overflow-hidden border-b border-border py-16 md:py-20 min-h-[280px] flex items-center">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=1920&h=800&q=80&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1920&h=800&q=80&auto=format&fit=crop";
            e.target.onerror = null;
          }}
        />
        {/* Semi-transparent dark overlay */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Subtle gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-4"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-accent bg-accent/15 border border-accent/25 px-3 py-1 rounded-full backdrop-blur-sm">
                {searchQuery ? "Search Results" : "Our Collection"}
              </span>
              <h1
                className="font-display text-4xl md:text-5xl font-semibold text-white mt-3 leading-tight"
                style={{ textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}
              >
                {searchQuery ? `Search: "${searchQuery}"` : "The Tea Atelier"}
              </h1>
              <p className="text-white/70 text-sm mt-2">
                {searchQuery
                  ? `Found ${filtered.length} result${filtered.length !== 1 ? "s" : ""}`
                  : `${filtered.length} of ${products.length} varieties · sourced from India's finest gardens`}
              </p>
            </div>
          </motion.div>

          {/* Active Filter Pills */}
          <AnimatePresence>
            {filterPills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-wrap gap-2 mt-4 overflow-hidden"
                data-ocid="filter-pills"
              >
                {filterPills.map((pill) => (
                  <motion.span
                    key={pill.key}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.18 }}
                    className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-medium"
                  >
                    {pill.label}
                    <button
                      type="button"
                      onClick={pill.onRemove}
                      aria-label={`Remove ${pill.label}`}
                      className="w-4 h-4 rounded-full hover:bg-white/20 flex items-center justify-center transition-smooth"
                    >
                      <X size={9} />
                    </button>
                  </motion.span>
                ))}
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-white/60 hover:text-white underline underline-offset-2 transition-colors-smooth"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <SectionContainer tight>
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar {...sidebarProps} onClose={() => {}} />
            </div>
          </aside>

          {/* Product Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-border">
              <button
                type="button"
                onClick={() => setShowDrawer(true)}
                className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground/70 hover:text-foreground hover:border-primary/30 transition-smooth"
                data-ocid="filter-toggle"
              >
                <SlidersHorizontal size={15} />
                Filters
                {hasActiveFilters && (
                  <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                    {filterPills.length}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  Sort by:
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm border border-border rounded-lg px-3 py-1.5 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                  data-ocid="sort-select"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Count */}
            <motion.p
              key={filtered.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground mb-5"
              data-ocid="product-count"
            >
              Showing{" "}
              <strong className="text-foreground">{filtered.length}</strong> of{" "}
              <strong className="text-foreground">{products.length}</strong>{" "}
              products
            </motion.p>

            {/* Grid / Empty State */}
            {filtered.length === 0 ? (
              <EmptyState
                icon={Leaf}
                title="No teas match your filters"
                description="Try adjusting your category or price range."
                action={
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-smooth active:scale-95"
                    data-ocid="clear-filters-empty"
                  >
                    Clear All Filters
                  </button>
                }
              />
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.07 } },
                }}
                data-ocid="product-grid"
              >
                {filtered.map((p, i) => (
                  <motion.div
                    key={p._id || p.id || i}
                    variants={{
                      hidden: { opacity: 0, y: 28 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.42,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        },
                      },
                    }}
                  >
                    <ProductCard product={p} index={i} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </SectionContainer>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 bg-foreground/25 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setShowDrawer(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 40 }}
              className="fixed left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-card border-r border-border z-50 md:hidden flex flex-col"
              data-ocid="filter-drawer"
            >
              <div className="flex-1 overflow-y-auto p-6">
                <FilterSidebar
                  {...sidebarProps}
                  onClose={() => setShowDrawer(false)}
                />
              </div>
              <div className="p-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowDrawer(false)}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-smooth active:scale-95"
                  data-ocid="apply-filters"
                >
                  View {filtered.length} Result
                  {filtered.length !== 1 ? "s" : ""}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
