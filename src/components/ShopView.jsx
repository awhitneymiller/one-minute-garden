import React, { useState } from "react";
import { allPlants } from "../data/plants";
import "./ShopView.css";

export default function ShopView({ inventory, setInventory, coins, setCoins }) {
  const [tab, setTab] = useState("seeds");

  const seedsForSale = allPlants.filter((plant) => plant.cost > 0);

  function buySeed(plant) {
    if (coins < plant.cost) {
      alert("Not enough coins!");
      return;
    }
    setCoins((c) => c - plant.cost);
    setInventory((inv) => [
      ...inv,
      { id: plant.id, name: plant.name, image: plant.image }
    ]);
    alert(`Bought ${plant.name} seed! 🌱`);
  }

  return (
    <div className="shop-view shop">
      <h2>🛍️ Garden Shop</h2>
      <p>You have {coins} coins.</p>

      {/* Tabs */}
      <div className="shop-tabs">
        <button
          className={tab === "seeds" ? "active" : ""}
          onClick={() => setTab("seeds")}
        >
          🌱 Seeds
        </button>
        <button
          className={tab === "upgrades" ? "active" : ""}
          onClick={() => setTab("upgrades")}
        >
          🎁 Upgrades
        </button>
      </div>

      {/* Seeds View */}
      {tab === "seeds" && (
        <div className="shop-grid">
          {seedsForSale.map((plant) => (
            <div key={plant.id} className="shop-item-card">
              <img src={plant.image} alt={plant.name} className="shop-img" />
              <h4>{plant.name}</h4>
              <p style={{ marginBottom: "0.25rem" }}>
                💰 {plant.cost} coins
              </p>
              <button
                onClick={() => buySeed(plant)}
                disabled={coins < plant.cost}
              >
                {coins >= plant.cost ? "Buy Seed" : "Not enough coins"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upgrades View */}
      {tab === "upgrades" && (
        <div className="shop-grid">
          <p>Upgrades coming soon!</p>
        </div>
      )}
    </div>
  );
}
