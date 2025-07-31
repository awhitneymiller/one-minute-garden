// src/components/Journal.jsx
import React from "react";
import { getDayOfYear, parseISO, format } from "date-fns";
import "./Journal.css";

export default function Journal({
  journal,
  setJournal,
  onSave,
  entries    // ← new prop: { "2025-07-30": "I watered...", ... }
}) {
  const prompts = [
    "Reflect on something positive that happened today.",
    "How do you feel while tending to your garden?",
    "What are you grateful for today?",
    "Describe a new thing you noticed in your garden.",
    "Write about a memory the garden evokes."
  ];
  const dayIndex     = getDayOfYear(new Date()) % prompts.length;
  const dailyPrompt  = prompts[dayIndex];

  // sort dates descending
  const sortedDates = Object.keys(entries || {})
    .sort((a, b) => b.localeCompare(a));

  return (
    <div className="journal single-pane">
      {/* Input Panel */}
      <div className="panel">
        <h3>📝 Garden Journal</h3>
        <p className="journal-prompt">{dailyPrompt}</p>
        <textarea
          className="journal-input"
          rows={3}
          placeholder="Write something about your garden..."
          value={journal}
          onChange={e => setJournal(e.target.value)}
        />
        <button className="journal-save" onClick={onSave}>
          Save Journal Entry
        </button>
      </div>

      {/* Past Entries */}
      <ul className="entries-list">
        {sortedDates.map(dateKey => (
          <li key={dateKey}>
            <div className="entry-date">
              {format(parseISO(dateKey), "PPP")}
            </div>
            <div className="entry-text">
              {entries[dateKey]}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
