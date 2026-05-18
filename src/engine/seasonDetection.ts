import { Season } from "../types";

/**
 * Detects the season based on the departure date's month.
 *
 * Month mapping:
 *   March–May (3–5)       → Spring
 *   June–August (6–8)     → Summer
 *   September–November (9–11) → Autumn
 *   December–February (12, 1, 2) → Winter
 *
 * Season is always derived from the departure month only,
 * even if the trip spans two seasons.
 */
export function detectSeason(departureDate: Date): Season {
  const month = departureDate.getMonth() + 1; // getMonth() is 0-indexed

  if (month >= 3 && month <= 5) {
    return "Spring";
  } else if (month >= 6 && month <= 8) {
    return "Summer";
  } else if (month >= 9 && month <= 11) {
    return "Autumn";
  } else {
    // month 12, 1, or 2
    return "Winter";
  }
}
