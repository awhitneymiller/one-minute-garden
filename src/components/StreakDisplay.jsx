// src/components/StreakDisplay.jsx
import React from "react";

export default function StreakDisplay({ streak }) {
  return (
    <div className="panel">
      <h3>🔥 Daily Streak</h3>
      <p>
        {streak} day{streak === 1 ? "" : "s"} 🌱
      </p>
    </div>
  );
}
