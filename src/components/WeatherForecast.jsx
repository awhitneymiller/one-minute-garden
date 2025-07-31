// src/components/WeatherForecast.jsx
export default function WeatherForecast({ forecast }) {
  return (
    <div style={{ marginTop: "2rem", maxWidth: "700px", margin: "auto" }}>
      <h3 style={{ color: "#4b5563" }}>🌤 Weather Forecast</h3>
      <ul>
        {forecast.map((f, i) => (
          <li key={i}>
            {i === 0 ? "Today" : `Day ${i + 1}`}: {f.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
