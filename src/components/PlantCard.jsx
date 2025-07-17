import { useState } from "react";
import WaterMiniGame from "./WaterMiniGame";

export default function PlantCard({
  plant,
  onWater,
  onFertilize,
  sessionActive
}) {
  const [gameActive, setGameActive] = useState(false);

  const handleWaterClick = () => {
    if (!sessionActive || plant.watered) return;
    setGameActive(true);
  };

  const onGameComplete = rt => {
    setGameActive(false);
    onWater(plant.id, rt);
  };

  return (
    <div className="card">
      <div className="emoji">
        {["🌱", "🌿", "🌸", "🌼"][plant.stage]}
      </div>
      <h4>{plant.name}</h4>
      <p>Stage: {["Seedling","Sprout","Bud","Bloom"][plant.stage]}</p>
      <p>
        Watered: {plant.water} Fertilized: {plant.fertilize}
      </p>

      {gameActive ? (
        <WaterMiniGame onComplete={onGameComplete} />
      ) : (
        <div className="actions">
          <button
            disabled={!sessionActive || plant.watered}
            onClick={handleWaterClick}
          >
            💧 Water
          </button>
          <button
            disabled={!sessionActive || plant.fertilized}
            onClick={() => onFertilize(plant.id)}
          >
            🌱 Fertilize
          </button>
        </div>
      )}
    </div>
  );
}
