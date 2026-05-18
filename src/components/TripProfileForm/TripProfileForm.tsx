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

    setDepartureDateError(null);
    setReturnDateError(null);
    setAccommodationTypeError(null);

    onSubmit(profile);
  }

  return (
    <div className="card">
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Trip profile form"
        className="form-card"
      >
        {/* Departure date */}
        <div className="form-field">
          <label htmlFor="departureDate" className="form-label">
            Departure date
          </label>
          <input
            id="departureDate"
            type="date"
            className="form-input"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            aria-describedby={departureDateError ? "departureDateError" : undefined}
            aria-invalid={departureDateError ? true : undefined}
          />
          {departureDateError && (
            <span id="departureDateError" role="alert" className="form-error">
              {departureDateError}
            </span>
          )}
        </div>

        {/* Return date */}
        <div className="form-field">
          <label htmlFor="returnDate" className="form-label">
            Return date
          </label>
          <input
            id="returnDate"
            type="date"
            className="form-input"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            aria-describedby={returnDateError ? "returnDateError" : undefined}
            aria-invalid={returnDateError ? true : undefined}
          />
          {returnDateError && (
            <span id="returnDateError" role="alert" className="form-error">
              {returnDateError}
            </span>
          )}
        </div>

        {/* Accommodation type */}
        <div className="form-field">
          <label htmlFor="accommodationType" className="form-label">
            Accommodation type
          </label>
          <select
            id="accommodationType"
            className="form-select"
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
            <span id="accommodationTypeError" role="alert" className="form-error">
              {accommodationTypeError}
            </span>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Generate packing list →
        </button>
      </form>
    </div>
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
