// src/components/ThemeToggle.jsx
import React from "react";

export default function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      style={{
        marginLeft: "1rem",
        padding: "0.5rem",
        background: "transparent",
        border: "1px solid currentColor",
        borderRadius: "6px",
        cursor: "pointer"
      }}
      title="Toggle theme"
    >
      {theme === "light" ? "🌙 Dark" : "🔆 Light"}
    </button>
  );
}
