// src/components/PlantRecipes.jsx
import React from "react";
import { allPlants } from "../data/plants"; 
import "./PlantRecipes.css";


// Auto-import all images in /assets/plants
const plantImages = import.meta.glob("../assets/plants/*.png", {
  eager: true,
  import: "default"
});

export default function PlantRecipes({ plants }) {
  return (
    <div className="plant-recipes">
      <h2>📖 Plant Recipes & Variants</h2>
      <div className="recipes-grid">
        {plants.map(plant => {
          // derive filename from plant.image (e.g. "flower4_pink.png")
          const filename = plant.image.split("/").pop();
          const imageSrc = plantImages[`../assets/plants/${filename}`];

          return (
            <div className="recipe-card" key={plant.id}>
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={plant.name}
                  style={{ width: "80px", height: "auto", marginBottom: "0.5rem" }}
                />
              )}
              <h4>{plant.name}</h4>
              <p>Rarity: {plant.rarity}</p>
              <p>Cost: {plant.cost} 💰</p>
              <p>Sell: {plant.sellValue} 💰</p>

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
                          desc = `${step.action}`;
                      }
                      return <li key={idx}>{desc}</li>;
                    })}
                  </ul>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
