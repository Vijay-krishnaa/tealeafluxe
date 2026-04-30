import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { authenticateToken } from "./auth.js";

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Admin access required" });
  }
  next();
};

// Get overall dashboard stats (Admin only)
router.get("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    // Get counts
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "user" });
    const totalProducts = await Product.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // Get order stats
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$orderTotal" },
          averageOrderValue: { $avg: "$orderTotal" },
          totalItems: {
            $sum: { $size: "$items" },
          },
        },
      },
    ]);

    const stats = orderStats[0] || {
      totalRevenue: 0,
      averageOrderValue: 0,
      totalItems: 0,
    };

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.subtotal" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get monthly revenue
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$orderTotal" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    // Get payment method breakdown
    const paymentMethods = await Order.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          amount: { $sum: "$orderTotal" },
        },
      },
    ]);

    res.json({
      success: true,
      dashboard: {
        summary: {
          totalOrders,
          totalCustomers,
          totalProducts,
          totalAdmins,
          totalRevenue: stats.totalRevenue,
          averageOrderValue: stats.averageOrderValue,
          totalItems: stats.totalItems,
        },
        ordersByStatus,
        topProducts,
        recentOrders,
        monthlyRevenue,
        paymentMethods,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching dashboard stats",
    });
  }
});

// Get detailed sales report (Admin only)
router.get("/reports/sales", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const salesData = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          revenue: { $sum: "$orderTotal" },
          tax: { $sum: "$taxAmount" },
          shipping: { $sum: "$shippingCost" },
          discount: { $sum: "$discountAmount" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          revenue: 1,
          tax: 1,
          shipping: 1,
          discount: 1,
          orderCount: 1,
          netRevenue: {
            $subtract: [
              { $add: ["$revenue", "$shipping"] },
              { $add: ["$tax", "$discount"] },
            ],
          },
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.json({
      success: true,
      salesReport: salesData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error generating sales report",
    });
  }
});

// Get customer analytics (Admin only)
router.get("/analytics/customers", authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: "user" });

    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
    const newCustomers = await User.countDocuments({
      role: "user",
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Customers by order count
    const customersByOrders = await User.aggregate([
      { $match: { role: "user" } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$totalOrders", 0] },
              "no-orders",
              {
                $cond: [
                  { $lt: ["$totalOrders", 5] },
                  "1-4-orders",
                  {
                    $cond: [
                      { $lt: ["$totalOrders", 10] },
                      "5-9-orders",
                      "10+orders",
                    ],
                  },
                ],
              },
            ],
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Top customers by spend
    const topCustomers = await User.find({ role: "user" })
      .sort({ totalSpent: -1 })
      .limit(10)
      .select("name email totalSpent totalOrders createdAt");

    res.json({
      success: true,
      customerAnalytics: {
        totalCustomers,
        newCustomersThisMonth: newCustomers,
        customersByOrders,
        topCustomers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching customer analytics",
    });
  }
});

export default router;
