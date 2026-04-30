import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: "border-l-4 border-primary bg-card",
  error: "border-l-4 border-destructive bg-card",
  info: "border-l-4 border-accent bg-card",
};

const iconStyles = {
  success: "text-primary",
  error: "text-destructive",
  info: "text-accent",
};

let toastListeners = [];
let toastId = 0;

export function toast({ message, type = "success", duration = 4000 }) {
  const id = ++toastId;
  for (const listener of toastListeners)
    listener({ id, message, type, duration });
  return id;
}

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const listener = (toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => removeToast(toast.id), toast.duration);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, [removeToast]);

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-xs w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.type] || icons.info;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-tea ${styles[t.type]}`}
              data-ocid={`toast-${t.id}`}
            >
              <Icon
                size={18}
                className={`shrink-0 mt-0.5 ${iconStyles[t.type]}`}
              />
              <span className="text-sm text-foreground flex-1 leading-relaxed">
                {t.message}
              </span>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors-smooth"
                type="button"
                aria-label="Dismiss"
              >
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
