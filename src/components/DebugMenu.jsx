// src/components/DebugMenu.jsx
import React from "react";

export default function DebugMenu({ onFastForward, onStartSession }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <button onClick={onFastForward}>⏩ Skip 30s</button>
      <button onClick={onStartSession} style={{ marginLeft: "1rem" }}>
        ▶ Start Session
      </button>
    </div>
  );
}
