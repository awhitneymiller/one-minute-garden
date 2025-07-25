// src/App.jsx
import { useState, useEffect } from "react";
import { format } from "date-fns";
import "./index.css";

import {
  auth,
  db,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "./firebase";

import { allPlants } from "./data/plants";
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

export default function App() {
  // --- Starter seeds definition ---
  const starterSeeds = allPlants.slice(0, 3).map(({ id, name, image }) => ({
    id,
    name,
    image,
  }));

  // --- State ---
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [inventory, setInventory] = useState(starterSeeds);
  const [plantedPlants, setPlantedPlants] = useState([]);
  const [view, setView] = useState("garden");
  const [forecast] = useState(generateForecast());
  const [dailyGoals] = useState(generateGoals());
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("omg-theme") || "light"
  );

  // Mini-game
  const [activeMiniGame, setActiveMiniGame] = useState(null);
  const [activePlantId, setActivePlantId] = useState(null);

  // --- Persist theme ---
  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("omg-theme", theme);
  }, [theme]);

  // --- Auth + Firestore load & starter-seed fallback ---
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
        // if inventory empty, use starterSeeds and update Firestore
        if (!d.inventory || d.inventory.length === 0) {
          setInventory(starterSeeds);
          await updateDoc(ref, { inventory: starterSeeds });
        } else {
          setInventory(d.inventory);
        }
        setPlantedPlants(d.plantedPlants || []);
        setCoins(d.coins || 0);
        setStreak(d.streak || 0);
      } else {
        // first-time user: init with starterSeeds
        const init = {
          inventory: starterSeeds,
          plantedPlants: [],
          coins: 0,
          streak: 0,
        };
        await setDoc(ref, init);
        setInventory(starterSeeds);
      }
    });
    return unsub;
  }, []);

  // --- Save back to Firestore when relevant state changes ---
  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    updateDoc(ref, {
      inventory,
      plantedPlants,
      coins,
      streak,
    }).catch(console.error);
  }, [user, inventory, plantedPlants, coins, streak]);

  // --- Handlers ---
  function plantSeed(seed) {
    setInventory((inv) => inv.filter((i) => i.id !== seed.id));
    setPlantedPlants((plants) => [
      ...plants,
      {
        ...seed,
        stage: 0,
        waterLevel: 100,
        mood: "happy",
        instanceId: `${seed.id}-${Date.now()}`,
      },
    ]);
  }

  function handleWater(id) {
    setActivePlantId(id);
    setActiveMiniGame("water");
  }

  function handleFertilize(id) {
    setPlantedPlants((plants) =>
      plants.map((p) =>
        p.instanceId === id
          ? { ...p, stage: Math.min(3, p.stage + 1), mood: "radiant" }
          : p
      )
    );
  }

  function handleSell(id) {
    setPlantedPlants((plants) => plants.filter((p) => p.instanceId !== id));
    setCoins((c) => c + 10);
  }

  // --- Render guard ---
  if (!authChecked) return null;
  if (!user) return <Auth />;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🌿 One Minute Garden</h1>
        <nav className="nav">
          {["garden", "map", "recipes", "calendar", "journal", "shop"].map(
            (v) => (
              <button
                key={v}
                className={view === v ? "active" : ""}
                onClick={() => setView(v)}
              >
                {v}
              </button>
            )
          )}
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
              {dailyGoals.map((g) => (
                <li key={g.id}>{g.description}</li>
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
                {plantedPlants.map((p) => (
                  <PlantCard
                    key={p.instanceId}
                    plant={p}
                    onWater={handleWater}
                    onFertilize={handleFertilize}
                    onSell={handleSell}
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
            bloomCount={plantedPlants.filter((p) => p.stage === 3).length}
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
          <CalendarView sessionDates={[]} />
        </main>
      )}

      {view === "journal" && (
        <main className="single-pane">
          <Journal />
        </main>
      )}

      {view === "shop" && (
        <main className="single-pane">
          <ShopView
            coins={coins}
            setCoins={setCoins}
            inventory={inventory}
            setInventory={setInventory}
          />
        </main>
      )}

      <MusicPlayer />

      {activeMiniGame === "water" && (
        <WaterMiniGame
          onResult={(result) => {
            setActiveMiniGame(null);
            setPlantedPlants((plants) =>
              plants.map((p) =>
                p.instanceId === activePlantId
                  ? {
                      ...p,
                      waterLevel: result === "fail" ? p.waterLevel : 100,
                      mood: result === "perfect" ? "radiant" : "happy",
                      stage:
                        result === "perfect" && p.stage < 3
                          ? p.stage + 1
                          : p.stage,
                    }
                  : p
              )
            );
          }}
        />
      )}
    </div>
  );
}
