import React from "react";
import "./PlantCard.css";
import { allPlants } from "../data/plants";

function getFullRecipe(plant) {
  const def = allPlants.find(p => p.id === plant.id);
  return def?.growthRecipe?.map((step, i) => {
    let desc;
    switch (step.action) {
      case "water":
        desc = `Water (${step.minAccuracy || "normal"})`;
        break;
      case "fertilize":
        if (step.type === "standard") desc = "Standard Fertilize";
        else if (step.type === "premium") desc = "Premium Fertilize";
        else if (step.type === "compost") desc = "Compost";
        break;
      case "weather":
        desc = `Wait for ${step.condition}`;
        break;
      default:
        desc = step.action;
    }
    return <li key={i}>{desc}</li>;
  }) || [];
}

export default function PlantCard({
  plant,
  weather,
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
  const recipe = getFullRecipe(plant);
  const def = allPlants.find(p => p.id === plant.id);
  const nextStep = def?.growthRecipe?.[stage];
  const weatherReady = nextStep?.action === "weather" && nextStep.condition === weather;

  return (
    <div className="plant-card-container">
      <h4>{name}</h4>

      <div className="img-wrapper">
        <img src={image} alt={name} className="plant-img" />
        <div className="recipe-overlay">
          <h5>Growth Recipe</h5>
          <ul>
            {recipe}
          </ul>
        </div>
      </div>

      <p>
        <strong>Stage:</strong>{" "}
        {isWilted
          ? "Wilted"
          : ["Seed", "Sprout", "Growing", "Bloom"][stage]}
      </p>
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

            <button
              className={`pill-button weather-button${weatherReady ? " ready" : ""}`}
              onClick={() => onWeatherAction(instanceId)}
            >
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
