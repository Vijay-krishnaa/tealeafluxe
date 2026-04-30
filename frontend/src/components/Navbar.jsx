import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Heart,
  LogIn,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Journal" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

/* Premium Swadistchai — botanical leaf logo mark + elegant wordmark */
function TeaLeafLogo({ size = "md", onDark = false }) {
  const imgH = size === "lg" ? 48 : size === "sm" ? 34 : 40;
  const textClass =
    size === "lg"
      ? "text-xl tracking-tight"
      : size === "sm"
        ? "text-[14px] tracking-tight"
        : "text-[16px] tracking-tight";
  const subClass =
    size === "lg"
      ? "text-[8px] tracking-[0.32em]"
      : "text-[7px] tracking-[0.28em]";

  return (
    <span className="inline-flex items-center gap-2">
      {/* Botanical SVG leaf mark */}
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: imgH, width: imgH, flexShrink: 0 }}
      >
        <circle
          cx="20"
          cy="20"
          r="20"
          fill={onDark ? "rgba(201,168,76,0.18)" : "rgba(74,104,53,0.10)"}
        />
        <path
          d="M20 8 C20 8, 30 14, 30 22 C30 28, 25.5 33, 20 33 C14.5 33, 10 28, 10 22 C10 14, 20 8, 20 8Z"
          fill={onDark ? "#C9A84C" : "#4A6835"}
          opacity="0.85"
        />
        <path
          d="M20 8 L20 30"
          stroke={onDark ? "rgba(255,248,240,0.5)" : "rgba(255,255,255,0.6)"}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M20 16 C20 16, 26 18, 27 22"
          stroke={onDark ? "rgba(255,248,240,0.4)" : "rgba(255,255,255,0.5)"}
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <path
          d="M20 20 C20 20, 14 22, 13 26"
          stroke={onDark ? "rgba(255,248,240,0.4)" : "rgba(255,255,255,0.5)"}
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </svg>
      {/* Wordmark */}
      <span className="flex flex-col leading-none gap-0.5">
        <span
          className={`font-display font-semibold ${textClass}`}
          style={{ color: onDark ? "#f0ead8" : undefined }}
        >
          <span className={onDark ? "" : "text-foreground"}>Swadist</span>
          <span style={{ color: "#C9A84C" }}>chai</span>
        </span>
        <span
          className={`font-body font-medium uppercase ${subClass}`}
          style={{
            color: onDark
              ? "rgba(201,168,76,0.85)"
              : "var(--color-primary, #3d6b35)",
            letterSpacing: "0.28em",
          }}
        >
          Single Origin Teas
        </span>
      </span>
    </span>
  );
}

