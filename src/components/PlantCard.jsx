// src/components/PlantCard.jsx
import React from "react";
import "./PlantCard.css";
import { allPlants } from "../data/plants";

// Find the next recipe step (used for validation elsewhere)
function getRecipeStep(plant) {
  const def = allPlants.find(p => p.id === plant.id);
  return def?.growthRecipe?.[plant.stage];
}

export default function PlantCard({
  plant,
  onWater,
  onFertilize,
  onPremiumFertilize,
  onCompost,
  onSell,
  onRevive,
  onCraft,
  onWeatherAction,
  hasPremium,
  hasCompost
}) {
  const { instanceId, name, image, stage, waterLevel, mood } = plant;
  const isWilted = mood === "wilted";
  const step     = getRecipeStep(plant);

  const stageNames = ["Seed", "Sprout", "Growing", "Bloom"];
  const stageLabel = isWilted ? "Wilted" : stageNames[stage];

  return (
    <div className="plant-card-container">
      <h4>{name}</h4>

      {/* now image is a full URL from data/plants.js */}
      <img src={image} alt={name} className="plant-img" />

      <p><strong>Stage:</strong> {stageLabel}</p>
      <p><strong>Mood:</strong> {isWilted ? "😢" : "😊"}</p>

      <div className="meter-label">💧 Water</div>
      <div className="meter-bar">
        <div
          className="meter-fill water"
          style={{ width: `${waterLevel}%` }}
        />
      </div>

      <div className="action-buttons">
        {/* growing stages */}
        {!isWilted && stage < 3 && (
          <>
            <button className="pill-button" onClick={() => onWater(instanceId)}>
              Water
            </button>
            <button className="pill-button" onClick={() => onFertilize(instanceId)}>
              Fertilize
            </button>
            {hasPremium > 0 && (
              <button className="pill-button" onClick={() => onPremiumFertilize(instanceId)}>
                🥇 Premium
              </button>
            )}
            {hasCompost > 0 && (
              <button className="pill-button" onClick={() => onCompost(instanceId)}>
                🍂 Compost
              </button>
            )}
            <button className="pill-button" onClick={() => onWeatherAction(instanceId)}>
              Weather
            </button>
          </>
        )}

        {/* wilted */}
        {isWilted && (
          <>
            <button className="pill-button" onClick={() => onRevive(instanceId)}>
              ✨ Revive
            </button>
            <button className="pill-button" onClick={() => onCraft(instanceId)}>
              🍂 Turn into Compost
            </button>
          </>
        )}

        {/* fully bloomed */}
        {stage === 3 && !isWilted && (
          <button className="pill-button" onClick={() => onSell(instanceId)}>
            💰 Sell
          </button>
        )}
      </div>
    </div>
  );
}
