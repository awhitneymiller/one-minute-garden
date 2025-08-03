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
// Helper to fetch the next recipe step for a planted instance
function getRecipeStep(plant) {
  const def = allPlants.find(p => p.id === plant.id);
  return def?.growthRecipe?.[plant.stage];
}
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
  const [unlockedMaps, setUnlockedMaps] = useState(["meadow"]);
  const [forecast] = useState(generateForecast());  // 5-day random weather forecast
  const [dailyGoals, setDailyGoals] = useState(generateGoals());
  const [coins, setCoins] = useState(0);
  const [totalBlooms, setTotalBlooms] = useState(0);
  const [streak, setStreak] = useState(0);

  // Gameplay states
  const [harmony, setHarmony] = useState(0);
  const [waterCount, setWaterCount] = useState(0);
  const [fertilizeCount, setFertilizeCount] = useState(0);
  const [items, setItems] = useState({ premiumFertilizer: 0, compost: 0, potions: 0 });
  const [journalEntries, setJournalEntries] = useState({});
  const [journalEntry, setJournalEntry] = useState("");
  const [dailyStats, setDailyStats] = useState({});
  const [activeMiniGame, setActiveMiniGame] = useState(null);
  const [activePlantId, setActivePlantId] = useState(null);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("omg-theme") || "light"
  );
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
   const todayWeather = forecast[currentDayIndex].name;

  // 🔧 1. Add loaded state
  const [loaded, setLoaded] = useState(false);

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
        setLoaded(false); // Reset loaded if logged out
        return;
      }
      setUser(u);
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);   
      if (snap.exists()) {
        const d = snap.data();
        setUnlockedMaps(d.unlockedMaps || ["meadow"]);
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
        // Load any saved per-day stats
        const loadedStats = d.dailyStats || {};
        setDailyStats(loadedStats);
        // Populate today's journal entry if already exists
        const todayKey = format(new Date(), "yyyy-MM-dd");
        setJournalEntry(loadedJournal[todayKey] || "");
        // Load planted plants and apply time-based effects (water depletion, wilting)
        let plants = d.plantedPlants || [];
        const now = Date.now();
        plants = plants.map(p => {
          let newPlant = { ...p };
          const minutesSinceCare = (now - (p.lastCareTime || now)) / 60000;
          // Decrease water level over time (linear to 0 over 10minutes)
          let newWaterLevel = p.waterLevel ?? 100;
          if (minutesSinceCare >= 10) {
            newWaterLevel = 0;
          } else if (minutesSinceCare >= 0) {
            const proportion = Math.min(1, minutesSinceCare / 10);
            newWaterLevel = Math.max(0, Math.floor(100 * (1 - proportion)));
          }
          // Weather effect: Rainy day fully hydrates plants
          if (todayWeather === "Rainy") {
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
          return {
            ...newPlant,
            wrongAttempts: p.wrongAttempts || 0,   // ← bring in (or init) the counter
            waterLevel: newPlant.waterLevel,
            stage:     newPlant.stage,
            mood:      newPlant.mood
          };
        });
        setPlantedPlants(plants);
        setCoins(d.coins || 0);
        setStreak(d.streak || 0);
        setTotalBlooms(d.totalBlooms || 0);
      } else {
        // first-time user:
        const initData = {
          inventory: starterSeeds,
          plantedPlants: [],
          coins: 0,
          streak: 0,
          totalBlooms: 0,
          items: { premiumFertilizer: 0, compost: 0, potions: 0 },
          journal: {},
          unlockedMaps: ["meadow"]          
        };  
        await setDoc(ref, initData);
        setInventory(starterSeeds);
        setPlantedPlants([]);
        setCoins(0);
        setStreak(0);
        setItems({ premiumFertilizer: 0, compost: 0, potions: 0 });
        setJournalEntries({});
        setJournalEntry("");
        setTotalBlooms(0);
      }
      // 🔧 2. Set loaded true after all state is set
      setLoaded(true);
    });
    return unsub;
  }, []);

  // --- Save state back to Firestore on changes ---
  useEffect(() => {
    // 🔧 3. Only save if loaded
    if (!user || !loaded) return;
    const ref = doc(db, "users", user.uid);
    updateDoc(ref, {
      inventory,
      plantedPlants,
      coins,
      streak,
      items,
      totalBlooms,
      unlockedMaps,
      dailyStats,
    }).catch(console.error);
  }, [user, inventory, plantedPlants, coins, streak, items, totalBlooms, loaded]);

  useEffect(() => {
  const id = setInterval(() => {
    setCurrentDayIndex(i => (i + 1) % forecast.length);
  }, 60_000); // every minute

  return () => clearInterval(id);
}, [forecast.length]);

  // --- Handlers --- !!!!!!!!!!!!!
  function plantSeed(seed) {
    // Only allow up to 3 plants in garden at once
    if (plantedPlants.length >= 3) {
      alert("You can have at most 3 plants in your garden.");
      return;
    }
    // Remove just one matching seed from inventory
    setInventory(inv => {
      const idx = inv.findIndex(i => i.id === seed.id);
      if (idx < 0) return inv;
      return [...inv.slice(0, idx), ...inv.slice(idx + 1)];
    });
    setPlantedPlants(plants => [
      ...plants,
      {
        ...seed,
        stage: 0,
        waterLevel: 100,
        mood: "happy",
        lastCareTime: Date.now(),
        wrongAttempts: 0,
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
  console.log("compost!", id, items.compost) 
  if (items.compost <= 0) return;
  // 1) consume the resource
  setItems(it => ({ ...it, compost: it.compost - 1 }));

  // find old stage for this plant
  const prevStage = plantedPlants.find(p => p.instanceId === id)?.stage ?? 0;
  const nextStage = Math.min(3, prevStage + 1);

  // 2) advance that plant’s stage
  setPlantedPlants(ps =>
    ps.map(p =>
      p.instanceId === id
        ? {
            ...p,
            stage: nextStage,
            mood: "radiant",
            lastCareTime: Date.now()
          }
        : p
    )
  );

  // if just bloomed, bump counter
  if (prevStage < 3 && nextStage === 3) {
    setTotalBlooms(tb => tb + 1);
  }

  // 3) award harmony
  setHarmony(h => Math.min(100, h + 7));
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

  function handleSell(instanceId) {
  // Find the planted instance
  const plantToSell = plantedPlants.find(p => p.instanceId === instanceId);
  if (!plantToSell) return;

  // Remove it from the garden
  setPlantedPlants(plants =>
    plants.filter(p => p.instanceId !== instanceId)
  );

  // Look up its definition for the sellValue
  const def = allPlants.find(pl => pl.id === plantToSell.id);
  const reward = def?.sellValue ?? 0;

  // Award coins
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
    const prevStage = plantedPlants.find(p => p.instanceId === id)?.stage ?? 0;
    const nextStage = Math.min(3, prevStage + 1);

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

    if (prevStage < 3 && nextStage === 3) {
      setTotalBlooms(tb => tb + 1);
    }

    // Count as a fertilize action
    setFertilizeCount(count => count + 1);
    // Add harmony points (treat as perfect fertilize)
    let points = 8;
    if (todayWeather === "Sunny") points = Math.floor(points * 1.5);
    if (todayWeather === "Foggy") points = Math.floor(points * 0.5);
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
    const statsSnapshot = {
  blooms: totalBlooms,
  harmony,
  coins
};

setDailyStats(prev => ({ ...prev, [todayKey]: statsSnapshot }));

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

  function tryWeatherAction(instanceId) {
  const plant = plantedPlants.find(p => p.instanceId === instanceId);
  const step  = getRecipeStep(plant);

  if (!step || step.action !== "weather" || step.condition !== todayWeather) {
    alert("The weather isn’t right for this stage!");
    return;
  }

  // capture old and compute new
  const prevStage = plant.stage;
  const newStage  = prevStage + 1;

  // update that one plant
  setPlantedPlants(ps =>
    ps.map(p =>
      p.instanceId === instanceId
        ? { ...p, stage: newStage, lastCareTime: Date.now() }
        : p
    )
  );

  // if we just crossed into bloom, bump totalBlooms
  if (prevStage < 3 && newStage === 3) {
    setTotalBlooms(tb => tb + 1);
  }
}


  // --- Guard before render ---
  if (!authChecked) return null;
  if (!user) return <Auth />;

  return (
    <div className={`app-container map-${currentMap}
                  weather-${forecast[currentDayIndex].name.toLowerCase().replace(/\s+/g,"-")}`}>

      <header className="app-header">
        <h1>⚘Garden of Reflection⚘</h1>
        <nav className="nav">
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
        <button className="pill-button" onClick={() => setTheme(theme === "light" ? "dark" : "light")}> Dark Mode </button>
        <button className="logout-btn pill-button" onClick={() => signOut(auth)}>
          Log Out
        </button>
      </header>

      {view === "garden" && (
        <main className="dashboard">
          <section className="card stats">
  <h3>📊 Your Stats</h3>
  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
    <li>💰 Coins: {coins}</li>
    <li>🌸 Total Blooms: {totalBlooms}</li>
    <li>✨ Harmony: {harmony}</li>
  </ul>
</section>

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
      <WeatherForecast
        forecast={forecast}
        currentDayIndex={currentDayIndex}
      />
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
                    weather={forecast[currentDayIndex].name}
                    onWater={handleWater}
                    onFertilize={handleFertilize}
                    onPremiumFertilize={handlePremiumFertilize}
                    onWeatherAction={tryWeatherAction}
                    weather={todayWeather}
                    onSell={handleSell}
                    onRevive={handleRevive}
                    hasPremium={items.premiumFertilizer > 0}
                    onCompost={handleCompost}
                    hasCompost={items.compost}
                    onCraft={handleCraft}
                  />
                ))}
              </div>
            )}
          </section>
          <section className="card inventory">
            <h3>🧰 Your Supplies</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>🥇 Premium Fertilizer: {items.premiumFertilizer}</li>
              <li>🍂 Compost: {items.compost}</li>
            </ul>
          </section>
        </main>
      )}

      {view === "map" && (
  <main className="single-pane">
    <MapView
      bloomCount={totalBlooms}
      coins={coins}
      setCoins={setCoins}
      currentMap={currentMap}
      onSelectMap={setCurrentMap}
      unlockedMaps={unlockedMaps}
      setUnlockedMaps={setUnlockedMaps}
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
          <CalendarView sessionStats={dailyStats} />
        </main>
      )}

      {view === "journal" && (
        <main className="single-pane">
          <Journal
            journal={journalEntry}
            setJournal={setJournalEntry}
            onSave={handleSaveJournal}
            entries={journalEntries}            // ← pass the full history
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
            currentBiome={currentMap}
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
      setActiveMiniGame(null);
      // 0) fetch the plant & its next recipe step
      const plant = plantedPlants.find(p => p.instanceId === activePlantId);
      const step  = getRecipeStep(plant);
      // 1) must be a water step, and if minAccuracy is "perfect", require that
      if (!step || step.action !== "water"
    || (step.minAccuracy === "perfect" && result !== "perfect")) {
  // ← NEW: bump wrongAttempts and wilt on 3
  setPlantedPlants(ps =>
    ps.map(p =>
      p.instanceId === activePlantId
        ? {
            ...p,
            wrongAttempts: (p.wrongAttempts || 0) + 1,
            stage: p.wrongAttempts + 1 >= 3 ? 4 : p.stage,
            mood:  p.wrongAttempts + 1 >= 3 ? "wilted" : p.mood
          }
        : p
    )
  );
  alert("That action isn’t the right next step for this plant!");
  return;
}


      // 1) grab previous stage
      const prevStage =
        plantedPlants.find(p => p.instanceId === activePlantId)?.stage ?? 0;

      // 2) compute new stage (respecting Cold Snap)
      let newStage = prevStage;
      if (result !== "fail" && prevStage < 3) {
        newStage =
          todayWeather === "Cold Snap" && prevStage === 2
            ? 2
            : prevStage + 1;
      }

      // 3) update that one plant
      setPlantedPlants(ps =>
        ps.map(p =>
          p.instanceId === activePlantId
            ? {
                ...p,
                waterLevel: result === "fail" ? p.waterLevel : 100,
                mood: result === "perfect" ? "radiant" : "happy",
                stage: newStage,
                lastCareTime:
                  result === "fail" ? p.lastCareTime : Date.now(),
              }
            : p
        )
      );

      // 4) if we just crossed into bloom, bump totalBlooms
      if (prevStage < 3 && newStage === 3) {
        setTotalBlooms(tb => tb + 1);
      }

      // 5) your existing points/harmony/dailyGoals logic
      if (result !== "fail") {
        setWaterCount(c => c + 1);
        let points = result === "perfect" ? 10 : 5;
        if (todayWeather === "Sunny") points = Math.floor(points * 1.5);
        if (todayWeather === "Foggy") points = Math.floor(points * 0.5);
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
      setActiveMiniGame(null);
      // 0) fetch the plant & its next recipe step
      const plant = plantedPlants.find(p => p.instanceId === activePlantId);
      const step  = getRecipeStep(plant);
      // 1) must be a standard‐fertilize step
      if (!step || step.action !== "fertilize" || step.type !== "standard") {
  // ← NEW: bump wrongAttempts and wilt on 3
  setPlantedPlants(ps =>
    ps.map(p =>
      p.instanceId === activePlantId
        ? {
            ...p,
            wrongAttempts: (p.wrongAttempts || 0) + 1,
            stage: p.wrongAttempts + 1 >= 3 ? 4 : p.stage,
            mood:  p.wrongAttempts + 1 >= 3 ? "wilted" : p.mood
          }
        : p
    )
  );
  alert("Standard fertilizer isn’t the right next step for this plant!");
  return;
}

      // 1) grab previous stage
      const prevStage =
        plantedPlants.find(p => p.instanceId === activePlantId)?.stage ?? 0;

      // 2) compute new stage (respecting Cold Snap)
      let newStage = prevStage;
      if (result !== "fail" && prevStage < 3) {
        newStage =
          todayWeather === "Cold Snap" && prevStage === 2
            ? 2
            : prevStage + 1;
      }

      // 3) update that one plant
      setPlantedPlants(ps =>
        ps.map(p =>
          p.instanceId === activePlantId
            ? {
                ...p,
                stage: newStage,
                mood:
                  result === "perfect"
                    ? "radiant"
                    : result === "okay"
                    ? "happy"
                    : p.mood,
                lastCareTime: Date.now(),
              }
            : p
        )
      );

      // 4) if we just crossed into bloom, bump totalBlooms
      if (prevStage < 3 && newStage === 3) {
        setTotalBlooms(tb => tb + 1);
      }

      // 5) your existing points/harmony/dailyGoals logic
      if (result !== "fail") {
        setFertilizeCount(c => c + 1);
        let points = result === "perfect" ? 8 : 5;
        if (todayWeather === "Sunny") points = Math.floor(points * 1.5);
        if (todayWeather === "Foggy") points = Math.floor(points * 0.5);
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