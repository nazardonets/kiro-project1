import type { ItemDefinition } from "../types";

/**
 * Static item database for the Camino packing list.
 *
 * Each item is tagged with:
 *   - `isBase: true`  → always included regardless of season/accommodation
 *   - `seasons`       → if present, only included for those seasons
 *   - `accommodationTypes` → if present, only included for those accommodation types
 *   - `excludeAccommodationTypes` → if present, excluded for those types
 */
export const ITEMS: ItemDefinition[] = [
  // ─── Base items (always included) ────────────────────────────────────────
  {
    id: "base-walking-poles",
    name: "Walking Poles",
    category: "Footwear",
    note: "Telescopic, with rubber tips for pavement",
    isBase: true,
  },
  {
    id: "base-blister-kit",
    name: "Blister Kit",
    category: "First Aid",
    note: "Compeed patches, needle, antiseptic wipes",
    isBase: true,
  },
  {
    id: "base-pilgrim-credential",
    name: "Pilgrim Credential",
    category: "Documents",
    note: "Pilgrim passport for stamps (sello)",
    isBase: true,
  },
  {
    id: "base-passport",
    name: "Passport / ID",
    category: "Documents",
    isBase: true,
  },
  {
    id: "base-backpack",
    name: "Backpack (30–40L)",
    category: "Clothing",
    note: "Fitted with rain cover",
    isBase: true,
  },
  {
    id: "base-hiking-boots",
    name: "Hiking Boots",
    category: "Footwear",
    note: "Broken in before departure",
    isBase: true,
  },
  {
    id: "base-sandals",
    name: "Sandals / Camp Shoes",
    category: "Footwear",
    note: "For rest stops and albergue evenings",
    isBase: true,
  },
  {
    id: "base-hiking-socks",
    name: "Hiking Socks (x3 pairs)",
    category: "Clothing",
    note: "Merino wool recommended",
    isBase: true,
  },
  {
    id: "base-tshirts",
    name: "Moisture-Wicking T-Shirts (x2)",
    category: "Clothing",
    isBase: true,
  },
  {
    id: "base-underwear",
    name: "Underwear (x3)",
    category: "Clothing",
    note: "Quick-dry fabric",
    isBase: true,
  },
  {
    id: "base-trousers",
    name: "Hiking Trousers / Shorts",
    category: "Clothing",
    isBase: true,
  },
  {
    id: "base-headlamp",
    name: "Headlamp",
    category: "Electronics",
    note: "With spare batteries",
    isBase: true,
  },
  {
    id: "base-phone-charger",
    name: "Phone + Charger",
    category: "Electronics",
    isBase: true,
  },
  {
    id: "base-power-bank",
    name: "Power Bank",
    category: "Electronics",
    isBase: true,
  },
  {
    id: "base-toiletries",
    name: "Toiletries (travel size)",
    category: "Toiletries",
    note: "Shampoo, soap, toothbrush, toothpaste",
    isBase: true,
  },
  {
    id: "base-towel",
    name: "Quick-Dry Towel",
    category: "Toiletries",
    isBase: true,
  },
  {
    id: "base-first-aid",
    name: "Basic First Aid Kit",
    category: "First Aid",
    note: "Bandages, pain relief, antihistamine",
    isBase: true,
  },
  {
    id: "base-water-bottle",
    name: "Water Bottle / Hydration Pack",
    category: "Toiletries",
    note: "Minimum 1L capacity",
    isBase: true,
  },

  // ─── Sleeping items ───────────────────────────────────────────────────────
  {
    id: "sleep-liner",
    name: "Sleeping Bag Liner",
    category: "Sleeping",
    note: "Required in most albergues",
    // Included for albergues; excluded for Hotel (sheets provided)
    excludeAccommodationTypes: ["Hotel"],
  },
  {
    id: "sleep-earplugs",
    name: "Earplugs",
    category: "Sleeping",
    note: "Essential in shared dormitories",
    // Only relevant in shared accommodation
    accommodationTypes: ["Municipal Albergue", "Private Albergue", "Hostel"],
  },
  {
    id: "sleep-eye-mask",
    name: "Eye Mask",
    category: "Sleeping",
    note: "For early risers in shared dorms",
    accommodationTypes: ["Municipal Albergue", "Private Albergue", "Hostel"],
  },

  // ─── Season-specific: Spring & Autumn ────────────────────────────────────
  {
    id: "spring-autumn-rain-jacket",
    name: "Rain Jacket",
    category: "Clothing",
    note: "Lightweight, packable",
    seasons: ["Spring", "Autumn"],
  },
  {
    id: "spring-autumn-mid-layer",
    name: "Mid-Layer Fleece / Softshell",
    category: "Clothing",
    note: "Light insulation for cool mornings",
    seasons: ["Spring", "Autumn"],
  },
  {
    id: "spring-autumn-light-layers",
    name: "Light Layers (long-sleeve shirt)",
    category: "Clothing",
    seasons: ["Spring", "Autumn"],
  },

  // ─── Season-specific: Summer ──────────────────────────────────────────────
  {
    id: "summer-sunscreen",
    name: "Sunscreen (SPF 50+)",
    category: "Toiletries",
    note: "Reapply every 2 hours on trail",
    seasons: ["Summer"],
  },
  {
    id: "summer-sun-hat",
    name: "Sun Hat",
    category: "Clothing",
    note: "Wide brim for full face/neck coverage",
    seasons: ["Summer"],
  },
  {
    id: "summer-uv-clothing",
    name: "UV-Protective Clothing",
    category: "Clothing",
    note: "UPF 50+ long-sleeve shirt",
    seasons: ["Summer"],
  },
  {
    id: "summer-breathable-shirt",
    name: "Lightweight Breathable Shirt (x2)",
    category: "Clothing",
    note: "Moisture-wicking, fast-drying",
    seasons: ["Summer"],
  },
  {
    id: "summer-electrolytes",
    name: "Electrolyte Tablets",
    category: "First Aid",
    note: "Prevent dehydration in heat",
    seasons: ["Summer"],
  },

  // ─── Season-specific: Winter ──────────────────────────────────────────────
  {
    id: "winter-thermal-base-layers",
    name: "Thermal Base Layers",
    category: "Clothing",
    note: "Top and bottom, merino or synthetic",
    seasons: ["Winter"],
  },
  {
    id: "winter-waterproof-jacket",
    name: "Waterproof Jacket",
    category: "Clothing",
    note: "Fully seam-sealed, windproof",
    seasons: ["Winter"],
  },
  {
    id: "winter-gloves",
    name: "Gloves",
    category: "Clothing",
    note: "Waterproof, touchscreen-compatible",
    seasons: ["Winter"],
  },
  {
    id: "winter-hat",
    name: "Warm Hat / Beanie",
    category: "Clothing",
    seasons: ["Winter"],
  },
  {
    id: "winter-neck-gaiter",
    name: "Neck Gaiter / Buff",
    category: "Clothing",
    seasons: ["Winter"],
  },
  {
    id: "winter-waterproof-trousers",
    name: "Waterproof Trousers",
    category: "Clothing",
    note: "Over-trousers for rain and wind",
    seasons: ["Winter"],
  },
  {
    id: "winter-hand-warmers",
    name: "Hand Warmers",
    category: "First Aid",
    note: "Disposable, for extreme cold days",
    seasons: ["Winter"],
  },
];
