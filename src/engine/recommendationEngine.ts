import type { TripProfile, PackingList, Item } from "../types";
import { ITEMS } from "../data/items";

/**
 * Generates a personalized packing list for a Camino trip.
 *
 * Filtering rules (applied to each ItemDefinition in the database):
 *
 * 1. Base items (`isBase: true`) are ALWAYS included, regardless of season,
 *    accommodation type, or trip duration.
 *
 * 2. Season filter: include the item if `seasons` is absent (universal) OR
 *    if `seasons` contains the profile's season.
 *
 * 3. Accommodation type filter:
 *    a. Include if `accommodationTypes` is absent (universal) OR contains
 *       the profile's accommodation type.
 *    b. Exclude if `excludeAccommodationTypes` is present AND contains the
 *       profile's accommodation type.
 *
 * 4. Duration filter:
 *    a. Include if `minDays` is absent OR tripDurationDays >= minDays.
 *    b. Include if `maxDays` is absent OR tripDurationDays <= maxDays.
 *
 * Rules 2, 3, and 4 are applied together (all must pass) for non-base items.
 */
export function generatePackingList(profile: TripProfile): PackingList {
  const filteredItems: Item[] = [];

  for (const def of ITEMS) {
    // Base items are always included — skip all other filters.
    if (def.isBase) {
      const { seasons: _s, accommodationTypes: _a, excludeAccommodationTypes: _e, isBase: _b, minDays: _mn, maxDays: _mx, ...item } = def;
      filteredItems.push(item);
      continue;
    }

    // Season filter
    const passesSeasonFilter =
      !def.seasons || def.seasons.includes(profile.season);

    if (!passesSeasonFilter) continue;

    // Accommodation type filter — exclusion takes priority
    const isExcluded =
      def.excludeAccommodationTypes?.includes(profile.accommodationType) ?? false;

    if (isExcluded) continue;

    const passesAccommodationFilter =
      !def.accommodationTypes ||
      def.accommodationTypes.includes(profile.accommodationType);

    if (!passesAccommodationFilter) continue;

    // Duration filter
    const passesDurationFilter =
      (def.minDays === undefined || profile.tripDurationDays >= def.minDays) &&
      (def.maxDays === undefined || profile.tripDurationDays <= def.maxDays);

    if (!passesDurationFilter) continue;

    // Item passed all filters — strip ItemDefinition-only fields before adding
    const { seasons: _s, accommodationTypes: _a, excludeAccommodationTypes: _e, isBase: _b, minDays: _mn, maxDays: _mx, ...item } = def;
    filteredItems.push(item);
  }

  return {
    items: filteredItems,
    generatedAt: new Date(),
  };
}
