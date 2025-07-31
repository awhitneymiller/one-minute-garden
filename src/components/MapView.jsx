// src/components/MapView.jsx
export default function MapView({ bloomCount, currentMap, onSelectMap }) {
  const regions = [
    { id: "meadow",    name: "Meadow",    required: 0 },
    { id: "grove",     name: "Grove",     required: 2 },
    { id: "cliffside", name: "Cliffside", required: 5 },
    { id: "greenhouse",name: "Greenhouse",required: 10 },
    { id: "cavern",    name: "Crystal Cavern", required: 15 },
    { id: "lunar",     name: "Lunar Lake",    required: 20 }
  ];

  return (
    <div className="panel map-selector">
      <h3>🗺️ World Map</h3>
      <ul className="map-list">
        {regions.map(r => {
          const unlocked = bloomCount >= r.required;
          return (
            <li key={r.id}>
              <button
                className={`map-btn ${currentMap === r.id ? "active" : ""}`}
                disabled={!unlocked}
                onClick={() => unlocked && onSelectMap(r.id)}
              >
                {r.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
