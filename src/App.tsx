import { useState } from "react";
import type { PackingList, TripProfile } from "./types";
import { generatePackingList } from "./engine/recommendationEngine";
import { TripProfileForm } from "./components/TripProfileForm/TripProfileForm";
import { PackingListView } from "./components/PackingListView/PackingListView";

function App() {
  const [tripProfile, setTripProfile] = useState<TripProfile | null>(null);
  const [packingList, setPackingList] = useState<PackingList | null>(null);

  function handleFormSubmit(profile: TripProfile) {
    const list = generatePackingList(profile);
    setTripProfile(profile);
    setPackingList(list);
  }

  function handleReset() {
    setTripProfile(null);
    setPackingList(null);
  }

  return (
    <div className="page-wrapper">
      <header className="app-header">
        <p className="app-header__eyebrow">Buen Camino</p>
        <h1 className="app-header__title">Camino Packing List</h1>
        <p className="app-header__subtitle">
          Enter your trip details to get a personalised gear list
        </p>
      </header>

      {tripProfile === null || packingList === null ? (
        <TripProfileForm onSubmit={handleFormSubmit} />
      ) : (
        <PackingListView
          packingList={packingList}
          tripProfile={tripProfile}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;
