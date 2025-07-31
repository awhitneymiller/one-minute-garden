// src/components/ShopView.jsx
import React, { useState } from "react";
import { allPlants } from "../data/plants";
import "./ShopView.css";

export default function ShopView({ coins, setCoins, inventory, setInventory, items, setItems }) {
  const [tab, setTab] = useState("seeds");

  // Filter out special seeds (cost 0) from shop list
  const seedsForSale = allPlants.filter(p => p.cost && p.cost > 0);

  const upgrades = [
    { id: "decor1", name: "Garden Gnome", cost: 20 },
    { id: "buff1", name: "Fertilizer Pack (x5)", cost: 30 },
    { id: "buff2", name: "Sun Crystal", cost: 25 }
  ];

  const buySeed = plant => {
    if (coins < plant.cost) {
      alert("Not enough coins!");
      return;
    }
    setCoins(c => c - plant.cost);
    setInventory(inv => [...inv, { id: plant.id, name: plant.name, image: plant.image }]);
    alert(`Bought ${plant.name} seed! 🌱`);
  };

  const buyUpgrade = item => {
    if (item.id === "buff1") {
      if (coins < item.cost) {
        alert("Not enough coins!");
        return;
      }
      setCoins(c => c - item.cost);
      setItems(prev => ({ ...prev, premiumFertilizer: prev.premiumFertilizer + 5 }));
      alert("Premium Fertilizer Pack purchased! (5 premium fertilizers added)");
    } else {
      alert("This item is coming soon!");
    }
  };

  return (
    <div className="shop">
      <h2>🛍️ Garden Shop</h2>
      <p>You have {coins} coins.</p>
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
    {seedsForSale.map(plant => (
      <div key={plant.id} className="shop-item-card">
        <img src={plant.image} alt={plant.name} className="shop-img" />
        <h4>{plant.name}</h4>
        <p style={{ marginBottom: "0.25rem" }}>💰 {plant.cost} coins</p>
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


      {tab === "upgrades" && (
        <div className="shop-grid">
          {upgrades.map(item => (
            <div key={item.id} className="shop-item">
              <h4>{item.name}</h4>
              <p>💰 {item.cost} coins</p>
              {item.id === "buff1" ? (
                <button
                  onClick={() => buyUpgrade(item)}
                  disabled={coins < item.cost}
                >
                  {coins >= item.cost ? "Buy" : "Not enough coins"}
                </button>
              ) : (
                <button disabled>Coming Soon</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
