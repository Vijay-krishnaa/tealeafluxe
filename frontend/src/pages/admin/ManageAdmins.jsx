import { AlertCircle, Check, Plus, Shield, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function ManageAdmins() {
  const { token, user: currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchAdmins = async () => {
    try {
      const response = await fetch(
        "https://tealeafluxe.onrender.com/api/customers?role=admin",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      if (data.success) setAdmins(data.users);
    } catch (err) {
      setError("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAdmins();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "https://tealeafluxe.onrender.com/api/customers/admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();
      if (data.success) {
        setSuccess("Admin created successfully!");
        setShowAddModal(false);
        setFormData({ name: "", email: "", password: "" });
        fetchAdmins();
      } else {
        setError(data.message || "Failed to create admin");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  const handleDelete = async (adminId) => {
    if (adminId === currentUser?.id) {
      alert("You cannot delete yourself.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      const response = await fetch(
        `https://tealeafluxe.onrender.com/api/customers/${adminId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      if (data.success) {
        setAdmins(admins.filter((a) => a._id !== adminId));
        setSuccess("Admin deleted successfully!");
      } else {
        alert(data.message || "Failed to delete admin");
      }
    } catch (err) {
      alert("An error occurred");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl font-semibold text-foreground flex items-center gap-3">
              <Shield className="text-primary" size={28} />
              Manage Admins
            </h1>
            <p className="text-foreground/60 mt-2">
              Add or remove administrators for the panel
            </p>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setFormData({ name: "", email: "", password: "" });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth font-medium"
          >
            <Plus size={18} />
            Add Admin
          </motion.button>
        </div>

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

        {loading ? (
          <div className="text-center py-20 text-foreground/60">Loading...</div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr className="text-foreground/60">
                    <th className="py-4 px-6 font-semibold">Name</th>
                    <th className="py-4 px-6 font-semibold">Email</th>
                    <th className="py-4 px-6 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <motion.tr
                      key={admin._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-smooth"
                    >
                      <td className="py-4 px-6 font-medium text-foreground">
                        {admin.name} {admin._id === currentUser?.id && "(You)"}
                      </td>
                      <td className="py-4 px-6 text-foreground/70">
                        {admin.email}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDelete(admin._id)}
                          disabled={admin._id === currentUser?.id}
                          className={`p-2 rounded-lg transition-smooth ${
                            admin._id === currentUser?.id
                              ? "opacity-50 cursor-not-allowed text-foreground/30"
                              : "hover:bg-red-500/10 text-foreground/70 hover:text-red-600"
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                  {admins.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-8 text-center text-foreground/60"
                      >
                        No admins found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
                className="bg-card rounded-2xl border border-border p-8 max-w-md w-full shadow-xl"
              >
                <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                  Create New Admin
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted font-medium transition-smooth"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-smooth"
                    >
                      Create
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
