import React, { useState } from "react";

export default function Shop({ allPlants, coins, onBuy }) {
  const [tab, setTab] = useState("seeds");

  const seedItems = allPlants.slice(3).map((plant) => ({
    id: plant.id,
    name: plant.name,
    cost: 10
  }));

  const upgrades = [
    { id: "decor1", name: "Garden Gnome", cost: 20 },
    { id: "buff1", name: "Fertilizer Pack", cost: 30 },
    { id: "buff2", name: "Sun Crystal", cost: 25 }
  ];

  return (
    <div className="shop">
      <h2>🛍️ Garden Shop</h2>
      <p>Coins: {coins}</p>
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

      {tab === "seeds" && (
        <div className="shop-grid">
          {seedItems.map((item) => (
            <div key={item.id} className="shop-item">
              <h4>{item.name}</h4>
              <p>💰 {item.cost} coins</p>
              <button
                onClick={() => onBuy(item)}
                disabled={coins < item.cost}
              >
                {coins >= item.cost ? "Buy" : "Not enough coins"}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "upgrades" && (
        <div className="shop-grid">
          {upgrades.map((item) => (
            <div key={item.id} className="shop-item">
              <h4>{item.name}</h4>
              <p>💰 {item.cost} coins</p>
              <button disabled>Coming Soon</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
