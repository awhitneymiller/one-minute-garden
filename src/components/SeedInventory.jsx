
import React from "react";

export default function SeedInventory({ inventory, onPlant }) {
  return (
    <section className="inventory">
      <h3>🌱 Seed Inventory</h3>
      {inventory.length === 0 ? (
        <p>No seeds yet. Complete sessions or find drops!</p>
      ) : (
        <ul className="seed-list">
          {inventory.map(p => (
            <li key={p.id}>
              {p.name}{" "}
              <button onClick={() => onPlant(p)}>
                Plant
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
