import React from "react";
import { allPlants } from "../data/plants";
import "./ShopView.css";

export default function ShopView({ inventory, setInventory, coins, setCoins }) {
  function buySeed(plant) {
    if (coins < 10) return alert("Not enough coins!");
    setCoins((c) => c - 10);
    setInventory((inv) => [...inv, { id: plant.id, name: plant.name }]);
  }

  return (
    <div className="shop-view">
      <h2>🛍️ Garden Shop</h2>
      <p>You have {coins} coins.</p>

      <div className="shop-items">
        {allPlants.map((plant) => (
          <div key={plant.id} className="shop-item">
            <img src={plant.image} alt={plant.name} />
            <p>{plant.name}</p>
            <button onClick={() => buySeed(plant)}>Buy Seed (10 coins)</button>
          </div>
        ))}
      </div>
    </div>
  );
}
