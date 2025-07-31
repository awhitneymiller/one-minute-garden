// src/components/PlantCard.jsx
import React from "react";
import "./PlantCard.css";

export default function PlantCard({
  plant,
  onWater,
  onFertilize,         // standard fertilizer (mini-game)
  onPremiumFertilize,  // instant premium fertilizer
  onCompost,           // instant compost
  onSell,
  onRevive,
  onRemove,
  hasPremium,
  hasCompost
}) {
  const { instanceId, id, name, image, stage, waterLevel, mood } = plant;
  const isWilted = mood === "wilted";

  // Display-friendly stage name
  const stageNames = ["Seed", "Sprout", "Growing", "Bloom"];
  const stageLabel = isWilted ? "Wilted" : stageNames[stage];

  return (
    <div className="plant-card-container">
      <h4>{name}</h4>
      <img src={image} alt={name} className="plant-img" />

      <p><strong>Stage:</strong> {stageLabel}</p>
      <p><strong>Mood:</strong> {isWilted ? "😢" : "😊"}</p>

      {/* Hydration Meter */}
      <div className="meter-label">💧 Water</div>
      <div className="meter-bar">
        <div
          className="meter-fill water"
          style={{ width: `${waterLevel}%` }}
        />
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        {/* Standard Water */}
        {!isWilted && (
          <button onClick={() => onWater(instanceId)}>
            💧 Water
          </button>
        )}

        {/* Standard Fertilizer */}
        {!isWilted && stage < 3 && (
          <button onClick={() => onFertilize(instanceId)}>
            🌱 Fertilize
          </button>
        )}

        {/* Premium Fertilizer */}
        {!isWilted && stage < 3 && hasPremium > 0 && (
          <button onClick={() => onPremiumFertilize(instanceId)}>
            🥇 Premium
          </button>
        )}

        {/* Compost */}
        {!isWilted && stage < 3 && hasCompost > 0 && (
          <button onClick={() => onCompost(instanceId)}>
            🍂 Compost
          </button>
        )}

        {/* Revive Wilted */}
        {isWilted && (
          <button onClick={() => onRevive(instanceId)}>
            ✨ Revive
          </button>
        )}

        {/* Sell or Remove */}
        {stage === 3 && !isWilted && (
          <button onClick={() => onSell(instanceId)}>
            💰 Sell
          </button>
        )}
        {isWilted && (
          <button onClick={() => onRemove(instanceId)}>
            🗑️ Remove
          </button>
        )}
      </div>
    </div>
  );
}
