// src/components/SeedInventory.jsx
import React from "react";

export default function SeedInventory({ inventory, onPlant }) {
  return (
    <section className="inventory">
      <h3>🌱 Seed Inventory</h3>
      {inventory.length === 0 ? (
        <p>No seeds yet. Complete sessions or find drops!</p>
      ) : (
        <ul className="seed-list">
          {inventory.map(seed => (
            <li key={seed.id}>
              {seed.name}{" "}
             <button
              className="pill-button"
              onClick={() => onPlant(seed)}
            >
              Plant
             </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
