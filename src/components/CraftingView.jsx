// src/components/CraftingView.jsx
import React from "react";
import "./CraftingView.css";  // assume you have some basic styles

export default function CraftingView({ plantedPlants, onCraft }) {
  // only wilted
  const wiltedPlants = plantedPlants.filter(p => p.mood === "wilted");

  return (
    <div className="crafting single-pane">
      <h2>🍂 Compost Workshop</h2>
      {wiltedPlants.length === 0 ? (
        <p className="empty">No wilted plants to turn into compost.</p>
      ) : (
        <div className="craft-grid">
          {wiltedPlants.map(p => (
            <div key={p.instanceId} className="craft-card">
              <img src={p.image} alt={p.name} className="craft-img"/>
              <h4>{p.name}</h4>
              <button
                className="pill-button"
                onClick={() => onCraft(p.instanceId)}
              >
                Turn into Compost 🍂
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
