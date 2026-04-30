import { motion } from "motion/react";

export default function SectionContainer({
  children,
  className = "",
  id,
  tight = false,
}) {
  return (
    <section
      id={id}
      className={`${tight ? "py-12 md:py-16" : "py-16 md:py-24"} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function SectionHeading({
  label,
  title,
  subtitle,
  centered = false,
  light = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-10 md:mb-14 ${centered ? "text-center" : ""}`}
    >
      {label && (
        <span
          className={`inline-block text-xs font-semibold tracking-widest uppercase mb-3 ${light ? "text-accent" : "text-accent"}`}
        >
          {label}
        </span>
      )}
      <h2
        className={`font-display text-3xl md:text-4xl font-semibold leading-tight text-balance ${light ? "text-primary-foreground" : "text-foreground"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-base leading-relaxed max-w-xl ${centered ? "mx-auto" : ""} ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
