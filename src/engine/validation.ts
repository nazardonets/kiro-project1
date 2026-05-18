import type {
  TripProfileInput,
  ValidationResult,
  FieldError,
  AccommodationType,
} from "../types";

const VALID_ACCOMMODATION_TYPES: AccommodationType[] = [
  "Municipal Albergue",
  "Private Albergue",
  "Hostel",
  "Hotel",
];

const MAX_TRIP_DURATION_DAYS = 90;

/**
 * Returns a Date representing today at midnight (start of day) in local time,
 * so that a departure date of today is considered valid (not in the past).
 */
function todayMidnight(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Parses an ISO date string (YYYY-MM-DD) into a local-time Date at midnight.
 * Returns null if the string is empty or not a valid date.
 */
function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === "") return null;
  // Parse as local date to avoid UTC offset issues with date-only strings
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return null;
  const d = new Date(year, month - 1, day);
  // Verify the parsed values match (guards against e.g. Feb 30)
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    return null;
  }
  return d;
}

/**
 * Validates a TripProfileInput and returns a ValidationResult with field-level errors.
 * Multiple errors can be returned simultaneously.
 */
export function validateTripProfile(
  profile: TripProfileInput
): ValidationResult {
  const errors: FieldError[] = [];

  const departureMissing =
    !profile.departureDate || profile.departureDate.trim() === "";
  const returnMissing =
    !profile.returnDate || profile.returnDate.trim() === "";

  // 1. Departure date missing
  if (departureMissing) {
    errors.push({
      field: "departureDate",
      message: "Please enter a departure date.",
    });
  }

  // 2. Return date missing
  if (returnMissing) {
    errors.push({
      field: "returnDate",
      message: "Please enter a return date.",
    });
  }

  // 3. Accommodation type missing or invalid
  if (
    profile.accommodationType === null ||
    profile.accommodationType === undefined ||
    !VALID_ACCOMMODATION_TYPES.includes(profile.accommodationType)
  ) {
    errors.push({
      field: "accommodationType",
      message: "Please select an accommodation type.",
    });
  }

  // Date-dependent validations — only run when both dates are present
  if (!departureMissing && !returnMissing) {
    const departureDate = parseDate(profile.departureDate);
    const returnDate = parseDate(profile.returnDate);

    if (departureDate !== null) {
      const today = todayMidnight();

      // 4. Departure date in the past
      if (departureDate < today) {
        errors.push({
          field: "departureDate",
          message: "Departure date must be today or in the future.",
        });
      } else if (returnDate !== null) {
        // 5. Departure date >= return date (only check if departure is not already in the past)
        if (departureDate >= returnDate) {
          errors.push({
            field: "departureDate",
            message: "Departure date must be before the return date.",
          });
        } else {
          // 6. Trip duration > 90 days (only check when departure < return)
          const durationMs = returnDate.getTime() - departureDate.getTime();
          const durationDays = Math.round(durationMs / (1000 * 60 * 60 * 24));
          if (durationDays > MAX_TRIP_DURATION_DAYS) {
            errors.push({
              field: "returnDate",
              message: "Trip duration cannot exceed 90 days.",
            });
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
