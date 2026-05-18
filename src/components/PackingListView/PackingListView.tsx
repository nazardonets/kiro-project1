import { useState } from "react";
import type { Category, PackingList, TripProfile } from "../../types";
import { CategorySection } from "../CategorySection/CategorySection";
import { PackingListControls } from "../PackingListControls/PackingListControls";
import { TripSummary } from "../TripSummary/TripSummary";

interface PackingListViewProps {
  packingList: PackingList;
  tripProfile: TripProfile;
  onReset: () => void;
}

// Canonical category order for display
const CATEGORY_ORDER: Category[] = [
  "Clothing",
  "Footwear",
  "Sleeping",
  "Toiletries",
  "Documents",
  "Electronics",
  "First Aid",
];

export function PackingListView({
  packingList,
  tripProfile,
  onReset,
}: PackingListViewProps) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  function handleToggle(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const isEmpty = packingList.items.length === 0;

  // Group items by category, preserving canonical order
  const itemsByCategory = new Map<Category, typeof packingList.items>();
  for (const category of CATEGORY_ORDER) {
    const items = packingList.items.filter((item) => item.category === category);
    if (items.length > 0) {
      itemsByCategory.set(category, items);
    }
  }

  const totalItems = packingList.items.length;
  const packedItems = packingList.items.filter((item) =>
    checkedIds.has(item.id)
  ).length;

  return (
    <main aria-label="Packing list view">
      <TripSummary tripProfile={tripProfile} season={tripProfile.season} />

      {isEmpty ? (
        <p role="status">
          No items found for the given trip profile. Please try different dates
          or accommodation type.
        </p>
      ) : (
        <>
          <p aria-live="polite" aria-atomic="true">
            {packedItems} of {totalItems} items packed
          </p>

          <div>
            {Array.from(itemsByCategory.entries()).map(([category, items]) => (
              <CategorySection
                key={category}
                category={category}
                items={items}
                checkedIds={checkedIds}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </>
      )}

      <PackingListControls
        packingList={packingList}
        tripProfile={tripProfile}
        onStartOver={onReset}
      />
    </main>
  );
}
