import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import wishlistRoutes from "./routes/wishlist.js";
import orderRoutes from "./routes/orders.js";
import customerRoutes from "./routes/customers.js";
import statsRoutes from "./routes/stats.js";
import heroSlidesRoutes from "./routes/heroSlides.js";
import uploadRoutes from "./routes/upload.js";
import bannerOffersRoutes from "./routes/bannerOffers.js";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB connection with safety check
const connectMongoDB = async (retries = 5) => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI is NOT defined in .env file");
    process.exit(1);
  }

  if (uri.includes("mongodb+srv://")) {
    console.log("🔗 Using MongoDB SRV connection...");
  }

  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: "majority",
        maxPoolSize: 10,
        maxIdleTimeMS: 30000,
        family: 4,
      });

      console.log("✅ MongoDB connected");
      return;
    } catch (err) {
      console.error(`❌ Attempt ${i + 1} failed:`, err.message);

      if (i < retries - 1) {
        console.log("⏳ Retrying in 3 seconds...");
        await new Promise((res) => setTimeout(res, 3000));
      } else {
        console.error("❌ Failed to connect to MongoDB");
        console.log("⚠️ Server will continue without DB");
      }
    }
  }
};

// Connect DB
connectMongoDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/hero-slides", heroSlidesRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/banner-offers", bannerOffersRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
