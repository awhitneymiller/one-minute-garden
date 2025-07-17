export default function PlantRecipes({ plants }) {
  return (
    <div className="panel">
      <h3>📖 Plant Recipes</h3>
      <ul className="map-list">
        {plants.map((p) => (
          <li key={p.id}>
            {p.name}: {p.bloomCombo.water}×💧, {p.bloomCombo.fertilize}×🌿
          </li>
        ))}
      </ul>
    </div>
  );
}