export { TeaLeafLogo };

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [showBanner, setShowBanner] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [products, setProducts] = useState([]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [offers, setOffers] = useState([]);

  const { cartCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const filteredProducts = searchQuery.trim()
    ? products
        .filter((p) =>
          p.name.toLowerCase().startsWith(searchQuery.toLowerCase()),
        )
        .slice(0, 5)
    : [];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://tealeafluxe.onrender.com/api/products",
        );
        const data = await response.json();
        if (data.success && data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products in navbar:", error);
      }
    };

    const fetchOffers = async () => {
      try {
        const response = await fetch(
          "https://tealeafluxe.onrender.com/api/banner-offers",
        );
        const data = await response.json();
        if (data.success && data.offers && data.offers.length > 0) {
          setOffers(data.offers);
        }
      } catch (error) {
        console.error("Failed to fetch banner offers:", error);
      }
    };

    fetchProducts();
    fetchOffers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({
        to: "/shop",
        search: { q: searchQuery },
      });
      setSearchQuery("");
      setShowSuggestions(false);
      setMobileSearchOpen(false);
    }
  };

  const handleProductClick = (product) => {
    navigate({
      to: "/product/$id",
      params: { id: product.id || product._id },
    });
    setSearchQuery("");
    setShowSuggestions(false);
    setMobileSearchOpen(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setShowUserMenu(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setShowBanner(true);
      } else if (currentScrollY > 100) {
        // Scrolling down and past the banner area
        setShowBanner(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (offers.length === 0) return;
    const interval = setInterval(() => {
      setCurrentOfferIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [offers.length]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Promotional Banner */}
      <AnimatePresence>
        {showBanner && offers.length > 0 && (
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-b border-primary/30 py-2 pointer-events-none"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AnimatePresence mode="wait">
                {offers[currentOfferIndex] && (
                  <motion.div
                    key={currentOfferIndex}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="text-center text-sm font-medium text-primary"
                  >
                    {offers[currentOfferIndex].text}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        data-ocid="navbar"
        className={`fixed left-0 right-0 z-40 bg-[#E4EBDD]/95 backdrop-blur-md shadow-card border-b border-[#D4DDD0] transition-all duration-300 pointer-events-auto ${
          showBanner && offers.length > 0 ? "top-[2.5rem]" : "top-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-8">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center group transition-smooth hover:opacity-90 flex-shrink-0"
              data-ocid="nav-logo"
            >
              <TeaLeafLogo size="sm" />
            </Link>

            {/* Desktop Nav */}
            <nav
              className="hidden md:flex items-center gap-8 flex-1"
              aria-label="Main navigation"
            >
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`text-sm font-body font-medium transition-colors-smooth hover:text-primary relative py-1 ${
                    pathname === to || (to !== "/" && pathname.startsWith(to))
                      ? "text-primary"
                      : "text-foreground/70"
                  }`}
                >
                  {label}
                  {(pathname === to ||
                    (to !== "/" && pathname.startsWith(to))) && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-5 flex-shrink-0">
              {/* Mobile Search Button */}
              <button
                type="button"
                className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full text-foreground/60 hover:text-primary hover:bg-primary/8 transition-smooth"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                aria-label="Toggle search"
              >
                <Search size={18} />
              </button>

              <div ref={searchRef} className="hidden sm:flex flex-col relative">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-2 border border-border/50 hover:border-border transition-smooth"
                >
                  <Search size={16} className="text-foreground/50" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => searchQuery && setShowSuggestions(true)}
                    className="bg-transparent text-sm font-body placeholder:text-foreground/40 outline-none w-32 text-foreground"
                  />
                </form>

                {/* Search Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && filteredProducts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
                    >
                      <div className="max-h-80 overflow-y-auto">
                        {filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/60 transition-smooth text-left border-b border-border/30 last:border-b-0"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-foreground/50">
                                ₹{product.price.toLocaleString("en-IN")}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Authentication Buttons / User Menu */}
              {user ? (
                <div className="flex items-center gap-2 pointer-events-auto relative z-40">
                  {/* User Profile Dropdown */}
                  <div ref={userMenuRef} className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-smooth pointer-events-auto cursor-pointer"
                      aria-label="User menu"
                      title="User menu"
                      type="button"
                    >
                      <User size={18} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-3 w-48 bg-card border border-border rounded-lg shadow-xl overflow-y-auto max-h-96"
                          style={{
                            maxHeight: "calc(100vh - 120px)",
                            zIndex: 99999,
                          }}
                        >
                          {/* Greeting Message with User Info */}
                          <div className="px-4 py-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 space-y-2">
                            <p className="font-display text-sm font-semibold text-primary">
                              Hello, {user.name}!
                            </p>
                            <p className="text-xs text-foreground/60">
                              Welcome back
                            </p>
                            <p className="text-xs text-foreground/70 pt-1 border-t border-primary/20">
                              {user.email}
                            </p>
                            {isAdmin && (
                              <span className="inline-block mt-2 px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                                Admin
                              </span>
                            )}
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <Link
                              to="/profile"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-2 px-4 py-2 hover:bg-muted/60 transition-smooth text-foreground/70 hover:text-primary text-sm border-b border-border/50"
                            >
                              <User size={16} />
                              My Profile
                            </Link>

                            {!isAdmin && (
                              <>
                                <Link
                                  to="/my-orders"
                                  onClick={() => setShowUserMenu(false)}
                                  className="flex items-center gap-2 px-4 py-2 hover:bg-muted/60 transition-smooth text-foreground/70 hover:text-primary text-sm border-b border-border/50"
                                >
                                  <Package size={16} />
                                  My Orders
                                </Link>
                                <Link
                                  to="/wishlist"
                                  onClick={() => setShowUserMenu(false)}
                                  className="flex items-center gap-2 px-4 py-2 hover:bg-muted/60 transition-smooth text-foreground/70 hover:text-red-500 text-sm border-b border-border/50"
                                >
                                  <Heart size={16} />
                                  Wishlist
                                </Link>
                              </>
                            )}

                            {isAdmin && (
                              <Link
                                to="/admin/dashboard"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-muted/60 transition-smooth text-foreground/70 hover:text-primary text-sm border-b border-border/50"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                  />
                                </svg>
                                Admin Panel
                              </Link>
                            )}

                            <button
                              onClick={() => {
                                logout();
                                navigate({ to: "/" });
                                setShowUserMenu(false);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 transition-smooth text-red-600 hover:text-red-700 text-sm"
                            >
                              <LogOut size={16} />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="w-9 h-9 flex items-center justify-center rounded-full text-foreground/60 hover:text-primary hover:bg-primary/10 transition-smooth"
                  aria-label="Login or Signup"
                  title="Login or Signup"
                >
                  <User size={18} />
                </Link>
              )}

              {/* Wishlist Icon - removed as it's now in user menu dropdown */}

              <Link
                to="/cart"
                className="relative w-9 h-9 flex items-center justify-center rounded-full text-foreground/60 hover:text-primary hover:bg-primary/8 transition-smooth"
                aria-label={`Cart, ${cartCount} items`}
                data-ocid="nav-cart"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] flex items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-semibold leading-none px-1 py-0.5"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </Link>
              <button
                type="button"
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-foreground/60 hover:text-primary hover:bg-primary/8 transition-smooth"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                data-ocid="nav-hamburger"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden border-t border-border bg-card overflow-hidden"
            >
              <div className="p-4">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 border border-border/50 focus-within:border-primary/50 transition-smooth"
                >
                  <Search size={16} className="text-foreground/50" />
                  <input
                    type="text"
                    placeholder="Search for teas..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    autoFocus
                    className="bg-transparent text-sm font-body placeholder:text-foreground/40 outline-none w-full text-foreground"
                  />
                </form>
                {/* Mobile Search Suggestions */}
                <AnimatePresence>
                  {showSuggestions && filteredProducts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto"
                    >
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id || product._id}
                          onClick={() => handleProductClick(product)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/60 transition-smooth text-left border-b border-border/30 last:border-b-0"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-foreground/50">
                              ₹{product.price.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
              onClick={closeMobile}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-card shadow-tea flex flex-col"
              data-ocid="mobile-drawer"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <TeaLeafLogo size="sm" />
                <button
                  type="button"
                  onClick={closeMobile}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-smooth"
                  aria-label="Close menu"
                  data-ocid="mobile-drawer-close"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-1 p-4 flex-1">
                {navLinks.map(({ to, label }, i) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={to}
                      onClick={closeMobile}
                      className={`flex px-4 py-3 rounded-lg text-base font-medium transition-smooth ${
                        pathname === to ||
                        (to !== "/" && pathname.startsWith(to))
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="px-4 py-3 rounded-lg bg-primary/10 text-foreground text-sm font-medium">
                      <User className="inline mr-2" size={16} />
                      {user.name}
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={closeMobile}
                        className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-primary/20 text-primary font-medium text-sm hover:bg-primary/30 transition-smooth"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                          />
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/my-orders"
                      onClick={closeMobile}
                      className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-smooth"
                    >
                      <Package size={16} />
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={closeMobile}
                      className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-red-500/10 text-red-600 font-medium text-sm hover:bg-red-500/20 transition-smooth"
                    >
                      <Heart size={16} />
                      Wishlist
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate({ to: "/" });
                        closeMobile();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-red-500/10 text-red-600 font-medium text-sm hover:bg-red-500/20 transition-smooth"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      onClick={closeMobile}
                      className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-smooth"
                      data-ocid="mobile-login-btn"
                    >
                      <LogIn size={16} />
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeMobile}
                      className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-lg border-2 border-primary text-primary font-medium text-sm hover:bg-primary/5 transition-smooth"
                      data-ocid="mobile-signup-btn"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
