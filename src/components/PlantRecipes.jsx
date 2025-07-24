import React from "react";

// Auto-import all images from /assets/plants
const plantImages = import.meta.glob("../assets/plants/*.png", {
  eager: true,
  import: "default"
});

export default function PlantRecipes({ plants }) {
  return (
    <div className="plant-recipes">
      <h2>📖 Plant Recipes & Variants</h2>
      <div className="recipes-grid">
        {plants.map((plant) => {
          const imageKey = `../assets/plants/${plant.type}_${plant.variant}.png`;
          const imageSrc = plantImages[imageKey];

          return (
            <div className="recipe-card" key={plant.id}>
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={plant.name}
                  style={{ width: "80px", height: "auto" }}
                />
              )}
              <h4>{plant.name}</h4>
              <p>Type: {plant.type}</p>
              <p>Variant: {plant.variant}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
