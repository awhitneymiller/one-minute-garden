// src/components/PlantRecipes.jsx
import React from "react";
import "./PlantRecipes.css";

export default function PlantRecipes({ plants }) {
  return (
    <div className="plant-recipes">
      <h2>📖 Plant Recipes & Variants</h2>
      <div className="recipes-grid">
        {plants.map((plant) => (
          <div className="recipe-card" key={plant.id}>
            <img
              src={plant.image}
              alt={plant.name}
              className="recipe-img"
            />
            <h4>{plant.name}</h4>
            <p>💰 Cost: {plant.cost}</p>
            <p>💰 Sell: {plant.sellValue}</p>
            {plant.rarity && <p>⭐ Rarity: {plant.rarity}</p>}

            {plant.growthRecipe && (
              <>
                <p><strong>Growth Recipe:</strong></p>
                <ul className="recipe-steps">
                  {plant.growthRecipe.map((step, idx) => {
                    let desc = "";
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
                    return <li key={idx}>{desc}</li>;
                  })}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
