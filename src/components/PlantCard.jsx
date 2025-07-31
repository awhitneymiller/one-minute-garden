// src/components/PlantCard.jsx
import React from "react";

const moodEmoji = {
  happy: "😊",
  thirsty: "💧",
  sleepy: "😴",
  lonely: "🥺",
  radiant: "🌟",
  wilted: "🥀",
  default: "🙂"
};

export default function PlantCard({
  plant,
  onWater,
  onFertilize,
  onPremiumFertilize,
  onSell,
  onRevive,
  onRemove,
  hasPremium
}) {
  const stageNames = ["Seed", "Sprout", "Bud", "Bloom", "Wilted"];
  const water = plant.waterLevel ?? 100;
  const mood = plant.mood || "happy";

  // Use image if available, else fallback
  const baseImage = plant.image || `/assets/plants/${plant.type}-${plant.variant}.png`;

  return (
    <div className="plant-card-container">
      <div className="plant-card">
        <h4 style={{ marginBottom: "0.25rem" }}>{plant.name}</h4>
        <img src={baseImage} alt={plant.name} className="plant-img" />
        <p>Stage: {stageNames[plant.stage]}</p>
        <p>Mood: {moodEmoji[mood] || moodEmoji.default}</p>

        <div className="meter-label">💧 Water</div>
        <div className="meter-bar">
          <div
            className="meter-fill water"
            style={{ width: `${Math.max(0, Math.min(100, water))}%` }}
          />
        </div>

        <div className="meter-label">🌱 Growth</div>
        <div className="meter-bar">
          <div
            className="meter-fill growth"
            style={{ width: `${(plant.stage / 3) * 100}%` }}
          />
        </div>

        {/* Action Buttons */}
        {plant.stage !== 4 ? (
          <>
            <button onClick={() => onWater(plant.instanceId)}>💦 Water</button>
            {plant.stage < 3 && (
              <>
                <button onClick={() => onFertilize(plant.instanceId)}>🌿 Fertilize</button>
                {hasPremium && (
                  <button onClick={() => onPremiumFertilize(plant.instanceId)}>✨ Premium</button>
                )}
              </>
            )}
            {plant.stage === 3 && (
              <button onClick={() => onSell(plant.instanceId)}>💰 Sell</button>
            )}
          </>
        ) : (
          <>
            <p style={{ color: "#6b7280", fontStyle: "italic", margin: "0.5rem 0" }}>
              This plant has wilted.
            </p>
            <button onClick={() => onRevive(plant.instanceId)}>✨ Revive</button>
            <button onClick={() => onRemove(plant.instanceId)}>🗑️ Remove</button>
          </>
        )}
      </div>
    </div>
  );
}
