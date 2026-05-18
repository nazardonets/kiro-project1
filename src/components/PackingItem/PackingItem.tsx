import type { Item } from "../../types";

interface PackingItemProps {
  item: Item;
  checked: boolean;
  onToggle: (id: string) => void;
}

export function PackingItem({ item, checked, onToggle }: PackingItemProps) {
  return (
    <li
      style={{ opacity: checked ? 0.5 : 1 }}
      aria-label={item.name}
    >
      <label style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(item.id)}
          aria-label={`Mark ${item.name} as packed`}
        />
        <span>
          <span style={{ textDecoration: checked ? "line-through" : "none" }}>
            {item.name}
          </span>
          {item.note && (
            <span
              style={{
                display: "block",
                fontSize: "0.875rem",
                color: "#666",
                textDecoration: checked ? "line-through" : "none",
              }}
            >
              {item.note}
            </span>
          )}
        </span>
      </label>
    </li>
  );
}
