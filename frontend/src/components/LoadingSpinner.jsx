import { Leaf } from "lucide-react";
import { motion } from "motion/react";

export default function LoadingSpinner({ message = "Preparing your tea..." }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-4"
      data-ocid="loading-spinner"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="w-10 h-10 rounded-full border-2 border-border border-t-primary"
      />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

export function EmptyState({
  icon: Icon = Leaf,
  title = "Nothing here yet",
  description,
  action,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 gap-4 text-center"
      data-ocid="empty-state"
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <Icon size={28} className="text-muted-foreground" />
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground text-sm max-w-xs">
            {description}
          </p>
        )}
      </div>
      {action}
    </motion.div>
  );
}
