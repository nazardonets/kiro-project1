import type { Item } from "../../types";

interface PackingItemProps {
  item: Item;
  checked: boolean;
  onToggle: (id: string) => void;
}

export function PackingItem({ item, checked, onToggle }: PackingItemProps) {
  return (
    <li
      className={`packing-item${checked ? " packing-item--checked" : ""}`}
      aria-label={item.name}
    >
      <label className="packing-item__label">
        <input
          type="checkbox"
          className="packing-item__checkbox"
          checked={checked}
          onChange={() => onToggle(item.id)}
          aria-label={`Mark ${item.name} as packed`}
        />
        <span className="packing-item__content">
          <span
            className={`packing-item__name${checked ? " packing-item__name--checked" : ""}`}
          >
            {item.name}
          </span>
          {item.note && (
            <span
              className={`packing-item__note${checked ? " packing-item__note--checked" : ""}`}
            >
              {item.note}
            </span>
          )}
        </span>
      </label>
    </li>
  );
}
