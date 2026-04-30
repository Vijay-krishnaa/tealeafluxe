import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Email and password are required");
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      if (result.user.role === "admin") {
        navigate({ to: "/admin/dashboard" });
      } else {
        navigate({ to: "/shop" });
      }
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
              Welcome Back
            </h1>
            <p className="text-foreground/60 text-sm">
              Sign in to access your account and wishlist
            </p>
          </div>

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
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLocalError("");
                }}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/30 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLocalError("");
                  }}
                  placeholder="Enter your password"
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

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-sm text-foreground/60 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Create One
            </Link>
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="mt-12 text-center">
          <p className="text-foreground/40 text-xs">
            Your information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Please enter a valid email.";
    if (!form.password || form.password.length < 6)
      e.password = "Password must be at least 6 characters.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSuccess?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
      data-ocid="login-form"
    >
      <Field label="Email Address" index={0} error={errors.email}>
        <input
          id="field-email-address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className={errors.email ? inputErrorCls : inputCls}
          data-ocid="login-email"
        />
      </Field>

      <Field label="Password" index={1} error={errors.password}>
        <div className="relative">
          <input
            id="field-password"
            name="password"
            type={showPw ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="Your password"
            className={`${errors.password ? inputErrorCls : inputCls} pr-10`}
            data-ocid="login-password"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
            aria-label={showPw ? "Hide password" : "Show password"}
            data-ocid="login-toggle-pw"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>

      <div className="flex items-center justify-between -mt-1">
        <label
          htmlFor="login-remember-checkbox"
          className="flex items-center gap-2 cursor-pointer group"
          data-ocid="login-remember"
        >
          <input
            id="login-remember-checkbox"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 rounded border border-input accent-primary cursor-pointer"
          />
          <span className="text-xs text-muted-foreground">Remember me</span>
        </label>
        <button
          type="button"
          className="text-xs text-primary hover:underline font-medium"
          data-ocid="forgot-password"
        >
          Forgot password?
        </button>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-smooth mt-1 shadow-tea"
        data-ocid="login-submit"
      >
        Sign In
      </motion.button>
    </form>
  );
}

function SignupForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [terms, setTerms] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your full name.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Please enter a valid email.";
    if (!form.password || form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match.";
    if (!terms) e.terms = "You must agree to the terms.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSuccess?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
      data-ocid="signup-form"
    >
      <Field label="Full Name" index={0} error={errors.name}>
        <input
          id="field-full-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Your full name"
          className={errors.name ? inputErrorCls : inputCls}
          data-ocid="signup-name"
        />
      </Field>

      <Field label="Email Address" index={1} error={errors.email}>
        <input
          id="field-email-address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className={errors.email ? inputErrorCls : inputCls}
          data-ocid="signup-email"
        />
      </Field>

      <Field label="Password" index={2} error={errors.password}>
        <div className="relative">
          <input
            id="field-password"
            name="password"
            type={showPw ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password (min 8 chars)"
            className={`${errors.password ? inputErrorCls : inputCls} pr-10`}
            data-ocid="signup-password"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
            aria-label={showPw ? "Hide password" : "Show password"}
            data-ocid="signup-toggle-pw"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>

      <Field label="Confirm Password" index={3} error={errors.confirm}>
        <div className="relative">
          <input
            id="field-confirm-password"
            name="confirm"
            type={showConfirm ? "text" : "password"}
            value={form.confirm}
            onChange={handleChange}
            placeholder="Repeat your password"
            className={`${errors.confirm ? inputErrorCls : inputCls} pr-10`}
            data-ocid="signup-confirm"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
            aria-label={showConfirm ? "Hide" : "Show"}
            data-ocid="signup-toggle-confirm"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>

      <motion.div
        custom={4}
        variants={fieldAnim}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-1"
      >
        <label
          htmlFor="signup-terms-checkbox"
          className="flex items-start gap-2.5 cursor-pointer group"
          data-ocid="signup-terms"
        >
          <input
            id="signup-terms-checkbox"
            type="checkbox"
            checked={terms}
            onChange={(e) => {
              setTerms(e.target.checked);
              if (errors.terms) setErrors((p) => ({ ...p, terms: "" }));
            }}
            className="w-4 h-4 mt-0.5 rounded border border-input accent-primary cursor-pointer shrink-0"
          />
          <span className="text-xs text-muted-foreground leading-relaxed">
            I agree to the{" "}
            <Link to="/" className="text-primary hover:underline font-medium">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/" className="text-primary hover:underline font-medium">
              Privacy Policy
            </Link>
          </span>
        </label>
        <AnimatePresence>
          {errors.terms && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-destructive font-medium ml-6"
            >
              {errors.terms}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-smooth mt-1 shadow-tea"
        data-ocid="signup-submit"
      >
        Create Account
      </motion.button>
    </form>
  );
}
