// src/components/WeatherForecast.jsx
import React, { useState, useEffect } from "react";

export default function WeatherForecast({ forecast, currentDayIndex }) {
  const [secsLeft, setSecsLeft] = useState(60);

  // Reset countdown whenever the weather advances
  useEffect(() => {
    setSecsLeft(60);
  }, [currentDayIndex]);

  // Tick the countdown every second
  useEffect(() => {
    const iv = setInterval(() => {
      setSecsLeft(s => (s > 1 ? s - 1 : 60));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  // Format mm:ss
  const mm = String(Math.floor(secsLeft / 60)).padStart(2, "0");
  const ss = String(secsLeft % 60).padStart(2, "0");

  // Build an array starting from “Now” and then Day 1, Day 2, …
  const entries = [
    { label: "Now", name: forecast[currentDayIndex].name }
  ];
  for (let offset = 1; offset < forecast.length; offset++) {
    const idx = (currentDayIndex + offset) % forecast.length;
    entries.push({ label: `Day ${offset}`, name: forecast[idx].name });
  }

  return (
    <div style={{ marginTop: "2rem", maxWidth: "700px", margin: "auto" }}>
      <h3 style={{ color: "#4b5563" }}>🌤 Weather Forecast</h3>
      <ul style={{ paddingLeft: 0, listStyle: "none" }}>
        {entries.map((e, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "0.25rem 0",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.25rem",
              background: i === 0 ? "var(--primary-light)" : "transparent",
              fontWeight: i === 0 ? "bold" : "normal",
              color: i === 0 ? "var(--primary)" : "var(--fg)"
            }}
          >
            <span style={{ flex: "0 0 60px" }}>{e.label}:</span>
            <span>{e.name}</span>
          </li>
        ))}
      </ul>
      <div
        style={{
          marginTop: "0.5rem",
          fontSize: "0.9rem",
          color: "var(--fg-muted)",
          textAlign: "right"
        }}
      >
        Next weather in {mm}:{ss}
      </div>
    </div>
  );
}
