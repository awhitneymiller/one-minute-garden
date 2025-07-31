// src/components/ShopView.jsx
import React, { useState } from "react";
import { allPlants } from "../data/plants";
import "./ShopView.css";

export default function ShopView({
  inventory,
  setInventory,
  coins,
  setCoins,
  items,
  setItems
}) {
  const [tab, setTab] = useState("seeds");

  // Seeds for sale: any plant with a cost
  const seedsForSale = allPlants.filter((p) => p.cost > 0);

  // Upgrades for sale
  const upgradesForSale = [
    {
      id: "premiumFertilizer",
      name: "Premium Fertilizer",
      image: "/images/premium-fertilizer.png",
      cost: 50,
      label: `You own ${items.premiumFertilizer}`
    },
    {
      id: "compost",
      name: "Compost",
      image: "/images/compost.png",
      cost: 30,
      label: `You own ${items.compost}`
    }
  ];

  function buySeed(plant) {
    if (coins < plant.cost) return alert("Not enough coins!");
    setCoins((c) => c - plant.cost);
    setInventory((inv) => [
      ...inv,
      { id: plant.id, name: plant.name, image: plant.image }
    ]);
    alert(`Bought ${plant.name} seed! 🌱`);
  }

  function buyUpgrade(upg) {
    if (coins < upg.cost) return alert("Not enough coins!");
    setCoins((c) => c - upg.cost);
    setItems((it) => ({
      ...it,
      [upg.id]: (it[upg.id] || 0) + 1
    }));
    alert(`Bought ${upg.name}!`);
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

      {/* Seeds Tab */}
      {tab === "seeds" && (
        <div className="shop-grid">
          {seedsForSale.map((plant) => (
            <div key={plant.id} className="shop-item-card">
              <img
                src={plant.image}
                alt={plant.name}
                className="shop-img"
              />
              <h4>{plant.name}</h4>
              <p>💰 {plant.cost}</p>
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

      {/* Upgrades Tab */}
      {tab === "upgrades" && (
        <div className="shop-grid">
          {upgradesForSale.map((upg) => (
            <div key={upg.id} className="shop-item-card">
              <img
                src={upg.image}
                alt={upg.name}
                className="shop-img"
              />
              <h4>{upg.name}</h4>
              <p>💰 {upg.cost}</p>
              <p style={{ fontSize: "0.85rem", margin: "0.25rem 0" }}>
                {upg.label}
              </p>
              <button
                onClick={() => buyUpgrade(upg)}
                disabled={coins < upg.cost}
              >
                {coins >= upg.cost ? "Buy" : "Not enough coins"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
