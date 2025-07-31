// src/components/Journal.jsx
import React from "react";
import { getDayOfYear } from "date-fns";

export default function Journal({ journal, setJournal, onSave }) {
  const prompts = [
    "Reflect on something positive that happened today.",
    "How do you feel while tending to your garden?",
    "What are you grateful for today?",
    "Describe a new thing you noticed in your garden.",
    "Write about a memory the garden evokes."
  ];
  const dayIndex = getDayOfYear(new Date()) % prompts.length;
  const dailyPrompt = prompts[dayIndex];

  return (
    <div style={{ marginTop: "1rem", maxWidth: "700px", marginLeft: "auto", marginRight: "auto" }}>
      <h3 style={{ color: "#4b5563" }}>📝 Garden Journal</h3>
      <p style={{ color: "#6b7280", fontStyle: "italic" }}>{dailyPrompt}</p>
      <textarea
        rows={3}
        placeholder="Write something about your garden..."
        value={journal}
        onChange={e => setJournal(e.target.value)}
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <br />
      <button onClick={onSave}>Save Journal Entry</button>
    </div>
  );
}
