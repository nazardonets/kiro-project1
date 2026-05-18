import type { Category, Item } from "../../types";
import { PackingItem } from "../PackingItem/PackingItem";

interface CategorySectionProps {
  category: Category;
  items: Item[];
  checkedIds: Set<string>;
  onToggle: (id: string) => void;
}

export function CategorySection({ category, items, checkedIds, onToggle }: CategorySectionProps) {
  return (
    <section aria-label={`${category} category`}>
      <h2>{category}</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
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
