import { clsx } from "clsx";
import { motion } from "motion/react";

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
  ghost:
    "bg-transparent text-foreground hover:bg-muted border border-transparent",
  outline:
    "bg-transparent text-primary border border-primary hover:bg-primary/8",
  gold: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-xs",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-7 py-3 text-base rounded-lg",
  xl: "px-9 py-4 text-base rounded-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  href,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none active:scale-95";
  const cls = clsx(
    base,
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    className,
  );

  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      {...props}
    >
      {children}
    </motion.button>
  );
}
