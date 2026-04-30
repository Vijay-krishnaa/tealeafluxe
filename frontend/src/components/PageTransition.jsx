import { useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";

export default function PageTransition({ children }) {
  const state = useRouterState();
  const pathname = state.location.pathname;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
