import express from "express";
import BannerOffer from "../models/BannerOffer.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// @desc    Get all active banner offers
// @route   GET /api/banner-offers
// @access  Public
router.get("/", async (req, res) => {
  try {
    const offers = await BannerOffer.find({ active: true });
    

    const processedOffers = offers.map(o => {
      if (!o.text && o.discount) {
        return { ...o._doc, text: `🎉 Flat ${o.discount} off on the purchase of ${o.minAmount}` };
      }
      return o;
    });

    res.json({ success: true, offers: processedOffers });
  } catch (error) {
    console.error("Error fetching banner offers:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @desc    Get all banner offers (including inactive)
// @route   GET /api/banner-offers/admin
// @access  Private/Admin
router.get("/admin", verifyAdmin, async (req, res) => {
  try {
    const offers = await BannerOffer.find({});
    
    const processedOffers = offers.map(o => {
      if (!o.text && o.discount) {
        return { ...o._doc, text: `🎉 Flat ${o.discount} off on the purchase of ${o.minAmount}` };
      }
      return o;
    });

    res.json({ success: true, offers: processedOffers });
  } catch (error) {
    console.error("Error fetching banner offers for admin:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @desc    Create a new banner offer
// @route   POST /api/banner-offers
// @access  Private/Admin
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { text, active } = req.body;
    
    const offer = new BannerOffer({
      text,
      active: active !== undefined ? active : true,
    });

    const createdOffer = await offer.save();
    res.status(201).json({ success: true, offer: createdOffer });
  } catch (error) {
    console.error("Error creating banner offer:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @desc    Update a banner offer
// @route   PUT /api/banner-offers/:id
// @access  Private/Admin
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const { text, active } = req.body;
    
    const offer = await BannerOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }

    offer.text = text || offer.text;
    if (active !== undefined) {
      offer.active = active;
    }

    const updatedOffer = await offer.save();
    res.json({ success: true, offer: updatedOffer });
  } catch (error) {
    console.error("Error updating banner offer:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @desc    Delete a banner offer
// @route   DELETE /api/banner-offers/:id
// @access  Private/Admin
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const offer = await BannerOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }

    await offer.deleteOne();
    res.json({ success: true, message: "Offer removed" });
  } catch (error) {
    console.error("Error deleting banner offer:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
