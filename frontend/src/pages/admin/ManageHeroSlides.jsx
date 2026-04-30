import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Check,
  Edit,
  GripVertical,
  Loader2,
  LogOut,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import SectionContainer from "../../components/SectionContainer";
import { useAuth } from "../../context/AuthContext";

export default function ManageHeroSlides() {
  const { user, token, logout, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    label: "",
    title: "",
    subtitle: "",
    cta: "",
    ctaLink: "/shop",
    image: "",
    order: 0,
    active: true,
  });
  const [isUploading, setIsUploading] = useState(false);

  // Redirect if not admin (but don't redirect while auth is loading)
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate({ to: "/login" });
    }
  }, [isAdmin, authLoading, navigate]);

  // Fetch hero slides
  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://tealeafluxe.onrender.com/api/hero-slides/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setSlides(data.slides);
      }
    } catch (err) {
      setError("Failed to load slides");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setIsUploading(true);
      setError("");
      const response = await fetch(
        "https://tealeafluxe.onrender.com/api/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadData,
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to upload image");
      }

      setFormData((prev) => ({
        ...prev,
        image: `https://tealeafluxe.onrender.com${data.imageUrl}`,
      }));
      setSuccess("Image uploaded successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.label ||
      !formData.title ||
      !formData.subtitle ||
      !formData.cta ||
      !formData.image
    ) {
      setError("All fields are required!");
      return;
    }

    try {
      const method = editingSlide ? "PUT" : "POST";
      const url = editingSlide
        ? `https://tealeafluxe.onrender.com/api/hero-slides/${editingSlide._id}`
        : "https://tealeafluxe.onrender.com/api/hero-slides";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save slide");
      }

      if (editingSlide) {
        setSlides(
          slides.map((s) => (s._id === data.slide._id ? data.slide : s)),
        );
        setSuccess("Slide updated successfully!");
      } else {
        setSlides([...slides, data.slide]);
        setSuccess("Slide added successfully!");
      }

      setTimeout(() => {
        resetForm();
        setShowModal(false);
        setEditingSlide(null);
      }, 500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (slideId) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://tealeafluxe.onrender.com/api/hero-slides/${slideId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete slide");
      }

      setSlides(slides.filter((s) => s._id !== slideId));
      setSuccess("Slide deleted successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      label: slide.label,
      title: slide.title,
      subtitle: slide.subtitle,
      cta: slide.cta,
      ctaLink: slide.ctaLink,
      image: slide.image,
      order: slide.order,
      active: slide.active,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      label: "",
      title: "",
      subtitle: "",
      cta: "",
      ctaLink: "/shop",
      image: "",
      order: 0,
      active: true,
    });
    setError("");
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl font-semibold text-foreground flex items-center gap-3">
              <GripVertical className="text-primary" size={32} />
              Manage Hero Slides
            </h1>
            <p className="text-foreground/60 mt-2">
              Edit your homepage banner images
            </p>
          </motion.div>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-lg bg-accent/10 border border-accent/30 flex items-center gap-3"
            >
              <Check className="text-accent" size={20} />
              <p className="text-accent font-medium">{success}</p>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3"
            >
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-600 font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Slide Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingSlide(null);
            resetForm();
            setShowModal(true);
          }}
          className="mb-8 flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-smooth"
        >
          <Plus size={20} />
          Add New Slide
        </motion.button>

        {/* Slides Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-foreground/60">Loading slides...</p>
          </div>
        ) : slides.length === 0 ? (
          <div className="text-center py-20">
            <GripVertical
              size={48}
              className="mx-auto text-muted-foreground/30 mb-4"
            />
            <p className="text-foreground/60">No slides found</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {slides.map((slide, idx) => (
              <motion.div
                key={slide._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow"
              >
                {/* Image Preview */}
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={slide.image}
                    alt={slide.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3 bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Slide {idx + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-xs text-foreground/50 uppercase tracking-wide">
                      {slide.label}
                    </p>
                    <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                      {slide.title}
                    </h3>
                  </div>

                  <p className="text-sm text-foreground/70 line-clamp-2 mb-4">
                    {slide.subtitle}
                  </p>

                  <div className="flex items-center gap-2 mb-4 py-3 border-t border-b border-border/50">
                    <span className="text-xs font-medium text-foreground/60">
                      CTA:
                    </span>
                    <span className="text-sm text-foreground">{slide.cta}</span>
                    {!slide.active && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-700 px-2 py-1 rounded ml-auto">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(slide)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-smooth text-foreground/70 hover:text-primary border border-border/50"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(slide._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-smooth text-foreground/70 hover:text-red-600 border border-border/50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    {editingSlide ? "Edit Slide" : "Add New Slide"}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-smooth"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Image Upload / URL */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Hero Image *
                    </label>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90 transition-smooth font-medium">
                          {isUploading ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <Upload size={18} />
                          )}
                          {isUploading ? "Uploading..." : "Upload Image"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                        </label>
                        <span className="text-sm text-foreground/50">
                          OR provide a URL below
                        </span>
                      </div>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    {formData.image && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-border">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Label (e.g., "Darjeeling First Flush 2026") *
                    </label>
                    <input
                      type="text"
                      name="label"
                      value={formData.label}
                      onChange={handleInputChange}
                      placeholder="e.g., Ceremonial Grade"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Title (Main Heading) *
                    </label>
                    <textarea
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="The Ritual\nof Matcha"
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Subtitle (Description) *
                    </label>
                    <textarea
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      placeholder="Stone-ground Uji ceremonial matcha of rare purity..."
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  {/* CTA Button Text */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Button Text (CTA) *
                    </label>
                    <input
                      type="text"
                      name="cta"
                      value={formData.cta}
                      onChange={handleInputChange}
                      placeholder="e.g., Discover Matcha"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* CTA Link */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Button Link
                    </label>
                    <input
                      type="text"
                      name="ctaLink"
                      value={formData.ctaLink}
                      onChange={handleInputChange}
                      placeholder="/shop"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Order */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Order (Display sequence)
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="rounded border-border cursor-pointer"
                    />
                    <label
                      htmlFor="active"
                      className="text-sm font-medium text-foreground cursor-pointer"
                    >
                      Active (Show on homepage)
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                      <AlertCircle className="text-red-500" size={18} />
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-6 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-smooth"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-smooth"
                    >
                      {editingSlide ? "Update" : "Add"} Slide
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
