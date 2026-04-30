import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { authenticateToken } from "./auth.js";

import bcrypt from "bcryptjs";

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

// Get all customers (Admin only)
router.get("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { search, sort, role } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    } else {
      // By default, show only regular users
      query.role = "user";
    }

    let usersQuery = User.find(query).select("-password");

    if (sort === "newest") {
      usersQuery = usersQuery.sort({ createdAt: -1 });
    } else if (sort === "oldest") {
      usersQuery = usersQuery.sort({ createdAt: 1 });
    } else if (sort === "most-orders") {
      usersQuery = usersQuery.sort({ totalOrders: -1 });
    } else if (sort === "highest-spent") {
      usersQuery = usersQuery.sort({ totalSpent: -1 });
    }

    const users = await usersQuery.populate("orders");

    res.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching customers",
    });
  }
});

// Create new admin (Admin only)
router.post("/admin", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const user = new User({
      name,
      email,
      password,
      role: "admin",
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error creating admin",
    });
  }
});

// Get customer details (Admin only)
router.get("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate({
        path: "orders",
        populate: { path: "items.product" },
      });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching customer",
    });
  }
});

// Get customer stats (Admin only)
router.get("/stats/overview", authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: "user" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    
    const customerStats = await User.aggregate([
      { $match: { role: "user" } },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          totalSpent: { $sum: "$totalSpent" },
          avgSpent: { $avg: "$totalSpent" },
          totalOrders: { $sum: "$totalOrders" },
          avgOrders: { $avg: "$totalOrders" },
        },
      },
    ]);

    const stats = customerStats[0] || {
      totalCustomers: 0,
      totalSpent: 0,
      avgSpent: 0,
      totalOrders: 0,
      avgOrders: 0,
    };

    // Get new customers this month
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
    const newCustomersThisMonth = await User.countDocuments({
      role: "user",
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.json({
      success: true,
      stats: {
        ...stats,
        totalAdmins,
        newCustomersThisMonth,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching customer stats",
    });
  }
});

// Update customer info (Admin only)
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, phone, address, city, state, pincode } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res.json({
      success: true,
      message: "Customer updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating customer",
    });
  }
});

// Delete customer (Admin only)
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    // Delete associated orders
    await Order.deleteMany({ user: user._id });

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting customer",
    });
  }
});

export default router;
