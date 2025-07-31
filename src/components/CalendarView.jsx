// src/components/CalendarView.jsx
import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

export default function CalendarView({ sessionStats = {} }) {
  const today      = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd   = endOfMonth(today);
  const days       = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="calendar-view">
      <h4>📆 Garden Activity</h4>
      <div className="calendar-grid">
        {days.map(day => {
          const key    = format(day, "yyyy-MM-dd");
          const stats  = sessionStats[key];
          const active = Boolean(stats);

          return (
            <div
              key={key}
              className={`calendar-cell ${active ? "active" : ""}`}
            >
              <div className="date-number">{format(day, "d")}</div>
              {active && (
                <div className="day-stats">
                  <div>🌸 {stats.blooms}</div>
                  <div>✨ {stats.harmony}</div>
                  <div>💰 {stats.coins}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
