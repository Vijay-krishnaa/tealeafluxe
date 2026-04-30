import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Edit,
  Link2,
  Loader,
  LogOut,
  Package,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import SectionContainer from "../../components/SectionContainer";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user, token, logout, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingImageUrl, setEditingImageUrl] = useState(null); // Track which image is being edited
  const [tempImageUrl, setTempImageUrl] = useState(""); // Temporary URL input
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Green Tea",
    image: "",
    hoverImage: "",
    additionalImages: Array(8).fill(""), // Up to 10 total images (2 + 8)
    healthBenefits: "",
    featured: false,
    stock: "100",
  });

  // Redirect if not admin (but don't redirect while auth is loading)
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate({ to: "/login" });
    }
  }, [isAdmin, authLoading, navigate]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://tealeafluxe.onrender.com/api/products",
        );
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Helper to construct full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads/")) {
      return `https://tealeafluxe.onrender.com${imagePath}`;
    }
    return imagePath;
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Build images array from form data
    const images = [];
    if (formData.image)
      images.push({ url: formData.image, alt: "Main product image" });
    if (formData.hoverImage)
      images.push({ url: formData.hoverImage, alt: "Product hover image" });
    // Add additional images, filtering out empty ones
    formData.additionalImages
      .filter((img) => img)
      .forEach((img, idx) => {
        images.push({ url: img, alt: `Product image ${idx + 3}` });
      });

    const payload = {
      ...formData,
      images, // Include full images array
      price: Number.parseFloat(formData.price),
      stock: Number.parseInt(formData.stock),
      healthBenefits: formData.healthBenefits
        .split(",")
        .map((b) => b.trim())
        .filter((b) => b),
    };

    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct
        ? `https://tealeafluxe.onrender.com/api/products/${editingProduct._id}`
        : "https://tealeafluxe.onrender.com/api/products";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save product");
      }

      // Update local state with the returned product
      if (editingProduct) {
        setProducts(
          products.map((p) => (p._id === data.product._id ? data.product : p)),
        );
        setSuccess("Product updated successfully!");
      } else {
        setProducts([...products, data.product]);
        setSuccess("Product added successfully!");
      }

      // Reset form and close modal
      setTimeout(() => {
        resetForm();
        setShowAddModal(false);
        setEditingProduct(null);
      }, 500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://tealeafluxe.onrender.com/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(products.filter((p) => p._id !== productId));
      setSuccess("Product deleted successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);

    // Extract images from the images array
    const mainImage =
      product.image || (product.images && product.images[0]?.url) || "";
    const hoverImage =
      product.hoverImage || (product.images && product.images[1]?.url) || "";
    const additionalImages = Array(8).fill("");
    if (product.images && product.images.length > 2) {
      product.images.slice(2).forEach((img, idx) => {
        if (idx < 8) additionalImages[idx] = img.url;
      });
    }

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: mainImage,
      hoverImage: hoverImage,
      additionalImages: additionalImages,
      healthBenefits: product.healthBenefits.join(", "),
      featured: product.featured,
      stock: product.stock,
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Green Tea",
      image: "",
      hoverImage: "",
      additionalImages: Array(8).fill(""),
      healthBenefits: "",
      featured: false,
      stock: "100",
    });
    setError("");
  };

  const handleImageUpload = async (e, imageType) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formDataObj = new FormData();
      formDataObj.append("image", file);

      const response = await fetch(
        "https://tealeafluxe.onrender.com/api/products/upload/image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataObj,
        },
      );

      const data = await response.json();
      if (data.success) {
        // Handle additional images array
        if (imageType.startsWith("additionalImages-")) {
          const index = Number.parseInt(imageType.split("-")[1]);
          setFormData((prev) => {
            const newAdditional = [...prev.additionalImages];
            newAdditional[index] = data.imageUrl;
            return {
              ...prev,
              additionalImages: newAdditional,
            };
          });
          setSuccess(`Additional image ${index + 1} uploaded successfully!`);
        } else {
          // Handle main or hover image
          setFormData((prev) => ({
            ...prev,
            [imageType]: data.imageUrl,
          }));
          setSuccess(
            `${imageType === "image" ? "Main" : "Hover"} image uploaded successfully!`,
          );
        }
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (err) {
      setError("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  // Handle URL editing start
  const startEditingUrl = (imageType, currentUrl) => {
    setEditingImageUrl(imageType);
    setTempImageUrl(currentUrl || "");
  };

  // Handle URL save
  const saveImageUrl = (imageType) => {
    if (!tempImageUrl.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    if (imageType.startsWith("additionalImages-")) {
      const index = Number.parseInt(imageType.split("-")[1]);
      setFormData((prev) => {
        const newAdditional = [...prev.additionalImages];
        newAdditional[index] = tempImageUrl;
        return {
          ...prev,
          additionalImages: newAdditional,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [imageType]: tempImageUrl,
      }));
    }

    setSuccess("Image URL updated successfully!");
    setEditingImageUrl(null);
    setTempImageUrl("");
  };

  // Cancel URL editing
  const cancelEditingUrl = () => {
    setEditingImageUrl(null);
    setTempImageUrl("");
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
              <Package className="text-primary" size={32} />
              Admin Dashboard
            </h1>
            <p className="text-foreground/60 mt-2">Welcome, {user?.name}</p>
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

        {/* Add Product Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowAddModal(true);
          }}
          className="mb-8 flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-smooth"
        >
          <Plus size={20} />
          Add New Product
        </motion.button>

        {/* Products List */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-foreground/60">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package
              size={48}
              className="mx-auto text-muted-foreground/30 mb-4"
            />
            <p className="text-foreground/60">No products found</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-x-auto"
          >
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-foreground/60 text-left">
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Price</th>
                  <th className="py-3 px-4 font-semibold">Stock</th>
                  <th className="py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-smooth"
                  >
                    <td className="py-3 px-4 font-medium text-foreground">
                      {product.name}
                    </td>
                    <td className="py-3 px-4 text-foreground/70">
                      {product.category}
                    </td>
                    <td className="py-3 px-4 text-foreground/70">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-foreground/70">
                      {product.stock}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 rounded-lg hover:bg-muted transition-smooth text-foreground/70 hover:text-primary"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 transition-smooth text-foreground/70 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-2xl border border-border p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
              >
                <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g., Imperial Jade Green"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      placeholder="Describe your tea..."
                    />
                  </div>

                  {/* Price & Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        step="0.01"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="1500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Stock *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option>Green Tea</option>
                      <option>Black Tea</option>
                      <option>Matcha</option>
                      <option>White Tea</option>
                      <option>Oolong</option>
                      <option>Herbal</option>
                      <option>Pu-erh</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Main Image */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Main Image * (Upload or Paste URL)
                      </label>
                      <div className="space-y-3">
                        {/* Preview */}
                        {formData.image && (
                          <div className="relative rounded-lg overflow-hidden bg-muted/20 aspect-square border-2 border-primary group">
                            <img
                              src={getImageUrl(formData.image)}
                              alt="Main preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&q=80&auto=format&fit=crop";
                                e.target.onerror = null;
                              }}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  startEditingUrl("image", formData.image)
                                }
                                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium cursor-pointer transition-smooth"
                                title="Edit URL"
                              >
                                <Link2 size={14} />
                                Edit URL
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    image: "",
                                  }))
                                }
                                className="p-1.5 rounded-md bg-destructive hover:bg-destructive/90 cursor-pointer transition-smooth"
                              >
                                <X
                                  size={16}
                                  className="text-destructive-foreground"
                                />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* URL Edit Modal */}
                        {editingImageUrl === "image" && (
                          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-2">
                            <input
                              type="text"
                              value={tempImageUrl}
                              onChange={(e) => setTempImageUrl(e.target.value)}
                              placeholder="Paste image URL here..."
                              className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => saveImageUrl("image")}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium transition-smooth flex items-center justify-center gap-1"
                              >
                                <CheckCircle2 size={14} />
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditingUrl}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-border hover:bg-muted/30 text-foreground text-xs font-medium transition-smooth"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Upload Button */}
                        <label className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 text-foreground hover:bg-primary/10 cursor-pointer transition-smooth flex items-center justify-center gap-2 font-medium">
                          <Upload size={18} className="text-primary" />
                          {formData.image
                            ? "Change Image"
                            : "Upload Main Image"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "image")}
                            disabled={uploading}
                            className="hidden"
                          />
                        </label>
                        {uploading && (
                          <div className="flex items-center gap-2 text-sm text-primary">
                            <Loader size={16} className="animate-spin" />
                            Uploading...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hover Image */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Hover Image (Upload or Paste URL)
                      </label>
                      <div className="space-y-3">
                        {/* Preview */}
                        {formData.hoverImage && (
                          <div className="relative rounded-lg overflow-hidden bg-muted/20 aspect-square border-2 border-primary group">
                            <img
                              src={getImageUrl(formData.hoverImage)}
                              alt="Hover preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&q=80&auto=format&fit=crop";
                                e.target.onerror = null;
                              }}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  startEditingUrl(
                                    "hoverImage",
                                    formData.hoverImage,
                                  )
                                }
                                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium cursor-pointer transition-smooth"
                                title="Edit URL"
                              >
                                <Link2 size={14} />
                                Edit URL
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    hoverImage: "",
                                  }))
                                }
                                className="p-1.5 rounded-md bg-destructive hover:bg-destructive/90 cursor-pointer transition-smooth"
                              >
                                <X
                                  size={16}
                                  className="text-destructive-foreground"
                                />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* URL Edit Modal */}
                        {editingImageUrl === "hoverImage" && (
                          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-2">
                            <input
                              type="text"
                              value={tempImageUrl}
                              onChange={(e) => setTempImageUrl(e.target.value)}
                              placeholder="Paste image URL here..."
                              className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => saveImageUrl("hoverImage")}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium transition-smooth flex items-center justify-center gap-1"
                              >
                                <CheckCircle2 size={14} />
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditingUrl}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-border hover:bg-muted/30 text-foreground text-xs font-medium transition-smooth"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Upload Button */}
                        <label className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 text-foreground hover:bg-primary/10 cursor-pointer transition-smooth flex items-center justify-center gap-2 font-medium">
                          <Upload size={18} className="text-primary" />
                          {formData.hoverImage
                            ? "Change Image"
                            : "Upload Hover Image"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "hoverImage")}
                            disabled={uploading}
                            className="hidden"
                          />
                        </label>
                        {uploading && (
                          <div className="flex items-center gap-2 text-sm text-primary">
                            <Loader size={16} className="animate-spin" />
                            Uploading...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Additional Images - Local Upload or URL */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Additional Images (Up to 8 more - Upload or Paste URL)
                    </label>
                    <p className="text-xs text-foreground/60 mb-3">
                      💾 Upload locally or paste a URL (only .jpg, .png, .webp,
                      .gif allowed - max 5MB each)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {formData.additionalImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative group">
                          <div className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/20 flex items-center justify-center overflow-hidden hover:border-primary/50 transition-smooth">
                            {imgUrl ? (
                              <>
                                <img
                                  src={getImageUrl(imgUrl)}
                                  alt={`Additional ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&q=80&auto=format&fit=crop";
                                    e.target.onerror = null;
                                  }}
                                />
                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      startEditingUrl(
                                        `additionalImages-${idx}`,
                                        imgUrl,
                                      )
                                    }
                                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium cursor-pointer transition-smooth"
                                    title="Edit URL"
                                  >
                                    <Link2 size={12} />
                                    URL
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData((prev) => {
                                        const newAdditional = [
                                          ...prev.additionalImages,
                                        ];
                                        newAdditional[idx] = "";
                                        return {
                                          ...prev,
                                          additionalImages: newAdditional,
                                        };
                                      });
                                    }}
                                    className="p-1 rounded-md bg-destructive hover:bg-destructive/90 cursor-pointer transition-smooth"
                                  >
                                    <X
                                      size={12}
                                      className="text-destructive-foreground"
                                    />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/40 transition-smooth group/upload">
                                <Upload
                                  size={20}
                                  className="text-muted-foreground group-hover/upload:text-primary transition-smooth"
                                />
                                <span className="text-xs text-muted-foreground mt-1 text-center px-2">
                                  Image {idx + 3}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleImageUpload(
                                      e,
                                      `additionalImages-${idx}`,
                                    )
                                  }
                                  disabled={uploading}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>

                          {/* URL Edit Modal for Additional Images */}
                          {editingImageUrl === `additionalImages-${idx}` && (
                            <div className="absolute -bottom-20 left-0 right-0 z-10 p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-1 shadow-lg">
                              <input
                                type="text"
                                value={tempImageUrl}
                                onChange={(e) =>
                                  setTempImageUrl(e.target.value)
                                }
                                placeholder="Paste URL..."
                                className="w-full px-2 py-1 rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs"
                              />
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    saveImageUrl(`additionalImages-${idx}`)
                                  }
                                  className="flex-1 px-2 py-0.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium transition-smooth"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEditingUrl}
                                  className="flex-1 px-2 py-0.5 rounded-lg border border-border hover:bg-muted/30 text-foreground text-xs font-medium transition-smooth"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Health Benefits */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Health Benefits (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="healthBenefits"
                      value={formData.healthBenefits}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Rich in antioxidants, Boosts metabolism, ..."
                    />
                  </div>

                  {/* Featured */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-border cursor-pointer"
                    />
                    <span className="text-sm font-medium text-foreground">
                      Featured Product
                    </span>
                  </label>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted/30 transition-smooth"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-smooth"
                    >
                      {editingProduct ? "Update Product" : "Add Product"}
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
