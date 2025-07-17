export default function PlantedSection({ selectedSeeds }) {
  return (
    <div className="panel">
      <h3>🌼 Planted Seeds</h3>
      {selectedSeeds.length === 0 ? (
        <p>No seeds planted yet!</p>
      ) : (
        <ul className="inventory">
          {selectedSeeds.map((p, idx) => (
            <li key={idx}>
              <span style={{ fontSize: "1.2rem" }}>{p.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
