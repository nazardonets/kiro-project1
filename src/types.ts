// Accommodation types supported by the app
export type AccommodationType =
  | "Municipal Albergue"
  | "Private Albergue"
  | "Hostel"
  | "Hotel";

// Seasons derived from departure month
export type Season = "Spring" | "Summer" | "Autumn" | "Winter";

// Item categories
export type Category =
  | "Clothing"
  | "Footwear"
  | "Sleeping"
  | "Toiletries"
  | "Documents"
  | "Electronics"
  | "First Aid";

// A single packing item
export interface Item {
  id: string;
  name: string;
  category: Category;
  note?: string; // max 60 characters
}

// The user's trip inputs (raw form values before validation)
export interface TripProfileInput {
  departureDate: string; // ISO date string from form
  returnDate: string; // ISO date string from form
  accommodationType: AccommodationType | null;
}

// Validated trip profile used by the recommendation engine
export interface TripProfile {
  departureDate: Date;
  returnDate: Date;
  accommodationType: AccommodationType;
  season: Season; // derived by the engine
  tripDurationDays: number;
}

// The generated packing list
export interface PackingList {
  items: Item[];
  generatedAt: Date;
}

// Validation result from validateTripProfile
export interface ValidationResult {
  valid: boolean;
  errors: FieldError[];
}

export interface FieldError {
  field: "departureDate" | "returnDate" | "accommodationType";
  message: string;
}

// Extended item definition used in the static item database
export interface ItemDefinition extends Item {
  seasons?: Season[];
  accommodationTypes?: AccommodationType[];
  excludeAccommodationTypes?: AccommodationType[];
  isBase?: boolean; // always included regardless of season/accommodation
}
