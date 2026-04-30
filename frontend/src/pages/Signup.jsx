import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!formData.name.trim()) {
      setLocalError("Name is required");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    const result = await signup(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword,
    );

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/shop" });
      }, 1500);
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-2xl border border-border shadow-lg p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
              Join Swadistchai
            </h1>
            <p className="text-foreground/60 text-sm">
              Create your account and explore our premium tea collection
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-lg bg-accent/10 border border-accent/30 flex items-center gap-3"
            >
              <Check className="text-accent" size={20} />
              <p className="text-accent font-medium">
                Account created successfully!
              </p>
            </motion.div>
          )}

          {/* Error Message */}
          {(localError || error) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3"
            >
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-600 font-medium text-sm">
                {localError || error}
              </p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/30 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/30 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/30 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/30 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || success}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading
                ? "Creating Account..."
                : success
                  ? "Account Created!"
                  : "Create Account"}
            </motion.button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-foreground/60 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="mt-12 text-center">
          <p className="text-foreground/40 text-xs">
            By signing up, you agree to our terms and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}
