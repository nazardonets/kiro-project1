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

  const progressPercent = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  return (
    <main aria-label="Packing list view" className="card">
      <TripSummary tripProfile={tripProfile} season={tripProfile.season} />

      {isEmpty ? (
        <div className="empty-state">
          <div className="empty-state__icon">🎒</div>
          <p className="empty-state__text">
            No items found for the given trip profile. Please try different dates
            or accommodation type.
          </p>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="progress-bar-wrapper">
            <div className="progress-counter">
              <span className="progress-counter__label">Items packed</span>
              <span
                className="progress-counter__fraction"
                aria-live="polite"
                aria-atomic="true"
              >
                {packedItems} of {totalItems}
              </span>
            </div>
            <div className="progress-bar" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="progress-bar__fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Categories */}
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
