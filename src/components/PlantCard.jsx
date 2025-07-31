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
  onFertilize,
  onPremiumFertilize,
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
      <img src={image} alt={name} className="plant-img" />

      <p><strong>Stage:</strong> {stageLabel}</p>
      <p><strong>Mood:</strong> {isWilted ? "😢" : "😊"}</p>

      <div className="meter-label">💧 Water</div>
      <div className="meter-bar">
        <div className="meter-fill water" style={{ width: `${waterLevel}%` }} />
      </div>

      <div className="action-buttons">
  {/* 1) Growing plants (stage 0–2) always show all care buttons */}
  {!isWilted && stage < 3 && (
    <>
      {/* Standard watering */}
      <button
        className="pill-button"
        onClick={() => onWater(instanceId)}
      >
        Water
      </button>

      {/* Standard fertilizer */}
      <button
        className="pill-button"
        onClick={() => onFertilize(instanceId)}
      >
        Fertilize
      </button>

      {/* Premium fertilizer (only if they have one) */}
      {hasPremium > 0 && (
        <button
          className="pill-button"
          onClick={() => onPremiumFertilize(instanceId)}
        >
          🥇 Premium
        </button>
      )}

      {/* Compost (only if they have one) */}
      {hasCompost > 0 && (
        <button
          className="pill-button"
          onClick={() => onCompost(instanceId)}
        >
          🍂 Compost
        </button>
      )}

      {/* Weather‐trigger (always visible for growing plants) */}
      <button
        className="pill-button"
        onClick={() => onWeatherAction(instanceId)}
      >
        Weather
      </button>
    </>
  )}

  {/* 2) Wilted plants: Revive or turn into compost */}
  {isWilted && (
    <>
      <button
        className="pill-button"
        onClick={() => onRevive(instanceId)}
      >
        ✨ Revive
      </button>
      <button
        className="pill-button"
        onClick={() => onCraft(instanceId)}
      >
        🍂 Turn into Compost
      </button>
    </>
  )}

  {/* 3) Fully bloomed plants: Sell */}
  {stage === 3 && !isWilted && (
    <button
      className="pill-button"
      onClick={() => onSell(instanceId)}
    >
      💰 Sell
    </button>
  )}
</div>

    </div>
  );
}
