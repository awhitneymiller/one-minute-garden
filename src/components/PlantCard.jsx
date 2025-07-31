// src/components/PlantCard.jsx
import React from "react";
import "./PlantCard.css";
import { allPlants } from "../data/plants";

function getRecipeStep(plant) {
  const def = allPlants.find(p => p.id === plant.id);
  return def?.growthRecipe?.[plant.stage];
}

export default function PlantCard({
  plant,
  onWater,
  onFertilize,         // standard fertilizer (mini-game)
  onPremiumFertilize,  // instant premium fertilizer
  onCompost,           // instant compost
  onSell,
  onRevive,
  onRemove,
  onWeatherAction,     // ← add this
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
          <button className="pill-button" onClick={() => onWater(plant.instanceId)}>Water</button>
        )}

        {/* Standard Fertilizer */}
        {!isWilted && stage < 3 && (
          <button className="pill-button" onClick={() => onFertilize(plant.instanceId)}>Fertilize</button>
        )}

        {/* Premium Fertilizer */}
        {!isWilted && stage < 3 && hasPremium > 0 && (
          <button className="pill-button" onClick={() => onPremiumFertilize(plant.instanceId)}>🥇 Premium Fertilizer</button>
        )}

        {/* Compost */}
        {!isWilted && stage < 3 && hasCompost > 0 && (
          <button className="pill-button" onClick={() => onCompost(plant.instanceId)}>🍂 Compost</button>
        )}

        {/* Revive Wilted */}
        {isWilted && (
          <button className="pill-button" onClick={() => onRevive(plant.instanceId)}>✨ Revive</button>
        )}

        {/* Sell or Remove */}
        {stage === 3 && !isWilted && (
          <button className="pill-button" onClick={() => onSell(plant.instanceId)}>💰 Sell</button>
        )}
        {isWilted && (
          <button className="pill-button" onClick={() => onRevive(plant.instanceId)}>✨ Revive</button>
        )}

        {/* Weather‐trigger step */}
        {!isWilted && getRecipeStep(plant)?.action === "weather" && (
          <button
            className="pill-button"
            onClick={() => onWeatherAction(instanceId)}
          >
            Wait for {getRecipeStep(plant).condition}
          </button>
        )}

      </div>
    </div>
  );
}
