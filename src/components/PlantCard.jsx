// src/components/PlantCard.jsx
import React from "react";

const moodEmoji = {
  happy: "😊",
  thirsty: "💧",
  sleepy: "😴",
  lonely: "🥺",
  radiant: "🌟",
  default: "🙂",
};

export default function PlantCard({ plant, onWater, onFertilize, onSell }) {
  const stageNames = ["Seed", "Sprout", "Bud", "Bloom"];
  const stagePercent = (plant.stage / 3) * 100;
  const water = plant.waterLevel ?? 100;
  const imagePath = `/assets/plants/${plant.name.replace(/\s+/g, "").toLowerCase()}.png`;
  const mood = plant.mood || "happy";

  return (
    <div className="plant-card">
      <h4>{plant.name}</h4>
      <p>Stage: {stageNames[plant.stage]}</p>
      <p>Mood: {moodEmoji[mood] || moodEmoji.default}</p>

      {plant.stage === 3 ? (
        <img src={imagePath} alt={plant.name} className="plant-img" />
      ) : (
        <div className="placeholder">{stageNames[plant.stage]}</div>
      )}

      <div className="meter-label">💧 Water</div>
      <div className="meter-bar">
        <div className="meter-fill water" style={{ width: `${Math.round(water)}%` }} />
      </div>

      <div className="meter-label">🌱 Growth</div>
      <div className="meter-bar">
        <div className="meter-fill growth" style={{ width: `${stagePercent}%` }} />
      </div>

      <button onClick={() => onWater(plant)}>💦 Water</button>
      <button onClick={() => onFertilize(plant)}>🌿 Fertilize</button>
      {plant.stage === 3 && <button onClick={() => onSell(plant)}>💰 Sell</button>}
    </div>
  );
}
