import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

export default function CalendarView({ sessionDates = [] }) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  const days = eachDayOfInterval({
    start: monthStart,
    end: monthEnd
  });

  return (
    <div className="calendar-view">
      <h4>📆 Garden Activity</h4>
      <div className="calendar-grid">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const active = sessionDates.includes(key);
          return (
            <div key={key} className={`calendar-cell ${active ? "active" : ""}`}>
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
}