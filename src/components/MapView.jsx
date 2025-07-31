// src/components/MapView.jsx
export default function MapView({ bloomCount, currentMap, onSelectMap }) {
  const maps = [
    { id: "meadow",    label: "Meadow",    unlockAt: 0 },
    { id: "grove",     label: "Grove",     unlockAt: 2 },
    { id: "cliffside", label: "Cliffside", unlockAt: 10 },
    { id: "greenhouse",label: "Greenhouse",unlockAt: 15 },
    { id: "cavern",    label: "Cavern",    unlockAt: 25 },
    { id: "lunar",     label: "Lunar Lake",unlockAt: 50 }
  ];

  return (
    <div>
      <ul className="map-list">
        {maps.map(m => {
          const locked = bloomCount < m.unlockAt;
          return (
            <li key={m.id}>
              <button
                className={`map-btn ${currentMap === m.id ? "active" : ""}`}
                disabled={locked}
                onClick={() => !locked && onSelectMap(m.id)}
              >
                {m.label}
              </button>
            </li>
          );
        })}
      </ul>
      {/* map art here once i have it */}
    </div>
  );
}
