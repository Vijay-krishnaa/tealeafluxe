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

// Create order (User)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Order items are required" });
    }

    if (!shippingAddress) {
      return res
        .status(400)
        .json({ success: false, message: "Shipping address is required" });
    }

    // Calculate totals
    let orderTotal = 0;
    let processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const subtotal = product.price * item.quantity;
      orderTotal += subtotal;

      processedItems.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Apply tax (10%)
    const taxAmount = orderTotal * 0.1;
    const finalTotal = orderTotal + taxAmount;

    const order = new Order({
      user: req.user.id,
      items: processedItems,
      shippingAddress: {
        ...shippingAddress,
        email: (await User.findById(req.user.id)).email,
      },
      orderTotal: finalTotal,
      taxAmount,
      paymentMethod: paymentMethod || "credit_card",
    });

    await order.save();

    // Add order to user
    const user = await User.findById(req.user.id);
    user.orders.push(order._id);
    user.totalSpent = (user.totalSpent || 0) + finalTotal;
    user.totalOrders = (user.totalOrders || 0) + 1;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: await order.populate("items.product"),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error creating order",
    });
  }
});

// Get user orders
router.get("/user/my-orders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching orders",
    });
  }
});

// Get all orders (Admin only)
router.get("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, sort } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    let ordersQuery = Order.find(query)
      .populate("user", "name email phone")
      .populate("items.product", "name price");

    if (sort === "newest") {
      ordersQuery = ordersQuery.sort({ createdAt: -1 });
    } else if (sort === "oldest") {
      ordersQuery = ordersQuery.sort({ createdAt: 1 });
    } else if (sort === "highest-value") {
      ordersQuery = ordersQuery.sort({ orderTotal: -1 });
    }

    const orders = await ordersQuery;

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching orders",
    });
  }
});

// Track order (Public)
router.post("/track", async (req, res) => {
  try {
    const { orderNumber } = req.body;

    if (!orderNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Order number is required" });
    }

    const order = await Order.findOne({ orderNumber }).populate("items.product", "name");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        date: order.createdAt,
        total: order.orderTotal,
        items: order.items.map(i => i.product?.name).filter(Boolean).join(", ")
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error tracking order",
    });
  }
});

// Get single order
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.product");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Check if user is authorized to view this order
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view this order",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching order",
    });
  }
});

// Update order status (Admin only)
router.put("/:id/status", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("items.product")
      .populate("user");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating order",
    });
  }
});

// Update payment status (Admin only)
router.put("/:id/payment", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res
        .status(400)
        .json({ success: false, message: "Payment status is required" });
    }

    const validStatuses = ["pending", "completed", "failed"];
    if (!validStatuses.includes(paymentStatus)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Payment status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating payment status",
    });
  }
});

// Cancel order
router.put("/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Check authorization
    if (
      order.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to cancel this order",
      });
    }

    // Can only cancel pending orders
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Can only cancel pending orders",
      });
    }

    // Restore product stocks
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error cancelling order",
    });
  }
});

// Delete order (Admin only)
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Remove from user's orders
    await User.findByIdAndUpdate(order.user, {
      $pull: { orders: order._id },
      $inc: {
        totalSpent: -order.orderTotal,
        totalOrders: -1,
      },
    });

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting order",
    });
  }
});

export default router;
