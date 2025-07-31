// src/components/MapView.jsx
import React from "react";
import "./MapView.css";

export default function MapView({
  bloomCount,
  coins,
  setCoins,
  currentMap,
  onSelectMap
}) {
  const maps = [
    { id: "meadow",     label: "Meadow",      reqBlooms: 0,  reqCoins: 0  },
    { id: "grove",      label: "Grove",       reqBlooms: 2,  reqCoins: 0  },
    { id: "cliffside",  label: "Cliffside",   reqBlooms: 10, reqCoins: 40 },
    { id: "greenhouse", label: "Greenhouse",  reqBlooms: 15, reqCoins: 50 },
    { id: "cavern",     label: "Cavern",      reqBlooms: 25, reqCoins: 75 },
    { id: "lunar",      label: "Lunar Lake",  reqBlooms: 50, reqCoins: 100}
  ];

  function trySelect(m) {
    const meetsBlooms = bloomCount >= m.reqBlooms;
    const meetsCoins  = coins     >= m.reqCoins;
    if (!meetsBlooms || !meetsCoins) return;

    // charge coins if needed
    if (m.reqCoins > 0) setCoins(c => c - m.reqCoins);
    onSelectMap(m.id);
  }

  return (
    <div className="map-view">
      <div className="map-tabs">
        {maps.map(m => {
          const unlocked    = bloomCount >= m.reqBlooms;
          const affordable  = coins     >= m.reqCoins;
          const isActive    = currentMap === m.id;

          return (
            <div
              key={m.id}
              className={`map-tab ${isActive ? "active" : ""}`}
            >
              <h3>{m.label}</h3>
              {unlocked ? (
                <p className="unlocked">Unlocked!</p>
              ) : (
                <p className="locked">
                  Needs 🌼 {m.reqBlooms}
                  {m.reqCoins > 0 && ` & 💰 ${m.reqCoins}`}
                </p>
              )}
              <button
                className="pill-button"
                disabled={!unlocked || !affordable}
                onClick={() => trySelect(m)}
              >
                {isActive
                  ? "Current Map"
                  : unlocked
                    ? `Go to ${m.label}`
                    : `Locked`}
              </button>
            </div>
          );
        })}
      </div>
      {/* … your map graphic here … */}
    </div>
  );
}
