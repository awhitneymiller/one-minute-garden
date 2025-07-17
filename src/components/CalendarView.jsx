// src/components/CalendarView.jsx
import React from "react";
import { format, subDays } from "date-fns";

export default function CalendarView({ sessionDates }) {
  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const key = format(date, "yyyy-MM-dd");
    const done = sessionDates.includes(key);
    return { key, label: format(date, "MM/dd"), done };
  });

  return (
    <div className="panel">
      <h3>🗓 Last 7 Days</h3>
      <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
        {days.map((d) => (
          <div
            key={d.key}
            style={{
              width: 20,
              height: 20,
              background: d.done ? "#22c55e" : "#e2e8f0",
              borderRadius: 4
            }}
            title={d.label}
          ></div>
        ))}
      </div>
    </div>
  );
}
