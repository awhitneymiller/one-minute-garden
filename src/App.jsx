import { useState, useEffect } from "react";
import "./index.css";

//New Feature ideas
/*
- Account
- Database:
- Map
- Friends?
- Add more plants
- Add more gameplay
  -minigame to water plant
  - debug button for testing!!
  -add api for daily affirmation
  -world event / weather events for each day
    - these events affect the plants

*/

const allPlants = [
  { id: 1, name: "Lavender", bloomCombo: { water: 2, fertilize: 1 } },
  { id: 2, name: "Marigold", bloomCombo: { water: 1, fertilize: 2 } },
  { id: 3, name: "Fern", bloomCombo: { water: 1, fertilize: 1 } },
  { id: 4, name: "Chamomile", bloomCombo: { water: 2, fertilize: 2 } },
  { id: 5, name: "Rosemary", bloomCombo: { water: 3, fertilize: 1 } },
];

const GROWTH_STAGES = ["Seedling", "Sprout", "Bud", "Bloom"];
const REGIONS = [
  { id: 1, name: "Meadow", unlocked: true, unlockCondition: () => true },
  { id: 2, name: "Grove", unlocked: false, unlockCondition: (harmonyScore) => harmonyScore >= 80 },
  { id: 3, name: "Cliffside", unlocked: false, unlockCondition: (harmonyScore, bloomCount) => bloomCount >= 5 },
];

const THEMES = [
  { name: "Default", backgroundColor: "#f0fdf4", textColor: "#14532d" },
  { name: "Dusk", backgroundColor: "#e0e7ff", textColor: "#1e3a8a" },
  { name: "Sunset", backgroundColor: "#fff7ed", textColor: "#b45309" },
  { name: "Night", backgroundColor: "#1e293b", textColor: "#f8fafc" },
];

const generateGoals = () => [
  { id: 1, description: "Water 3 plants", completed: false },
  { id: 2, description: "Fertilize 2 plants", completed: false },
  { id: 3, description: "Reach a harmony score of 90+", completed: false },
  { id: 4, description: "Grow two plants to Sprout ", completed: false},
  { id: 5, description: "Grow two plants to Fern", completed: false},
  { id: 6, description: "Grow one plant to Bud", completed: false},
  { id: 7, description: "Grow one plant to Bloom", completed: false}
];

