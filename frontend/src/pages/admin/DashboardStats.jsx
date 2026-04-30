import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BarChart3,
  DollarSign,
  Package,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import SectionContainer from "../../components/SectionContainer";
import { useAuth } from "../../context/AuthContext";

const StatCard = ({ icon: Icon, label, value, trend, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
          {trend && (
            <p
              className={`text-sm mt-2 ${trend > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
    </motion.div>
  );
};

export default function DashboardStats() {
  const { user, token, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate({ to: "/login" });
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://tealeafluxe.onrender.com/api/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();
        if (data.success) {
          setStats(data.dashboard);
        } else {
          setError("Failed to load dashboard stats");
        }
      } catch (err) {
        setError("Error fetching stats");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { summary, ordersByStatus, topProducts, recentOrders, monthlyRevenue } =
    stats;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={ShoppingCart}
            label="Total Orders"
            value={summary?.totalOrders || 0}
            color="border-blue-500"
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={formatCurrency(summary?.totalRevenue || 0)}
            color="border-green-500"
          />
          <StatCard
            icon={Users}
            label="Total Customers"
            value={summary?.totalCustomers || 0}
            color="border-purple-500"
          />
          <StatCard
            icon={Package}
            label="Total Products"
            value={summary?.totalProducts || 0}
            color="border-amber-500"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={TrendingUp}
            label="Average Order Value"
            value={formatCurrency(summary?.averageOrderValue || 0)}
            color="border-indigo-500"
          />
          <StatCard
            icon={BarChart3}
            label="Total Items Sold"
            value={summary?.totalItems || 0}
            color="border-cyan-500"
          />
          <StatCard
            icon={ShoppingCart}
            label="Admins"
            value={summary?.totalAdmins || 0}
            color="border-red-500"
          />
        </div>

        {/* Orders by Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Orders by Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {ordersByStatus?.map((status) => (
              <div
                key={status._id}
                className="bg-gray-50 p-4 rounded-lg text-center"
              >
                <p className="text-gray-600 text-sm capitalize">{status._id}</p>
                <p className="text-2xl font-bold text-amber-600">
                  {status.count}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Top Selling Products
          </h2>
          <div className="space-y-4">
            {topProducts?.slice(0, 5).map((item, idx) => (
              <div
                key={item._id}
                className="flex items-center justify-between pb-4 border-b last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-amber-600 w-8">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {item.product?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.totalSold} units sold
                    </p>
                  </div>
                </div>
                <p className="font-bold text-gray-900">
                  {formatCurrency(item.totalRevenue)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders?.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {order.user?.name}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {formatCurrency(order.orderTotal)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
