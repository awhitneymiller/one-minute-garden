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
import { getRandomChallenge } from "./logic/mindfulnessChallenges";
import { calculateMood } from "./logic/calculateMood";

import Auth from "./components/Auth";
import DebugMenu from "./components/DebugMenu";
import WeatherForecast from "./components/WeatherForecast";
import SeedInventory from "./components/SeedInventory";
import StoryPanel from "./components/StoryPanel";
import Journal from "./components/Journal";
import PlantCard from "./components/PlantCard";
import MapView from "./components/MapView";
import PlantRecipes from "./components/PlantRecipes";
import StreakDisplay from "./components/StreakDisplay";
import CalendarView from "./components/CalendarView";
import ThemeToggle from "./components/ThemeToggle";
import MusicPlayer from "./components/MusicPlayer";
import ShopView from "./components/ShopView";

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const starterSeeds = allPlants.slice(0, 3).map(({ id, name }) => ({ id, name }));
  const [inventory, setInventory] = useState(starterSeeds);
  const [plantedPlants, setPlantedPlants] = useState([]);
  const [view, setView] = useState("garden");

  const [journal, setJournal] = useState("");
  const [forecast, setForecast] = useState(generateForecast());
  const [dailyGoals, setDailyGoals] = useState(generateGoals());

  const [coins, setCoins] = useState(0);
  const [xp, setXp] = useState(0);

  const [theme, setTheme] = useState(() => localStorage.getItem("omg-theme") || "light");

  const [challenge, setChallenge] = useState(() => {
    const stored = localStorage.getItem("omg-mindfulness");
    return stored ? JSON.parse(stored) : getRandomChallenge();
  });
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [today, setToday] = useState(() => format(new Date(), "yyyy-MM-dd"));

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("omg-theme", theme);
  }, [theme]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setAuthChecked(true);
      if (u) {
        setUser(u);
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const d = snap.data();
          const mergedInventory = [
            ...starterSeeds,
            ...(d.inventory || []).filter((item) => !starterSeeds.find((s) => s.id === item.id)),
          ];
          setInventory(mergedInventory);
          setPlantedPlants(
            (d.plantedPlants || []).map((p, i) => ({
              ...p,
              instanceId: p.instanceId || `${p.id}-${i}`,
              mood: p.mood || "happy",
              lastCareTime: p.lastCareTime || Date.now(),
              waterLevel: p.waterLevel ?? 100,
            }))
          );
          setCoins(d.coins || 0);
          setXp(d.xp || 0);
        } else {
          const init = {
            inventory: starterSeeds,
            plantedPlants: [],
            coins: 0,
            xp: 0,
          };
          await setDoc(ref, init);
        }
      } else {
        setUser(null);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    updateDoc(doc(db, "users", user.uid), {
      inventory,
      plantedPlants,
      coins,
      xp,
    }).catch(console.error);
  }, [user, inventory, plantedPlants, coins, xp]);

  useEffect(() => {
    const current = format(new Date(), "yyyy-MM-dd");
    if (current !== today) {
      setToday(current);
      setChallenge(getRandomChallenge());
      setChallengeComplete(false);
    }
  }, [today]);

  useEffect(() => {
    localStorage.setItem("omg-mindfulness", JSON.stringify(challenge));
  }, [challenge]);

  useEffect(() => {
    const id = setInterval(() => {
      setPlantedPlants((plants) =>
        plants.map((p) => ({
          ...p,
          waterLevel: Math.max(0, (p.waterLevel ?? 100) - 2), // fast decay
          mood: calculateMood(p),
        }))
      );
    }, 60000);
    return () => clearInterval(id);
  }, []);

  if (!authChecked) return null;
  if (!user) return <Auth />;

  function plantSeed(p) {
    setInventory((inv) => inv.filter((i) => i.id !== p.id));
    setPlantedPlants((plants) => [
      ...plants,
      {
        ...p,
        stage: 0,
        watered: false,
        fertilized: false,
        rewarded: false,
        mood: "happy",
        waterLevel: 100,
        lastCareTime: Date.now(),
        instanceId: `${p.id}-${Date.now()}`,
      },
    ]);
  }

  function handleWater(instanceId) {
    setPlantedPlants((plants) =>
      plants.map((p) =>
        p.instanceId === instanceId
          ? {
              ...p,
              waterLevel: 100,
              lastCareTime: Date.now(),
              mood: "happy",
            }
          : p
      )
    );
  }

  function handleFertilize(instanceId) {
    setPlantedPlants((plants) =>
      plants.map((p) =>
        p.instanceId === instanceId && !p.fertilized
          ? {
              ...p,
              fertilized: true,
              stage: Math.min(3, p.stage + 1),
              lastCareTime: Date.now(),
              mood: "radiant",
            }
          : p
      )
    );
  }

  function handleSell(instanceId) {
    setPlantedPlants((plants) => {
      const sold = plants.find((p) => p.instanceId === instanceId);
      if (sold && sold.stage === 3) setCoins((c) => c + 10);
      return plants.filter((p) => p.instanceId !== instanceId);
    });
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🌿 One Minute Garden</h1>
        <nav className="nav">
          {["garden", "map", "recipes", "shop"].map((v) => (
            <button key={v} className={view === v ? "active" : ""} onClick={() => setView(v)}>
              {v}
            </button>
          ))}
        </nav>
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <MusicPlayer />
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

          <section className="card mindfulness">
            <h3>🧘 Mindfulness</h3>
            <p>{challenge.text}</p>
            {challengeComplete ? (
              <p className="complete-msg">✅ Completed today</p>
            ) : (
              <button
                onClick={() => {
                  setChallengeComplete(true);
                  setCoins((c) => c + 5);
                }}
              >
                Mark as Complete
              </button>
            )}
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
          <MapView bloomCount={plantedPlants.filter((p) => p.stage === 3).length} />
        </main>
      )}

      {view === "recipes" && (
        <main className="single-pane">
          <PlantRecipes plants={allPlants} />
        </main>
      )}

      {view === "shop" && (
        <main className="single-pane">
          <ShopView
            inventory={inventory}
            setInventory={setInventory}
            coins={coins}
            setCoins={setCoins}
          />
        </main>
      )}
    </div>
  );
}
