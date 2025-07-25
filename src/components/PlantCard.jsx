import React from "react";

const moodEmoji = {
  happy: "😊",
  thirsty: "💧",
  sleepy: "😴",
  lonely: "🥺",
  radiant: "🌟",
  default: "🙂"
};

export default function PlantCard({
  plant,
  onWater,
  onFertilize,
  onSell
}) {
  const stageNames = ["Seed", "Sprout", "Bud", "Bloom"];
  const stagePercent = (plant.stage / 3) * 100;
  const water = plant.waterLevel ?? 100;
  const mood = plant.mood || "happy";

  const imagePath = `/assets/plants/${plant.name
    .toLowerCase()
    .replace(/\s+/g, "")}.png`;

  return (
    <div className="plant-card">
      <h4>{plant.name}</h4>
      <p>Stage: {stageNames[plant.stage]}</p>
      <p>Mood: {moodEmoji[mood] || moodEmoji.default}</p>

      <img
        src={imagePath}
        alt={plant.name}
        className="plant-img"
        onError={(e) => (e.target.style.display = "none")}
      />

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
          style={{ width: `${Math.min(100, stagePercent)}%` }}
        />
      </div>

      <button onClick={() => onWater(plant.instanceId)}>💦 Water</button>
      <button onClick={() => onFertilize(plant.instanceId)}>🌿 Fertilize</button>
      {plant.stage === 3 && (
        <button onClick={() => onSell(plant.instanceId)}>💰 Sell</button>
      )}
    </div>
  );
}