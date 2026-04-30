import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, Loader2, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import SectionContainer from "../components/SectionContainer";
import { toast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    latitude: "",
    longitude: "",
  });

  const FREE_SHIPPING_THRESHOLD = 4000;
  const SHIPPING_COST = 199;
  const shipping = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const orderTotal = cartTotal + shipping;

  const fetchPincodeDetails = async (pincode) => {
    setPinLoading(true);
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await response.json();

      if (data && data[0] && data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          city: postOffice.District,
          state: postOffice.State,
        }));
        toast({ message: "City and State auto-filled!", type: "success" });
      } else {
        toast({ message: "Invalid PIN Code.", type: "error" });
      }
    } catch (err) {
      console.error("Error fetching pincode details:", err);
    } finally {
      setPinLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "zipCode" && value.length === 6 && /^\d+$/.test(value)) {
      fetchPincodeDetails(value);
    }
  };

  const captureLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: prev.address
              ? prev.address
              : `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`,
          }));
          setLocationLoading(false);
          toast({
            message: "Exact location captured successfully!",
            type: "success",
          });
        },
        (error) => {
          setLocationLoading(false);
          toast({
            message: "Failed to get location. Please allow location access.",
            type: "error",
          });
        },
      );
    } else {
      setLocationLoading(false);
      toast({
        message: "Geolocation is not supported by your browser.",
        type: "error",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast({ message: "Please log in to place an order", type: "error" });
      navigate({ to: "/login" });
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item._id || item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          address:
            formData.latitude && formData.longitude
              ? `${formData.address} (Lat: ${formData.latitude}, Lng: ${formData.longitude})`
              : formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.zipCode,
          phone: formData.phone,
        },
        paymentMethod: "cod",
      };

      const response = await fetch(
        "https://tealeafluxe.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderPayload),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setOrderPlaced(true);
        clearCart();
        toast({ message: "Order placed successfully!", type: "success" });
      } else {
        toast({
          message: data.message || "Failed to place order",
          type: "error",
        });
      }
    } catch (err) {
      toast({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="pt-20 lg:pt-28 min-h-[70vh] bg-background flex items-center justify-center">
        <SectionContainer className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <CheckCircle className="text-primary w-20 h-20" />
            <h1 className="font-display text-3xl font-semibold text-foreground">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. We've received your order and exact
              location details for accurate delivery.
            </p>
            <Link
              to="/shop"
              className="mt-6 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-smooth"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </SectionContainer>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="pt-20 lg:pt-28 min-h-[70vh] bg-background flex flex-col items-center justify-center">
        <p className="text-lg text-muted-foreground mb-4">
          Your cart is empty.
        </p>
        <Link to="/shop" className="text-primary hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-background">
      <SectionContainer className="py-10">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors-smooth"
        >
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-card">
              <h2 className="font-display text-xl font-semibold mb-6">
                Shipping Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      First Name *
                    </label>
                    <input
                      required
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Last Name *
                    </label>
                    <input
                      required
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium">
                      Street Address *
                    </label>
                    <button
                      type="button"
                      onClick={captureLocation}
                      className="text-xs font-semibold text-primary flex items-center gap-1 hover:text-primary/80 transition-colors"
                    >
                      {locationLoading ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <MapPin size={12} />
                      )}
                      Capture Exact Location
                    </button>
                  </div>
                  <input
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all mb-2"
                    placeholder="House number and street name"
                  />

                  {formData.latitude && formData.longitude && (
                    <div className="text-xs text-green-600 bg-green-500/10 px-3 py-2 rounded-lg flex items-center gap-2">
                      <MapPin size={14} /> Location Captured:{" "}
                      {formData.latitude}, {formData.longitude}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium mb-1.5">
                      City *
                    </label>
                    <input
                      required
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      State *
                    </label>
                    <input
                      required
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      PIN Code *
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        maxLength="6"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all pr-10"
                      />
                      {pinLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
                          <Loader2 size={16} className="animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="font-display text-lg font-semibold mb-4">
                    Payment Method
                  </h3>
                  <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-center gap-3">
                    <input
                      type="radio"
                      checked
                      readOnly
                      className="text-primary w-4 h-4"
                    />
                    <span className="font-medium text-foreground">
                      Cash on Delivery (COD)
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-smooth shadow-tea flex justify-center items-center gap-2 mt-8"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Place Order"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-muted/30 rounded-2xl p-6 sm:p-8 sticky top-28 border border-border">
              <h2 className="font-display text-xl font-semibold mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-card border border-border overflow-hidden shrink-0 relative">
                      <img
                        src={
                          item.image.startsWith("/uploads")
                            ? `https://tealeafluxe.onrender.com${item.image}`
                            : item.image
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-foreground line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                    <div className="font-semibold text-sm">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-border text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0
                      ? "Free"
                      : `₹${shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg text-foreground pt-3 border-t border-border">
                  <span>Total</span>
                  <span>₹{orderTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
