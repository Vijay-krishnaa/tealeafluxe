import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    cta: {
      type: String,
      required: true,
    },
    ctaLink: {
      type: String,
      default: "/shop",
    },
    image: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("HeroSlide", heroSlideSchema);
