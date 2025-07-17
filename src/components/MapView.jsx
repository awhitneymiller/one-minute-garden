export default function MapView({ bloomCount }) {
  const regions = [
    { id: 1, name: "Meadow", unlocked: true },
    { id: 2, name: "Grove", unlocked: bloomCount >= 2 },
    { id: 3, name: "Cliffside", unlocked: bloomCount >= 5 },
  ];

  return (
    <div className="panel">
      <h3>🗺 World Map</h3>
      <ul className="map-list">
        {regions.map((r) => (
          <li key={r.id}>
            {r.name} {r.unlocked ? "" : "🔒"}
            {!r.unlocked && <small> (needs {r.id === 2 ? "2 blooms" : "5 blooms"})</small>}
          </li>
        ))}
      </ul>
    </div>
  );
}
