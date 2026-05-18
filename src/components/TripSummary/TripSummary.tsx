import type { Season, TripProfile } from "../../types";

interface TripSummaryProps {
  tripProfile: TripProfile;
  season: Season;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const SEASON_EMOJI: Record<Season, string> = {
  Spring: "🌸",
  Summer: "☀️",
  Autumn: "🍂",
  Winter: "❄️",
};

export function TripSummary({ tripProfile, season }: TripSummaryProps) {
  return (
    <section aria-label="Trip summary" className="trip-summary">
      <p className="trip-summary__title">Your trip</p>
      <dl className="trip-summary__grid">
        <div className="trip-summary__item">
          <dt>Departure</dt>
          <dd>{formatDate(tripProfile.departureDate)}</dd>
        </div>
        <div className="trip-summary__item">
          <dt>Return</dt>
          <dd>{formatDate(tripProfile.returnDate)}</dd>
        </div>
        <div className="trip-summary__item">
          <dt>Accommodation</dt>
          <dd>{tripProfile.accommodationType}</dd>
        </div>
        <div className="trip-summary__item">
          <dt>Season</dt>
          <dd>{SEASON_EMOJI[season]} {season}</dd>
        </div>
      </dl>
    </section>
  );
}
