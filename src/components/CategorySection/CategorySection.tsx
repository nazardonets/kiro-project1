import type { Category, Item } from "../../types";
import { PackingItem } from "../PackingItem/PackingItem";

interface CategorySectionProps {
  category: Category;
  items: Item[];
  checkedIds: Set<string>;
  onToggle: (id: string) => void;
}

const CATEGORY_ICONS: Record<Category, string> = {
  Clothing:    "👕",
  Footwear:    "👟",
  Sleeping:    "🛏️",
  Toiletries:  "🧴",
  Documents:   "📄",
  Electronics: "🔋",
  "First Aid": "🩹",
};

export function CategorySection({ category, items, checkedIds, onToggle }: CategorySectionProps) {
  const checkedCount = items.filter((item) => checkedIds.has(item.id)).length;

  return (
    <section aria-label={`${category} category`} className="category-section">
      <div className="category-section__header">
        <span className="category-section__icon" aria-hidden="true">
          {CATEGORY_ICONS[category]}
        </span>
        <h2 className="category-section__title">{category}</h2>
        <span className="category-section__count" aria-label={`${checkedCount} of ${items.length} packed`}>
          {checkedCount}/{items.length}
        </span>
      </div>
      <ul className="category-section__list">
        {items.map((item) => (
          <PackingItem
            key={item.id}
            item={item}
            checked={checkedIds.has(item.id)}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </section>
  );
}
