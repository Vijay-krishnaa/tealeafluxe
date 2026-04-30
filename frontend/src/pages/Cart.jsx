import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "../components/Toast";
import { useCart } from "../context/CartContext";

const STAGGER = 0.07;
const FREE_SHIPPING_THRESHOLD = 4000;
const SHIPPING_COST = 199;

function CartItemRow({ item, index }) {
  const { updateQuantity, removeFromCart } = useCart();

  function handleRemove() {
    removeFromCart(item.id);
    toast({ message: `${item.name} removed from cart`, type: "info" });
  }

  return (
    <motion.div
      layout
      key={item.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40, scale: 0.96 }}
      whileHover={{ x: 4 }}
      transition={{
        duration: 0.32,
        delay: index * STAGGER,
        ease: "easeOut",
        x: { type: "spring", stiffness: 300, damping: 28 },
      }}
      className="group bg-card rounded-2xl border border-border shadow-card flex items-center gap-4 p-4 sm:p-5 hover:shadow-tea transition-shadow duration-300"
      data-ocid={`cart-item-${item.id}`}
    >
      {/* Product image */}
      <Link
        to="/shop/$id"
        params={{ id: String(item.id) }}
        className="shrink-0"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-secondary/40 ring-1 ring-border/60">
          <img
            src={
              item.image?.startsWith("/uploads")
                ? `https://tealeafluxe.onrender.com${item.image}`
                : item.image
            }
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <span className="block text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-0.5">
          {item.category}
        </span>
        <Link to="/shop/$id" params={{ id: String(item.id) }}>
          <h3 className="font-display font-semibold text-sm sm:text-base text-foreground truncate hover:text-primary transition-colors-smooth">
            {item.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-0.5">
          ₹{item.price.toLocaleString("en-IN")} / unit
        </p>
      </div>

      {/* Quantity controls */}
      <div
        className="flex items-center rounded-xl border border-border overflow-hidden shrink-0"
        aria-label={`Quantity for ${item.name}`}
      >
        <motion.button
          type="button"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          whileHover={{ backgroundColor: "oklch(0.88 0.04 50)" }}
          whileTap={{ scale: 0.9 }}
          className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth"
          aria-label="Decrease quantity"
          data-ocid={`cart-decrease-${item.id}`}
        >
          <Minus size={13} />
        </motion.button>
        <span
          className="w-10 text-center text-sm font-semibold text-foreground select-none"
          data-ocid={`cart-qty-${item.id}`}
        >
          {item.quantity}
        </span>
        <motion.button
          type="button"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          whileHover={{ backgroundColor: "oklch(0.88 0.04 50)" }}
          whileTap={{ scale: 0.9 }}
          className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth"
          aria-label="Increase quantity"
          data-ocid={`cart-increase-${item.id}`}
        >
          <Plus size={13} />
        </motion.button>
      </div>

      {/* Line total + remove */}
      <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
        <p className="font-semibold text-sm sm:text-base text-foreground">
          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
        </p>
        <motion.button
          type="button"
          onClick={handleRemove}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="text-muted-foreground hover:text-destructive transition-colors-smooth p-1 rounded-md hover:bg-destructive/10"
          aria-label={`Remove ${item.name}`}
          data-ocid={`cart-remove-${item.id}`}
        >
          <Trash2 size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}

function OrderSummary({ cartItems, cartTotal }) {
  const shipping = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const orderTotal = cartTotal + shipping;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;

  return (
    <motion.div
      whileHover={{ boxShadow: "0 24px 48px oklch(0.42 0.16 160 / 0.12)" }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl border border-border shadow-card p-6 sticky top-28"
      data-ocid="cart-summary"
    >
      <h2 className="font-display font-semibold text-lg text-foreground mb-5">
        Order Summary
      </h2>

      {/* Progress to free shipping */}
      {cartTotal < FREE_SHIPPING_THRESHOLD && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Package size={13} className="text-primary" />
            <span>
              Add{" "}
              <span className="font-semibold text-primary">
                ₹{amountToFreeShipping.toLocaleString("en-IN")}
              </span>{" "}
              more for free shipping
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}

      {cartTotal >= FREE_SHIPPING_THRESHOLD && (
        <div className="flex items-center gap-2 text-xs text-primary bg-primary/8 rounded-xl px-3 py-2 mb-5">
          <Sparkles size={13} />
          <span className="font-medium">You've unlocked free shipping!</span>
        </div>
      )}

      {/* Line items */}
      <div className="flex flex-col gap-3 text-sm mb-5">
        <div className="flex justify-between text-foreground/70">
          <span>
            Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
          </span>
          <span>₹{cartTotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-foreground/70">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-primary font-medium" : ""}>
            {shipping === 0
              ? "Free"
              : `₹${SHIPPING_COST.toLocaleString("en-IN")}`}
          </span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between font-semibold text-foreground text-base">
          <span>Total</span>
          <span>₹{orderTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* CTA */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          to="/checkout"
          className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-smooth shadow-tea"
          data-ocid="cart-checkout"
        >
          Proceed to Checkout
          <ArrowRight size={16} />
        </Link>
      </motion.div>

      <Link
        to="/shop"
        className="w-full flex items-center justify-center gap-2 mt-3 py-2.5 px-5 rounded-xl border border-border text-foreground/70 text-sm hover:bg-muted hover:text-foreground transition-smooth"
        data-ocid="cart-continue-shopping"
      >
        <ArrowLeft size={14} />
        Continue Shopping
      </Link>

      {/* Trust badges */}
      <div className="mt-5 pt-4 border-t border-border flex items-center justify-center gap-4">
        {["Secure Checkout", "Free Returns", "Quality Assured"].map((badge) => (
          <span
            key={badge}
            className="text-[10px] text-muted-foreground text-center leading-tight"
          >
            {badge}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-24 gap-6 text-center"
      data-ocid="cart-empty"
    >
      {/* Decorative icon */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-secondary/60 flex items-center justify-center">
          <ShoppingBag size={40} className="text-primary/60" />
        </div>
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <Leaf size={16} className="text-primary" />
        </motion.div>
      </div>

      <div className="max-w-xs">
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Discover our meticulously sourced, whole-leaf teas and find the
          perfect blend for your moments.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-smooth shadow-tea"
            data-ocid="cart-empty-cta"
          >
            Browse Teas
            <ArrowRight size={15} />
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border text-foreground/70 font-medium text-sm hover:bg-muted hover:text-foreground transition-smooth"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Try our best-selling{" "}
        <Link
          to="/shop"
          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors-smooth"
        >
          Imperial Jade Green
        </Link>{" "}
        or{" "}
        <Link
          to="/shop"
          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors-smooth"
        >
          Ceremonial Matcha
        </Link>
      </p>
    </motion.div>
  );
}

export default function Cart() {
  const { cartItems, cartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen bg-background">
        <div className="bg-card border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Link
                to="/"
                className="hover:text-foreground transition-colors-smooth"
              >
                Home
              </Link>
              <span>/</span>
              <span className="text-foreground">Cart</span>
            </nav>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">
              Your Cart
            </h1>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Link
              to="/"
              className="hover:text-foreground transition-colors-smooth"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              to="/shop"
              className="hover:text-foreground transition-colors-smooth"
            >
              Shop
            </Link>
            <span>/</span>
            <span className="text-foreground">Cart</span>
          </nav>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">
                Your Cart
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                in your cart
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                clearCart();
                toast({ message: "Cart cleared", type: "info" });
              }}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors-smooth flex items-center gap-1.5 pb-1"
              data-ocid="cart-clear"
            >
              <Trash2 size={13} />
              Clear all
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart items */}
          <div className="lg:col-span-2" data-ocid="cart-items">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, index) => (
                <div key={item.id} className="mb-4 last:mb-0">
                  <CartItemRow item={item} index={index} />
                </div>
              ))}
            </AnimatePresence>

            {/* Continue shopping link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: cartItems.length * STAGGER + 0.2 }}
              className="mt-6"
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors-smooth"
                data-ocid="cart-back-to-shop"
              >
                <ArrowLeft size={15} />
                Continue Shopping
              </Link>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />
          </motion.div>
        </div>
      </div>

      {/* Mobile sticky checkout bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border px-4 py-3 z-40">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-semibold text-foreground">
              ₹
              {(cartTotal >= FREE_SHIPPING_THRESHOLD
                ? cartTotal
                : cartTotal + SHIPPING_COST
              ).toLocaleString("en-IN")}
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/checkout"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-smooth shadow-tea"
              data-ocid="cart-checkout-mobile"
            >
              Checkout
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
