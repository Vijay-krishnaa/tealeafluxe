import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../models/Product.js";
import { authenticateToken } from "./auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Admin access required" });
  }
  next();
};

// Upload image endpoint
router.post("/upload/image", authenticateToken, isAdmin, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error uploading image",
    });
  }
});

// Upload multiple images
router.post("/upload/multiple", authenticateToken, isAdmin, upload.array("images", 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided",
      });
    }

    const imageUrls = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
    }));

    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      images: imageUrls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error uploading images",
    });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let products = Product.find(query);

    if (sort === "price-asc") products = products.sort({ price: 1 });
    else if (sort === "price-desc") products = products.sort({ price: -1 });
    else if (sort === "newest") products = products.sort({ createdAt: -1 });
    else products = products.sort({ featured: -1 });

    const result = await products.populate("createdBy", "name email");

    res.json({ success: true, products: result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Error fetching products" });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Error fetching product" });
  }
});

// Create product (Admin only)
router.post("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      hoverImage,
      images,
      healthBenefits,
      featured,
      stock,
    } = req.body;

    if (!name || !description || !price || !category || !image) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      hoverImage,
      images: images || [],
      healthBenefits: healthBenefits || [],
      featured: featured || false,
      stock: stock || 100,
      createdBy: req.user.id,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Error creating product" });
  }
});

// Update product (Admin only)
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      hoverImage,
      images,
      healthBenefits,
      featured,
      stock,
      inStock,
    } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined && price !== null && price !== "") product.price = price;
    if (category) product.category = category;
    if (image) product.image = image;
    if (hoverImage !== undefined) product.hoverImage = hoverImage;
    if (images) product.images = images;
    if (healthBenefits) product.healthBenefits = healthBenefits;
    if (featured !== undefined) product.featured = featured;
    if (stock !== undefined && stock !== null && stock !== "") product.stock = stock;
    if (inStock !== undefined) product.inStock = inStock;

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Error updating product" });
  }
});

// Delete product (Admin only)
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Error deleting product" });
  }
});

export default router;
