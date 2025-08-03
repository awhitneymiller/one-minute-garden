// src/components/MapView.jsx
import React from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import "./MapView.css";

export default function MapView({
  bloomCount,
  coins,
  setCoins,
  currentMap,
  onSelectMap,
  unlockedMaps,
  setUnlockedMaps
}) {
  const maps = [
    { id: "meadow",     label: "Meadow",      reqBlooms: 0,  reqCoins: 0  },
    { id: "grove",      label: "Grove",       reqBlooms: 2,  reqCoins: 0  },
    { id: "cliffside",  label: "Cliffside",   reqBlooms: 10, reqCoins: 40 },
    { id: "greenhouse", label: "Greenhouse",  reqBlooms: 15, reqCoins: 50 },
    { id: "cavern",     label: "Cavern",      reqBlooms: 25, reqCoins: 75 },
    { id: "lunar",      label: "Lunar Lake",  reqBlooms: 50, reqCoins: 100 }
  ];

  async function trySelect(m) {
    console.log("Trying to select", m.id, "blooms:", bloomCount, "/", m.reqBlooms, "coins:", coins, "/", m.reqCoins);
    const hasBlooms       = bloomCount >= m.reqBlooms;
    const hasCoins        = coins >= m.reqCoins;
    const alreadyUnlocked = unlockedMaps.includes(m.id);

    if (!hasBlooms || !hasCoins) {
      console.warn("Can't unlock:", m.id, { hasBlooms, hasCoins });
      return;
    }

    if (!alreadyUnlocked && m.reqCoins > 0) {
      setCoins(c => c - m.reqCoins);
      const updated = [...unlockedMaps, m.id];
      setUnlockedMaps(updated);
      const ref = doc(db, "users", auth.currentUser.uid);
      await updateDoc(ref, { unlockedMaps: updated });
    }

    onSelectMap(m.id);
  }

  return (
    <div className="map-view">
      <div className="map-tabs">
        {maps.map(m => {
          const unlocked   = unlockedMaps.includes(m.id);
          const affordable = coins >= m.reqCoins;
          const isActive   = currentMap === m.id;

          return (
            <div key={m.id} className={`map-tab ${isActive ? "active" : ""}`}>
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
                disabled={!unlocked && !affordable}
                onClick={() => trySelect(m)}
              >
                {isActive
                  ? "Current Map"
                  : unlocked
                    ? `Go to ${m.label}`
                    : affordable
                      ? "Unlock"
                      : "Locked"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="map-image-wrapper">
        <img
          src={`${import.meta.env.BASE_URL}gardenmap.png`}
          alt="Garden world map"
          className="map-image"
        />
      </div>
    </div>
  );
}
