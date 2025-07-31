// src/components/PlantCard.jsx
import React from "react";
import "./PlantCard.css";
import { allPlants } from "../data/plants";

// 🌱 Glob all the plant images
const plantImages = import.meta.glob("../assets/plants/*.png", {
  eager: true,
  import: "default"
});

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
  // Pull just the filename, e.g. "flower4_pink.png"
  const filename = image.split("/").pop();
  // Look up the actual imported URL
  const imgSrc = plantImages[`../assets/plants/${filename}`];

  const stageNames = ["Seed", "Sprout", "Growing", "Bloom"];
  const stageLabel = isWilted ? "Wilted" : stageNames[stage];

  return (
    <div className="plant-card-container">
      <h4>{name}</h4>
      {imgSrc ? (
        <img src={imgSrc} alt={name} className="plant-img" />
      ) : (
        <div className="plant-img placeholder">No image</div>
      )}

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

        {stage === 3 && !isWilted && (
          <button className="pill-button" onClick={() => onSell(instanceId)}>
            💰 Sell
          </button>
        )}
      </div>
    </div>
  );
}
