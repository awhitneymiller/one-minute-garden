// src/App.jsx
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import {
  auth,
  db,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "./firebase";
import { allPlants } from "./data/plants";
import { weatherEvents } from "./data/weather";
import { storyBeats } from "./data/story";
import { journalUnlockables } from "./data/journalUnlockables";
import { generateForecast } from "./logic/generateForecast";
import { generateGoals } from "./logic/generateGoals";

import Auth from "./components/Auth";
import WeatherForecast from "./components/WeatherForecast";
import SeedInventory from "./components/SeedInventory";
import Journal from "./components/Journal";
import PlantCard from "./components/PlantCard";
import MapView from "./components/MapView";
import PlantRecipes from "./components/PlantRecipes";
import StreakDisplay from "./components/StreakDisplay";
import CalendarView from "./components/CalendarView";
import ThemeToggle from "./components/ThemeToggle";
import MusicPlayer from "./components/MusicPlayer";
import ShopView from "./components/ShopView";
import WaterMiniGame from "./components/MiniGames/WaterMiniGame";
import FertilizeMiniGame from "./components/MiniGames/FertilizeMiniGame";
import CraftingView from "./components/CraftingView";

export default function App() {
  // --- Starter seeds (first 3 defined in allPlants) ---
  const starterSeeds = allPlants.slice(0, 3).map(({ id, name, image }) => ({
    id,
    name,
    image
  }));

  // --- State ---
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [inventory, setInventory] = useState(starterSeeds);
  const [plantedPlants, setPlantedPlants] = useState([]);
  const [view, setView] = useState("garden");
  const [currentMap, setCurrentMap] = useState("meadow");
  const [forecast] = useState(generateForecast());  // 5-day random weather forecast
  const [dailyGoals, setDailyGoals] = useState(generateGoals());
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem("omg-theme") || "light");

  // Gameplay states
  const [harmony, setHarmony] = useState(0);
  const [waterCount, setWaterCount] = useState(0);
  const [fertilizeCount, setFertilizeCount] = useState(0);
  const [items, setItems] = useState({ premiumFertilizer: 0, compost: 0, potions: 0 });
  const [journalEntries, setJournalEntries] = useState({});
  const [journalEntry, setJournalEntry] = useState("");
  const [activeMiniGame, setActiveMiniGame] = useState(null);
  const [activePlantId, setActivePlantId] = useState(null);

  // --- Persist theme preference ---
  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("omg-theme", theme);
  }, [theme]);

  // --- Auth & Firestore initial load ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setAuthChecked(true);
      if (!u) {
        setUser(null);
        return;
      }
      setUser(u);
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data();
        // Inventory and starter seeds setup
        if (!d.inventory || d.inventory.length === 0) {
          setInventory(starterSeeds);
          await updateDoc(ref, { inventory: starterSeeds });
        } else {
          setInventory(d.inventory);
        }
        // Load items or initialize
        const loadedItems = d.items || { premiumFertilizer: 0, compost: 0, potions: 0 };
        setItems(loadedItems);
        // Load journal entries
        const loadedJournal = d.journal || {};
        setJournalEntries(loadedJournal);
        // Populate today's journal entry if already exists
        const todayKey = format(new Date(), "yyyy-MM-dd");
        setJournalEntry(loadedJournal[todayKey] || "");
        // Load planted plants and apply time-based effects (water depletion, wilting)
        let plants = d.plantedPlants || [];
        const now = Date.now();
        plants = plants.map(p => {
          let newPlant = { ...p };
          const minutesSinceCare = (now - (p.lastCareTime || now)) / 60000;
          // Decrease water level over time (linear to 0 over 24h)
          let newWaterLevel = p.waterLevel ?? 100;
          if (minutesSinceCare >= 1440) {
            newWaterLevel = 0;
          } else if (minutesSinceCare >= 0) {
            const proportion = Math.min(1, minutesSinceCare / 1440);
            newWaterLevel = Math.max(0, Math.floor(100 * (1 - proportion)));
          }
          // Weather effect: Rainy day fully hydrates plants
          if (forecast[0].name === "Rainy") {
            newWaterLevel = 100;
            newPlant.lastCareTime = now;  // rain acts as care event
          }
          newPlant.waterLevel = newWaterLevel;
          // Check for wilting (no care > 48h)
          if (minutesSinceCare > 2880) {
            newPlant.stage = 4;
            newPlant.mood = "wilted";
            newPlant.waterLevel = 0;
          }
          return newPlant;
        });
        setPlantedPlants(plants);
        setCoins(d.coins || 0);
        setStreak(d.streak || 0);
      } else {
        // First-time user: initialize document with starter seeds and defaults
        const initData = {
          inventory: starterSeeds,
          plantedPlants: [],
          coins: 0,
          streak: 0,
          items: { premiumFertilizer: 0, compost: 0, potions: 0 },
          journal: {}
        };
        await setDoc(ref, initData);
        setInventory(starterSeeds);
        setPlantedPlants([]);
        setCoins(0);
        setStreak(0);
        setItems({ premiumFertilizer: 0, compost: 0, potions: 0 });
        setJournalEntries({});
        setJournalEntry("");
      }
    });
    return unsub;
  }, []);

  // --- Save state back to Firestore on changes ---
  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    updateDoc(ref, {
      inventory,
      plantedPlants,
      coins,
      streak,
      items
    }).catch(console.error);
  }, [user, inventory, plantedPlants, coins, streak, items]);

  // --- Handlers --- !!!!!!!!!!!!!
  function plantSeed(seed) {
    // Only allow up to 3 plants in garden at once
    if (plantedPlants.length >= 3) {
      alert("You can have at most 3 plants in your garden.");
      return;
    }
    // Remove seed from inventory and plant it
    setInventory(inv => inv.filter(i => i.id !== seed.id));
    setPlantedPlants(plants => [
      ...plants,
      {
        ...seed,
        stage: 0,
        waterLevel: 100,
        mood: "happy",
        lastCareTime: Date.now(),
        instanceId: `${seed.id}-${Date.now()}`
      }
    ]);
  }

  function handleWater(id) {
    console.log("handleWater called", id);
    setActivePlantId(id);
    setActiveMiniGame("water");
  }

  function handleCompost(id) {
  if (items.compost <= 0) return;
  // consume compost
  setItems(it => ({ ...it, compost: it.compost - 1 }));
  // advance plant stage like a perfect fertilize
  setPlantedPlants(ps =>
    ps.map(p =>
      p.instanceId === id
        ? {
            ...p,
            stage: Math.min(3, p.stage + 1),
            mood: "radiant",
            lastCareTime: Date.now()
          }
        : p
    )
  );
  // award harmony points
  setHarmony(h => Math.min(100, h + 7));  // e.g. 7 pts for compost
}

  function handleCraft(instanceId) {
    // consume the wilted plant
    setPlantedPlants(plants =>
      plants.filter(p => p.instanceId !== instanceId)
    );
    // add 1 compost
    setItems(it => ({ ...it, compost: it.compost + 1 }));
    alert("Crafted 1 Compost 🌱");
    }

  function handleFertilize(id) {
    console.log("handleFertilize called", id);
    setActivePlantId(id);
    setActiveMiniGame("fertilize");
  }

  function handleSell(id) {
    // Remove plant and reward coins for a fully bloomed plant
    setPlantedPlants(plants => plants.filter(p => p.instanceId !== id));
    const def = allPlants.find(pl => pl.id === id);
    const reward = def?.sellValue ?? 0;
    setCoins(c => c + reward);
  }

  function handleRemove(id) {
    // Remove a wilted plant (no coin reward)
    setPlantedPlants(plants => plants.filter(p => p.instanceId !== id));
  }

  function handleRevive(id) {
    // Use a Spirit Potion (if available) or 20 coins to revive a wilted plant
    if (items.potions > 0) {
      setItems(prev => ({ ...prev, potions: prev.potions - 1 }));
    } else if (coins >= 20) {
      setCoins(c => c - 20);
    } else {
      alert("Not enough resources to revive this plant (need a Spirit Potion or 20 coins).");
      return;
    }
    setPlantedPlants(plants =>
      plants.map(p =>
        p.instanceId === id
          ? {
              ...p,
              stage: 3,
              mood: "radiant",
              waterLevel: 100,
              lastCareTime: Date.now()
            }
          : p
      )
    );
  }

  function handlePremiumFertilize(id) {
    // Instantly use premium fertilizer on the plant (skip mini-game, guaranteed boost)
    if (items.premiumFertilizer <= 0) return;
    setItems(prev => ({ ...prev, premiumFertilizer: prev.premiumFertilizer - 1 }));
    setPlantedPlants(plants =>
      plants.map(p =>
        p.instanceId === id
          ? {
              ...p,
              stage: p.stage < 3 ? Math.min(3, p.stage + 1) : p.stage,
              mood: "radiant",
              lastCareTime: Date.now()
            }
          : p
      )
    );
    // Count as a fertilize action
    setFertilizeCount(count => count + 1);
    // Add harmony points (treat as perfect fertilize)
    let points = 8;
    if (forecast[0].name === "Sunny") points = Math.floor(points * 1.5);
    if (forecast[0].name === "Foggy") points = Math.floor(points * 0.5);
    setHarmony(h => {
      const newH = Math.min(100, h + points);
      if (newH >= 90) {
        setDailyGoals(goals =>
          goals.map(g => (g.id === 3 ? { ...g, completed: true } : g))
        );
      }
      return newH;
    });
    // Complete fertilize goal if threshold reached
    setDailyGoals(goals =>
      goals.map(g =>
        g.id === 2 && !g.completed && fertilizeCount + 1 >= 2
          ? { ...g, completed: true }
          : g
      )
    );
  }

  function handleSaveJournal() {
    const todayKey = format(new Date(), "yyyy-MM-dd");
    // Save entry to Firestore journal field
    const ref = doc(db, "users", user.uid);
    updateDoc(ref, { [`journal.${todayKey}`]: journalEntry }).catch(console.error);
    // Update local journal entries and calendar
    setJournalEntries(prev => ({ ...prev, [todayKey]: journalEntry }));
    // Check for special keyword unlocks in the entry
    const entryText = journalEntry.toLowerCase();
    journalUnlockables.forEach(({ keyword, unlockedItem }) => {
      if (entryText.includes(keyword)) {
        // Unlock the special seed if not already in inventory or garden
        const alreadyHas =
          inventory.some(s => s.id === unlockedItem.id) ||
          plantedPlants.some(p => p.id === unlockedItem.id);
        if (!alreadyHas) {
          setInventory(inv => [
            ...inv,
            { id: unlockedItem.id, name: unlockedItem.name }
          ]);
          alert(`✨ A mysterious seed (${unlockedItem.name}) has been revealed in your inventory!`);
          // Optional lore message from a garden spirit
          if (unlockedItem.name === "Moonflower") {
            alert(storyBeats[2]); // "A new sprout carries the scent of someone you once knew."
          } else if (unlockedItem.name === "Starpetal") {
            alert(storyBeats[4]); // "Something is watching your garden blossom with care."
          }
        }
      }
    });
    // Update streak count for consecutive daily journaling
    setStreak(prev => {
      const yesterdayKey = format(Date.now() - 86400000, "yyyy-MM-dd");
      let newStreak = 1;
      if (journalEntries[yesterdayKey]) {
        newStreak = prev + 1;
      }
      return newStreak;
    });
    // Mark daily goal for journaling as completed
    setDailyGoals(goals =>
      goals.map(g =>
        g.id === 4 ? { ...g, completed: true } : g
      )
    );
    // Grant harmony points for reflection
    setHarmony(h => {
      const newH = Math.min(100, h + 10);
      if (newH >= 90) {
        setDailyGoals(goals =>
          goals.map(g => (g.id === 3 ? { ...g, completed: true } : g))
        );
      }
      return newH;
    });
    alert("Journal entry saved! 🌱");
  }

  // --- Guard before render ---
  if (!authChecked) return null;
  if (!user) return <Auth />;

  return (
    <div
      className={`app-container map-${currentMap} weather-${forecast[0].name
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    >
      <header className="app-header">
        <h1>🌿 One Minute Garden</h1>
        <nav>
          {["garden","map","recipes","calendar","journal","shop","crafting"].map(v => (
            <button
              key={v}
              className={view === v ? "active" : ""}
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </nav>
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <button className="logout-btn" onClick={() => signOut(auth)}>
          Log Out
        </button>
      </header>

      {view === "garden" && (
        <main className="dashboard">
          <section className="card goals">
            <h3>🎯 Daily Goals</h3>
            <ul>
              {dailyGoals.map(g => (
                <li key={g.id} className={g.completed ? "done" : ""}>
                  {g.completed ? "✅ " : ""}
                  {g.description}
                </li>
              ))}
            </ul>
          </section>

          <section className="card forecast">
            <WeatherForecast forecast={forecast} />
            <StreakDisplay streak={streak} />
          </section>

          <section className="card inventory">
            <SeedInventory inventory={inventory} onPlant={plantSeed} />
          </section>

          <section className="card garden">
            <h3>🌼 Your Garden</h3>
            {plantedPlants.length === 0 ? (
              <p className="empty">Your garden is empty. Plant seeds!</p>
            ) : (
              <div className="plant-grid">
                {plantedPlants.map(p => (
                  <PlantCard
                    key={p.instanceId}
                    plant={p}
                    onWater={handleWater}
                    onFertilize={handleFertilize}
                    onPremiumFertilize={handlePremiumFertilize}
                    onCompost={handleCompost}
                    onSell={handleSell}
                    onRevive={handleRevive}
                    onRemove={handleRemove}
                    hasPremium={items.premiumFertilizer > 0}
                    hasCompost={items.compost > 0}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {view === "map" && (
        <main className="single-pane">
          <MapView
            bloomCount={plantedPlants.filter(p => p.stage === 3).length}
            currentMap={currentMap}
            onSelectMap={setCurrentMap}
          />
        </main>
      )}

      {view === "recipes" && (
        <main className="single-pane">
          <PlantRecipes plants={allPlants} />
        </main>
      )}

      {view === "calendar" && (
        <main className="single-pane">
          <CalendarView sessionDates={Object.keys(journalEntries)} />
        </main>
      )}

      {view === "journal" && (
        <main className="single-pane">
          <Journal
            journal={journalEntry}
            setJournal={setJournalEntry}
            onSave={handleSaveJournal}
          />
        </main>
      )}

      {view === "shop" && (
        <main className="single-pane">
          <ShopView
            coins={coins}
            setCoins={setCoins}
            inventory={inventory}
            setInventory={setInventory}
            items={items}
            setItems={setItems}
          />
        </main>
      )}

      {view === "crafting" && (
        <main className="single-pane">
          <CraftingView
            plantedPlants={plantedPlants}
            onCraft={handleCraft}
          />
        </main>
      )}

      <MusicPlayer />

      {/* Mini-game overlays */}
      {activeMiniGame === "water" && (
        <WaterMiniGame
          onResult={result => {
            console.log("Water result:", result);
            setActiveMiniGame(null);

            setPlantedPlants(plants =>
              plants.map(p =>
                p.instanceId === activePlantId
                  ? {
                      ...p,
                      waterLevel: result === "fail" ? p.waterLevel : 100,
                      mood: result === "perfect" ? "radiant" : "happy",
                      stage:
                        result === "perfect" && p.stage < 3
                          ? (forecast[0].name === "Cold Snap" && p.stage === 2
                              ? 2
                              : p.stage + 1)
                          : p.stage,
                      lastCareTime:
                        result === "fail" ? p.lastCareTime : Date.now()
                    }
                  : p
              )
            );

            if (result !== "fail") {
              setWaterCount(c => c + 1);
              let points = result === "perfect" ? 10 : 5;
              if (forecast[0].name === "Sunny") points = Math.floor(points * 1.5);
              if (forecast[0].name === "Foggy") points = Math.floor(points * 0.5);
              setHarmony(h => {
                const newH = Math.min(100, h + points);
                if (newH >= 90)
                  setDailyGoals(gs =>
                    gs.map(g => (g.id === 3 ? { ...g, completed: true } : g))
                  );
                return newH;
              });
              setDailyGoals(gs =>
                gs.map(g =>
                  g.id === 1 && !g.completed && waterCount + 1 >= 3
                    ? { ...g, completed: true }
                    : g
                )
              );
            }
          }}
        />
      )}

      {activeMiniGame === "fertilize" && (
        <FertilizeMiniGame
          onResult={result => {
            console.log("Fertilize result:", result);
            setActiveMiniGame(null);

            setPlantedPlants(plants =>
              plants.map(p =>
                p.instanceId === activePlantId
                  ? {
                      ...p,
                      mood:
                        result === "fail"
                          ? p.mood
                          : result === "perfect"
                          ? "radiant"
                          : "happy",
                      stage:
                        result !== "fail" && p.stage < 3
                          ? (forecast[0].name === "Cold Snap" && p.stage === 2
                              ? 2
                              : Math.min(3, p.stage + 1))
                          : p.stage,
                      lastCareTime:
                        result === "fail" ? p.lastCareTime : Date.now()
                    }
                  : p
              )
            );

            if (result !== "fail") {
              setFertilizeCount(c => c + 1);
              let points = result === "perfect" ? 8 : 5;
              if (forecast[0].name === "Sunny") points = Math.floor(points * 1.5);
              if (forecast[0].name === "Foggy") points = Math.floor(points * 0.5);
              setHarmony(h => {
                const newH = Math.min(100, h + points);
                if (newH >= 90)
                  setDailyGoals(gs =>
                    gs.map(g => (g.id === 3 ? { ...g, completed: true } : g))
                  );
                return newH;
              });
              setDailyGoals(gs =>
                gs.map(g =>
                  g.id === 2 && !g.completed && fertilizeCount + 1 >= 2
                    ? { ...g, completed: true }
                    : g
                )
              );
            }
          }}
        />
      )}
    </div>
  );
}
