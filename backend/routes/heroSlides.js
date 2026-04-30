import express from "express";
import HeroSlide from "../models/HeroSlide.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get all hero slides
router.get("/", async (req, res) => {
  try {
    const slides = await HeroSlide.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, slides });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all hero slides (admin view - includes inactive)
router.get("/admin/all", verifyAdmin, async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 });
    res.json({ success: true, slides });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new hero slide
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { label, title, subtitle, cta, ctaLink, image, order, active } =
      req.body;

    if (!label || !title || !subtitle || !cta || !image) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const slide = new HeroSlide({
      label,
      title,
      subtitle,
      cta,
      ctaLink: ctaLink || "/shop",
      image,
      order: order || 0,
      active: active !== false,
    });

    await slide.save();
    res.status(201).json({ success: true, slide });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update hero slide
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const { label, title, subtitle, cta, ctaLink, image, order, active } =
      req.body;

    const slide = await HeroSlide.findByIdAndUpdate(
      req.params.id,
      {
        label,
        title,
        subtitle,
        cta,
        ctaLink,
        image,
        order,
        active,
      },
      { new: true }
    );

    if (!slide) {
      return res
        .status(404)
        .json({ success: false, message: "Slide not found" });
    }

    res.json({ success: true, slide });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete hero slide
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const slide = await HeroSlide.findByIdAndDelete(req.params.id);

    if (!slide) {
      return res
        .status(404)
        .json({ success: false, message: "Slide not found" });
    }

    res.json({ success: true, message: "Slide deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
