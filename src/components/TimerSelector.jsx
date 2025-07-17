// src/components/TimerSelector.jsx
import React from "react";

export default function TimerSelector({ sessionLength, setSessionLength }) {
  return (
    <div className="panel">
      <h3>⏲ Session Length</h3>
      {[0, 1, 3, 5, 10].map((min) => (
        <label key={min} style={{ marginRight: "1rem" }}>
          <input
            type="radio"
            value={min}
            checked={sessionLength === min}
            onChange={() => setSessionLength(min)}
          />{" "}
          {min === 0 ? "No timer" : `${min} min`}
        </label>
      ))}
    </div>
  );
}
