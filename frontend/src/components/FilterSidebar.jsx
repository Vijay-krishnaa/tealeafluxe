import { Filter, X } from "lucide-react";
import categories from "../data/categories";

const PRICE_MIN = 0;
const PRICE_MAX = 5000;

export { PRICE_MIN, PRICE_MAX };

export default function FilterSidebar({
  products = [],
  activeCategories,
  onToggleCategory,
  priceMin,
  priceMax,
  onPriceChange,
  onClearAll,
  hasActiveFilters,
  onClose,
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-base text-foreground flex items-center gap-2">
          <Filter size={15} className="text-primary" />
          Filters
        </h3>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-primary hover:text-primary/80 font-medium transition-colors-smooth"
              data-ocid="clear-filters"
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors-smooth"
            aria-label="Close filters"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Category
        </h4>
        <div className="flex flex-col gap-1" data-ocid="category-filter">
          <label className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-muted/60 transition-smooth group">
            <input
              type="checkbox"
              checked={activeCategories.length === 0}
              onChange={() => onToggleCategory("all")}
              className="w-3.5 h-3.5 accent-primary rounded"
              data-ocid="filter-all"
            />
            <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors-smooth flex-1">
              All Teas
            </span>
            <span className="text-xs text-muted-foreground">
              {products.length}
            </span>
          </label>

          {categories.map((cat) => {
            const count = products.filter(
              (p) => p.category.toLowerCase().replace(/\s+/g, "-") === cat.id,
            ).length;
            return (
              <label
                key={cat.id}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-muted/60 transition-smooth group"
              >
                <input
                  type="checkbox"
                  checked={activeCategories.includes(cat.id)}
                  onChange={() => onToggleCategory(cat.id)}
                  className="w-3.5 h-3.5 accent-primary rounded"
                  data-ocid={`filter-${cat.id}`}
                />
                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors-smooth flex-1">
                  {cat.name}
                </span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Price Range
        </h4>
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs pointer-events-none">
              ₹
            </span>
            <input
              type="number"
              min={PRICE_MIN}
              max={priceMax}
              value={priceMin}
              onChange={(e) =>
                onPriceChange(
                  Math.min(Number(e.target.value), priceMax),
                  priceMax,
                )
              }
              className="w-full pl-5 pr-2 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="price-min"
              aria-label="Minimum price"
            />
          </div>
          <span className="text-muted-foreground text-xs shrink-0">–</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs pointer-events-none">
              ₹
            </span>
            <input
              type="number"
              min={priceMin}
              max={PRICE_MAX}
              value={priceMax}
              onChange={(e) =>
                onPriceChange(
                  priceMin,
                  Math.max(Number(e.target.value), priceMin),
                )
              }
              className="w-full pl-5 pr-2 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="price-max"
              aria-label="Maximum price"
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
          <span>₹{priceMin.toLocaleString("en-IN")}</span>
          <span>₹{priceMax.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}
