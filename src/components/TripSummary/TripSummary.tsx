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

export function TripSummary({ tripProfile, season }: TripSummaryProps) {
  return (
    <section aria-label="Trip summary">
      <dl>
        <div>
          <dt>Departure date</dt>
          <dd>{formatDate(tripProfile.departureDate)}</dd>
        </div>
        <div>
          <dt>Return date</dt>
          <dd>{formatDate(tripProfile.returnDate)}</dd>
        </div>
        <div>
          <dt>Accommodation type</dt>
          <dd>{tripProfile.accommodationType}</dd>
        </div>
        <div>
          <dt>Season</dt>
          <dd>{season}</dd>
        </div>
      </dl>
    </section>
  );
}
