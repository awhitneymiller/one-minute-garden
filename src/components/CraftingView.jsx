// src/components/CraftingView.jsx
import React from "react";
import "./CraftingView.css"; // see CSS below

export default function CraftingView({ plantedPlants, onCraft }) {
  // Select wilted plants (stage===4 or mood==="wilted")
  const wilted = plantedPlants.filter(
    (p) => p.mood === "wilted" || p.stage === 4
  );

  return (
    <div className="crafting-view">
      <h2>🛠️ Crafting</h2>
      <p>Use your wilted plants to create compost.</p>

      {wilted.length === 0 ? (
        <p className="empty">No wilted plants available.</p>
      ) : (
        <div className="crafting-grid">
          {wilted.map((p) => (
            <div key={p.instanceId} className="crafting-card">
              <img src={p.image} alt={p.name} className="crafting-img" />
              <h4>{p.name}</h4>
              <button onClick={() => onCraft(p.instanceId)}>
                Craft 1 Compost
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