export default function App() {
  const [theme, setTheme] = useState("Default");
  const [activeRegion, setActiveRegion] = useState(REGIONS[0]);
  const [regionStates, setRegionStates] = useState(REGIONS);
  const [upgrades, setUpgrades] = useState({ compost: false, mistSpray: false, extendedTime: false });
  const [activeGarden, setActiveGarden] = useState(() => {
    return allPlants.slice(0, 3).map((plant) => ({
      ...plant,
      growth: 0,
      watered: 0,
      fertilized: 0,
      notes: [],
      bloomed: false,
      rareFormUnlocked: false,
      hasMysterySeed: false,
    }));
  });

  const [timeLeft, setTimeLeft] = useState(300);
  const [sessionActive, setSessionActive] = useState(false);
  const [message, setMessage] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [harmonyScore, setHarmonyScore] = useState(null);
  const [dailyGoals, setDailyGoals] = useState(generateGoals());

  useEffect(() => {
    if (sessionActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      endSession();
    }
  }, [sessionActive, timeLeft]);

  const endSession = () => {
    let total = 0;
    let perfect = 0;
    let bloomCount = 0;
    let goals = [...dailyGoals];
    const updated = activeGarden.map((plant) => {
      const { water, fertilize } = plant.bloomCombo;
      const watered = plant.watered;
      const fertilized = plant.fertilized;
      const isPerfect = watered === water && fertilized === fertilize;
      let harmony = 100 - Math.abs(watered - water) * 25 - Math.abs(fertilized - fertilize) * 25;
      if (upgrades.compost) harmony = Math.min(100, harmony + 10);
      if (upgrades.mistSpray && (watered > water || fertilized > fertilize)) harmony = Math.min(100, harmony + 5);
      total += Math.max(0, harmony);
      if (isPerfect) perfect++;
      if (isPerfect && !plant.bloomed) bloomCount++;
      const seedDrop = isPerfect && Math.random() < 0.5;
      return {
        ...plant,
        growth: isPerfect ? Math.min(plant.growth + 1, GROWTH_STAGES.length - 1) : plant.growth,
        bloomed: isPerfect ? true : plant.bloomed,
        hasMysterySeed: seedDrop,
        watered: 0,
        fertilized: 0,
      };
    });

    if (updated.filter((p) => p.watered >= 3).length > 0) goals[0].completed = true;
    if (updated.filter((p) => p.fertilized >= 2).length > 0) goals[1].completed = true;
    const score = Math.round(total / activeGarden.length);
    if (score >= 90) goals[2].completed = true;

    const newRegions = regionStates.map((r) => {
      if (r.unlocked) return r;
      if (r.unlockCondition(score, bloomCount)) return { ...r, unlocked: true };
      return r;
    });

    setRegionStates(newRegions);
    setActiveGarden(updated);
    setSessionActive(false);
    setHarmonyScore(score);
    setMessage(`Your Harmony Score: ${score}/100`);
    setDailyGoals(goals);
  };

  const performAction = (id, action) => {
    if (!sessionActive) return;
    setActiveGarden((prev) =>
      prev.map((plant) => {
        if (plant.id === id) {
          const updated = { ...plant };
          if (action === "water") updated.watered++;
          if (action === "fertilize") updated.fertilized++;
          return updated;
        }
        return plant;
      })
    );
  };

  const addJournalNote = () => {
    if (!journalEntry.trim()) return;
    const date = new Date().toLocaleString();
    const note = `${date}: ${journalEntry}`;
    setActiveGarden((prev) =>
      prev.map((plant) => ({ ...plant, notes: [...(plant.notes || []), note] }))
    );
    setJournalEntry("");
    setMessage("Your journal has been saved.");
  };

  const applyUpgrade = (key) => {
    setUpgrades((prev) => ({ ...prev, [key]: true }));
    setMessage(`Upgrade applied: ${key}`);
  };

  const startSession = () => {
    const baseTime = 300;
    const bonusTime = upgrades.extendedTime ? 60 : 0;
    setTimeLeft(baseTime + bonusTime);
    setSessionActive(true);
    setHarmonyScore(null);
    setMessage(`Welcome to the ${activeRegion.name}!`);
    setDailyGoals(generateGoals());
  };

  const liveHarmony = Math.round(
    activeGarden.reduce((sum, plant) => {
      const { water, fertilize } = plant.bloomCombo;
      let score = 100 - Math.abs(plant.watered - water) * 25 - Math.abs(plant.fertilized - fertilize) * 25;
      if (upgrades.compost) score = Math.min(100, score + 10);
      if (upgrades.mistSpray && (plant.watered > water || plant.fertilized > fertilize)) score = Math.min(100, score + 5);
      return sum + Math.max(0, score);
    }, 0) / activeGarden.length
  );

  const currentTheme = THEMES.find((t) => t.name === theme);

  return (
    <div style={{ padding: "2rem", textAlign: "center", backgroundColor: currentTheme.backgroundColor, color: currentTheme.textColor, minHeight: "100vh" }}>
      <h1>🌿 One Minute Garden</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="theme">Choose Theme: </label>
        <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value)}>
          {THEMES.map((t) => (
            <option key={t.name} value={t.name}>{t.name}</option>
          ))}
        </select>
      </div>

      {!sessionActive ? (
        <div style={{ marginTop: "1rem" }}>
          <h3>📖 Care Recipes</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {activeGarden.length > 0 &&
              activeGarden.map((plant) => (
                <li key={plant.id}>
                  {plant.name}: {plant.bloomCombo.water}x 💧 / {plant.bloomCombo.fertilize}x 🌿
                </li>
              ))}
          </ul>
          <button onClick={startSession}>Begin Garden Session in {activeRegion.name}</button>
        </div>
      ) : (
        <div>
          <p>Time left: {timeLeft}s</p>
          <p>Harmony Score: {liveHarmony}/100</p>

          <h3>Daily Goals</h3>
          <ul>
            {dailyGoals.map((goal) => (
              <li key={goal.id} style={{ textDecoration: goal.completed ? "line-through" : "none" }}>{goal.description}</li>
            ))}
          </ul>

          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
            {activeGarden.map((plant) => (
              <div key={plant.id} style={{ background: "#fff", padding: "1rem", borderRadius: "12px", width: "250px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", color: "#000" }}>
                <h3>{plant.name}</h3>
                <p>Stage: {GROWTH_STAGES[plant.growth]}</p>
                <p>Watered: {plant.watered} | Fertilized: {plant.fertilized}</p>
                <button onClick={() => performAction(plant.id, "water")}>💧 Water</button>
                <button onClick={() => performAction(plant.id, "fertilize")}>🌿 Fertilize</button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "2rem" }}>
            <textarea
              rows={3}
              placeholder="Write in your garden journal..."
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              style={{ width: "100%", maxWidth: "500px" }}
            ></textarea>
            <br />
            <button onClick={addJournalNote}>Save Journal</button>
          </div>
        </div>
      )}
    </div>
  );
}
