import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { authenticateToken } from "./auth.js";

const router = express.Router();

// Get user's wishlist
router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Error fetching wishlist" });
  }
});

// Add product to wishlist
router.post("/add/:productId", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const user = await User.findById(req.user.id);

    if (user.wishlist.includes(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.json({
      success: true,
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Error adding to wishlist" });
  }
});

// Remove product from wishlist
router.delete("/remove/:productId", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);

    if (!user.wishlist.includes(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Product not in wishlist" });
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    res.json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Error removing from wishlist" });
  }
});

export default router;
