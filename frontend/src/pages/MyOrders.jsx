import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Package, SearchX } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import SectionContainer from "../components/SectionContainer";
import { useAuth } from "../context/AuthContext";

export default function MyOrders() {
  const { token, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const response = await fetch(
          "https://tealeafluxe.onrender.com/api/orders/user/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const response = await fetch(
        `https://tealeafluxe.onrender.com/api/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setOrders(
          orders.map((o) =>
            o._id === orderId ? { ...o, status: "cancelled" } : o,
          ),
        );
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (err) {
      alert("Error connecting to server to cancel order");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600";
      case "processing":
        return "bg-blue-500/10 text-blue-600";
      case "shipped":
        return "bg-purple-500/10 text-purple-600";
      case "delivered":
        return "bg-green-500/10 text-green-600";
      case "cancelled":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-muted text-foreground";
    }
  };

  if (authLoading) return null;

  return (
    <div className="pt-20 lg:pt-28 min-h-screen bg-background pb-16">
      <SectionContainer>
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Profile
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Package className="text-primary w-8 h-8" />
          <h1 className="font-display text-3xl font-semibold text-foreground">
            My Orders
          </h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-primary">
            <Loader2 className="animate-spin w-10 h-10 mb-4" />
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-xl">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-card">
            <SearchX className="mx-auto w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-display text-xl font-medium text-foreground mb-2">
              No orders found
            </h3>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't placed any orders yet.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-smooth"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-card"
              >
                {/* Order Header */}
                <div className="bg-muted/30 px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="grid grid-cols-2 sm:flex sm:gap-8 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-0.5">
                        Order Placed
                      </p>
                      <p className="font-medium text-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-0.5">Total</p>
                      <p className="font-medium text-foreground">
                        ₹{order.orderTotal.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-muted-foreground mb-0.5">Order ID</p>
                      <p className="font-medium text-foreground font-mono text-xs mt-1">
                        {order._id}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="ml-4 text-xs font-semibold text-red-600 hover:text-red-700 underline underline-offset-2 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0">
                          {item.product?.image ? (
                            <img
                              src={
                                item.product.image.startsWith("/uploads")
                                  ? `https://tealeafluxe.onrender.com${item.product.image}`
                                  : item.product.image
                              }
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-secondary/50 text-xs text-muted-foreground">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">
                            {item.product?.name || "Product unavailable"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">
                            ₹{item.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </SectionContainer>
    </div>
  );
}
