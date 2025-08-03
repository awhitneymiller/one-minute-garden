// src/components/WeatherForecast.jsx
export default function WeatherForecast({ forecast, currentDayIndex }) {
  return (
    <div className="weather-forecast">
      <h3>🌤 Weather Forecast</h3>
      <ul className="forecast-list">
        {forecast.map((f, i) => (
          <li
            key={i}
            className={i === currentDayIndex ? "current" : ""}
          >
            {i === 0 ? "Today" : `Day ${i+1}`}: {f.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
