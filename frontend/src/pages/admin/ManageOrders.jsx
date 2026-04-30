import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Clock,
  DollarSign,
  Edit2,
  Eye,
  Filter,
  MapPin,
  Package,
  RefreshCw,
  Search,
  Trash2,
  Truck,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import SectionContainer from "../../components/SectionContainer";
import { useAuth } from "../../context/AuthContext";

export default function ManageOrders() {
  const { user, token, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate({ to: "/login" });
    }
  }, [isAdmin, authLoading, navigate]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const url =
          statusFilter === "all"
            ? "https://tealeafluxe.onrender.com/api/orders"
            : `https://tealeafluxe.onrender.com/api/orders?status=${statusFilter}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError("Failed to load orders");
        }
      } catch (err) {
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token, statusFilter]);

  // Filter orders by search term
  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      const response = await fetch(
        `https://tealeafluxe.onrender.com/api/orders/${selectedOrder._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const data = await response.json();
      if (data.success) {
        setOrders(
          orders.map((o) =>
            o._id === selectedOrder._id ? { ...o, status: newStatus } : o,
          ),
        );
        setShowModal(false);
        setSelectedOrder(null);
      } else {
        setError("Failed to update status");
      }
    } catch (err) {
      setError("Error updating order status");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://tealeafluxe.onrender.com/api/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setOrders(orders.filter((o) => o._id !== orderId));
      } else {
        setError("Failed to delete order");
      }
    } catch (err) {
      setError("Error deleting order");
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
          <p className="text-gray-600 mt-2">View and manage customer orders</p>
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrders.map((order, idx) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-mono text-sm text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.user?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatCurrency(order.orderTotal)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            statusColors[order.status]
                          }`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDetailsModal(true);
                            }}
                            className="text-gray-600 hover:text-gray-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setNewStatus(order.status);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit Status"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Status Update Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Update Order Status
              </h2>
              <p className="text-gray-600 mb-4">
                Order:{" "}
                <span className="font-mono font-semibold">
                  {selectedOrder?.orderNumber}
                </span>
              </p>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mb-6"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedOrder(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Update Status
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Order Details Modal */}
        {showDetailsModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6 border-b pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Order Details
                    </h2>
                    <p className="text-gray-600 font-mono mt-1">
                      {selectedOrder.orderNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedOrder(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Customer Details */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/60 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 pb-2 border-b border-gray-200">
                      <Users className="w-4 h-4 text-amber-600" />
                      Customer Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span className="text-gray-500">Name:</span>{" "}
                        <span className="font-medium">
                          {selectedOrder.user?.name}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Email:</span>{" "}
                        <span className="font-medium">
                          {selectedOrder.user?.email}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/60 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 pb-2 border-b border-gray-200">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      Shipping Address
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span className="text-gray-500">Name:</span>{" "}
                        <span className="font-medium">
                          {selectedOrder.shippingAddress?.name || "N/A"}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Phone:</span>{" "}
                        <span className="font-medium">
                          {selectedOrder.shippingAddress?.phone || "N/A"}
                        </span>
                      </p>
                      <div className="mt-2 pt-2 border-t border-gray-200/50">
                        <p className="text-gray-600 leading-relaxed">
                          {selectedOrder.shippingAddress?.address}
                        </p>
                        <p className="text-gray-600">
                          {selectedOrder.shippingAddress?.city},{" "}
                          {selectedOrder.shippingAddress?.state}{" "}
                          {selectedOrder.shippingAddress?.pincode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/60 shadow-sm md:col-span-2">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 pb-2 border-b border-gray-200">
                      <DollarSign className="w-4 h-4 text-amber-600" />
                      Payment Information
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Method</p>
                        <p className="font-medium uppercase">
                          {selectedOrder.paymentMethod}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Status</p>
                        <p className="font-medium capitalize">
                          {selectedOrder.paymentStatus}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Total Amount</p>
                        <p className="font-bold text-amber-600 text-base">
                          {formatCurrency(selectedOrder.orderTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-600" />
                    Order Items
                  </h3>
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-gray-700 font-semibold">
                            Product
                          </th>
                          <th className="px-4 py-3 text-center text-gray-700 font-semibold">
                            Qty
                          </th>
                          <th className="px-4 py-3 text-right text-gray-700 font-semibold">
                            Price
                          </th>
                          <th className="px-4 py-3 text-right text-gray-700 font-semibold">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedOrder.items?.map((item, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-gray-900 font-medium">
                              {item.product?.name || "Unknown Product"}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-600 bg-gray-50/50">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-600">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-900 font-semibold bg-gray-50/50">
                              {formatCurrency(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedOrder(null);
                    }}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition shadow-sm"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
