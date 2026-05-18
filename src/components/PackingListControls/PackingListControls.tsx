import { useState } from "react";
import type { Category, PackingList, TripProfile } from "../../types";

interface PackingListControlsProps {
  packingList: PackingList;
  tripProfile: TripProfile;
  onStartOver: () => void;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildExportContent(packingList: PackingList, tripProfile: TripProfile): string {
  const lines: string[] = [];

  lines.push("Camino de Santiago — Packing List");
  lines.push("==================================");
  lines.push(`Departure: ${formatDate(tripProfile.departureDate)}`);
  lines.push(`Return:    ${formatDate(tripProfile.returnDate)}`);
  lines.push(`Accommodation: ${tripProfile.accommodationType}`);
  lines.push(`Season: ${tripProfile.season}`);
  lines.push("");

  const byCategory = new Map<Category, typeof packingList.items>();
  for (const item of packingList.items) {
    const existing = byCategory.get(item.category);
    if (existing) {
      existing.push(item);
    } else {
      byCategory.set(item.category, [item]);
    }
  }

  for (const [category, items] of byCategory) {
    lines.push(`--- ${category} ---`);
    for (const item of items) {
      lines.push(`  [ ] ${item.name}${item.note ? ` (${item.note})` : ""}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function PackingListControls({
  packingList,
  tripProfile,
  onStartOver,
}: PackingListControlsProps) {
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [printMessage, setPrintMessage] = useState<string | null>(null);

  const isEmpty = packingList.items.length === 0;

  function handleExport() {
    if (isEmpty) {
      setExportMessage("No items available to export.");
      return;
    }
    setExportMessage(null);

    const content = buildExportContent(packingList, tripProfile);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "camino-packing-list.txt";
    anchor.click();

    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    if (isEmpty) {
      setPrintMessage("No items available to print.");
      return;
    }
    setPrintMessage(null);
    window.print();
  }

  function handleStartOver() {
    const confirmed = window.confirm(
      "Are you sure you want to start over? Your current packing list and all checked items will be cleared."
    );
    if (confirmed) {
      onStartOver();
    }
  }

  return (
    <div aria-label="Packing list controls" className="controls-bar">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={handleExport}
        aria-label="Export packing list"
      >
        ↓ Export
      </button>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={handlePrint}
        aria-label="Print packing list"
      >
        🖨 Print
      </button>

      <div className="controls-bar__spacer" />

      <button
        type="button"
        className="btn btn-danger"
        onClick={handleStartOver}
        aria-label="Start over"
      >
        ↺ Start Over
      </button>

      {(exportMessage || printMessage) && (
        <p role="status" aria-live="polite" className="controls-inline-msg">
          {exportMessage ?? printMessage}
        </p>
      )}
    </div>
  );
}
