import { useState } from "react";
import type { AccommodationType, TripProfile, TripProfileInput } from "../../types";
import { validateTripProfile } from "../../engine/validation";
import { detectSeason } from "../../engine/seasonDetection";

interface TripProfileFormProps {
  onSubmit: (profile: TripProfile) => void;
}

const ACCOMMODATION_TYPES: AccommodationType[] = [
  "Municipal Albergue",
  "Private Albergue",
  "Hostel",
  "Hotel",
];

export function TripProfileForm({ onSubmit }: TripProfileFormProps) {
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [accommodationType, setAccommodationType] =
    useState<AccommodationType | null>(null);

  // Field-level error messages — only populated after a submit attempt
  const [departureDateError, setDepartureDateError] = useState<string | null>(null);
  const [returnDateError, setReturnDateError] = useState<string | null>(null);
  const [accommodationTypeError, setAccommodationTypeError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const input: TripProfileInput = {
      departureDate,
      returnDate,
      accommodationType,
    };

    const result = validateTripProfile(input);

    if (!result.valid) {
      // Clear previous errors then apply new ones
      setDepartureDateError(null);
      setReturnDateError(null);
      setAccommodationTypeError(null);

      for (const error of result.errors) {
        if (error.field === "departureDate") {
          setDepartureDateError(error.message);
        } else if (error.field === "returnDate") {
          setReturnDateError(error.message);
        } else if (error.field === "accommodationType") {
          setAccommodationTypeError(error.message);
        }
      }
      return;
    }

    // Validation passed — construct the full TripProfile
    const departure = parseLocalDate(departureDate)!;
    const returnD = parseLocalDate(returnDate)!;
    const durationMs = returnD.getTime() - departure.getTime();
    const tripDurationDays = Math.round(durationMs / (1000 * 60 * 60 * 24));
    const season = detectSeason(departure);

    const profile: TripProfile = {
      departureDate: departure,
      returnDate: returnD,
      accommodationType: accommodationType!,
      season,
      tripDurationDays,
    };

    // Clear any stale errors before calling onSubmit
    setDepartureDateError(null);
    setReturnDateError(null);
    setAccommodationTypeError(null);

    onSubmit(profile);
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Trip profile form">
      <div>
        <label htmlFor="departureDate">Departure date</label>
        <input
          id="departureDate"
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          aria-describedby={departureDateError ? "departureDateError" : undefined}
          aria-invalid={departureDateError ? true : undefined}
        />
        {departureDateError && (
          <span id="departureDateError" role="alert">
            {departureDateError}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="returnDate">Return date</label>
        <input
          id="returnDate"
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          aria-describedby={returnDateError ? "returnDateError" : undefined}
          aria-invalid={returnDateError ? true : undefined}
        />
        {returnDateError && (
          <span id="returnDateError" role="alert">
            {returnDateError}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="accommodationType">Accommodation type</label>
        <select
          id="accommodationType"
          value={accommodationType ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            setAccommodationType(val === "" ? null : (val as AccommodationType));
          }}
          aria-describedby={accommodationTypeError ? "accommodationTypeError" : undefined}
          aria-invalid={accommodationTypeError ? true : undefined}
        >
          <option value="">Select accommodation type</option>
          {ACCOMMODATION_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {accommodationTypeError && (
          <span id="accommodationTypeError" role="alert">
            {accommodationTypeError}
          </span>
        )}
      </div>

      <button type="submit">Generate packing list</button>
    </form>
  );
}

/**
 * Parses a YYYY-MM-DD string into a local-time Date at midnight.
 * Returns null for empty or invalid strings.
 */
function parseLocalDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === "") return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}
